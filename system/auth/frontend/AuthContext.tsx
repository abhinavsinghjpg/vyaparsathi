import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserSession } from '@/types/schema';
import {
  type RegisteredUser,
  type UserBusiness,
  getRegisteredUsers,
  findUserByIdentifier,
  generateNextUserId,
  saveUser,
  DEMO_ABHINAV,
  getStoreDashboardData,
} from '../backend/users.db';

interface AuthContextType {
  user: UserSession;
  registeredUser: RegisteredUser | null;
  isOwner: boolean;
  isVisitor: boolean;
  toggleUserMode: () => void;
  loginWithCredentials: (
    identifier: string,
    secret: string,
    isOtp: boolean
  ) => { success: boolean; error?: string };
  signupUser: (params: {
    name: string;
    phone: string;
    email: string;
    otpDelivery: 'SMS' | 'Email';
    otp: string;
    password?: string;
  }) => { success: boolean; error?: string; user?: RegisteredUser };
  registerBusiness: (
    businessData: Omit<UserBusiness, 'isVerified'> & { isVerified?: boolean }
  ) => void;
  loginAsDemoOwner: () => void;
  loginAsOwner: (ownerName?: string, businessName?: string) => void;
  logoutToVisitor: () => void;
}

const GUEST_USER: UserSession = {
  id: 'user-guest',
  name: 'Guest Explorer',
  email: 'guest@vyaparmap.internal',
  role: 'visitor',
};

function userSessionFromRegistered(reg: RegisteredUser): UserSession {
  return {
    id: reg.id,
    name: reg.name,
    email: reg.email,
    phone: reg.phone,
    role: 'business_owner',
    businessName: reg.business?.businessName,
    businessType: reg.business?.businessType,
    city: reg.business?.city || 'Jaipur',
    isVerified: Boolean(reg.business?.isVerified),
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const mode = localStorage.getItem('vm_user_mode');
    if (mode === 'business_owner') {
      const activeId = localStorage.getItem('vm_active_userid') || '000001';
      const found = findUserByIdentifier(activeId);
      return found || DEMO_ABHINAV;
    }
    return null;
  });

  const [user, setUser] = useState<UserSession>(() => {
    if (registeredUser) {
      return userSessionFromRegistered(registeredUser);
    }
    return GUEST_USER;
  });

  useEffect(() => {
    if (user.role === 'business_owner' && registeredUser) {
      localStorage.setItem('vm_user_mode', 'business_owner');
      localStorage.setItem('vm_active_userid', registeredUser.id);
    } else {
      localStorage.setItem('vm_user_mode', 'visitor');
      localStorage.removeItem('vm_active_userid');
    }
  }, [user, registeredUser]);

  const toggleUserMode = () => {
    if (user.role === 'visitor') {
      loginAsDemoOwner();
    } else {
      logoutToVisitor();
    }
  };

  const loginWithCredentials = (
    identifier: string,
    secret: string,
    isOtp: boolean
  ): { success: boolean; error?: string } => {
    const existing = findUserByIdentifier(identifier);
    if (!existing) {
      return {
        success: false,
        error: `No registered account found for "${identifier}". Please register first.`,
      };
    }

    if (isOtp) {
      const validOtp = existing.defaultOtp || '111111';
      if (secret.trim() !== validOtp && secret.trim() !== '111111') {
        return { success: false, error: 'Invalid verification OTP. (Demo default is 111111)' };
      }
    } else {
      if (existing.password && secret !== existing.password) {
        return { success: false, error: 'Incorrect password. Try OTP login with 111111.' };
      }
    }

    setRegisteredUser(existing);
    setUser(userSessionFromRegistered(existing));
    return { success: true };
  };

  const signupUser = (params: {
    name: string;
    phone: string;
    email: string;
    otpDelivery: 'SMS' | 'Email';
    otp: string;
    password?: string;
  }): { success: boolean; error?: string; user?: RegisteredUser } => {
    const { name, phone, email, otpDelivery, otp, password } = params;

    if (otp.trim() !== '111111') {
      return { success: false, error: 'Invalid verification OTP. Enter default demo OTP 111111.' };
    }

    const existing = findUserByIdentifier(email) || findUserByIdentifier(phone);
    if (existing) {
      return {
        success: false,
        error: 'An account already exists with this email or phone. Please sign in.',
      };
    }

    const nextId = generateNextUserId();
    const newUser: RegisteredUser = {
      id: nextId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password: password || 'Vyapar@123',
      otpDelivery,
      defaultOtp: '111111',
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);
    setRegisteredUser(newUser);
    setUser(userSessionFromRegistered(newUser));

    return { success: true, user: newUser };
  };

  const registerBusiness = (
    businessData: Omit<UserBusiness, 'isVerified'> & { isVerified?: boolean }
  ) => {
    const currentUser = registeredUser || DEMO_ABHINAV;
    const isVerified = businessData.isVerified ?? (currentUser.id === '000001');

    const updatedBiz: UserBusiness = {
      ...businessData,
      isVerified,
      registeredAt: new Date().toISOString(),
    };

    const updatedUser: RegisteredUser = {
      ...currentUser,
      business: updatedBiz,
    };

    saveUser(updatedUser);
    setRegisteredUser(updatedUser);
    setUser(userSessionFromRegistered(updatedUser));

    // Ensure dashboard data is generated and saved under appropriate key
    getStoreDashboardData(updatedUser);
  };

  const loginAsDemoOwner = () => {
    const abhinav = findUserByIdentifier('000001') || DEMO_ABHINAV;
    setRegisteredUser(abhinav);
    setUser(userSessionFromRegistered(abhinav));
  };

  const loginAsOwner = (ownerName = 'Abhinav Choudhary', businessName = 'Atrix') => {
    const current = registeredUser || DEMO_ABHINAV;
    const updated: RegisteredUser = {
      ...current,
      name: ownerName,
      business: {
        businessName: businessName,
        businessType: current.business?.businessType || 'Cafe',
        location: current.business?.location || 'C-scheme, Jaipur, Raj',
        city: current.business?.city || 'Jaipur',
        ownerName: ownerName,
        businessEmail: current.business?.businessEmail || current.email,
        businessPhone: current.business?.businessPhone || current.phone,
        landAreaSqft: current.business?.landAreaSqft || 650,
        avgDailyFootfall: current.business?.avgDailyFootfall || 520,
        isVerified: true,
        registeredMode: 'existing',
      },
    };
    saveUser(updated);
    setRegisteredUser(updated);
    setUser(userSessionFromRegistered(updated));
  };

  const logoutToVisitor = () => {
    setRegisteredUser(null);
    setUser(GUEST_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        registeredUser,
        isOwner: user.role === 'business_owner',
        isVisitor: user.role === 'visitor',
        toggleUserMode,
        loginWithCredentials,
        signupUser,
        registerBusiness,
        loginAsDemoOwner,
        loginAsOwner,
        logoutToVisitor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


