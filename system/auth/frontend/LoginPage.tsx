import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, Sparkles, ShieldCheck, KeyRound, User, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from './AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithCredentials, signupUser, loginAsDemoOwner } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login State
  const [identifier, setIdentifier] = useState('Abhinav@gmail.com');
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('password');
  const [loginPassword, setLoginPassword] = useState('Abhinav@123');
  const [loginOtp, setLoginOtp] = useState('111111');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [otpSentNotice, setOtpSentNotice] = useState(false);

  // Register State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regOtpPref, setRegOtpPref] = useState<'SMS' | 'Email'>('SMS');
  const [regPassword, setRegPassword] = useState('');
  const [regOtp, setRegOtp] = useState('111111');
  const [regOtpDispatched, setRegOtpDispatched] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccessUser, setRegSuccessUser] = useState<{ id: string; name: string } | null>(null);

  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    setTimeout(() => {
      const secret = loginMethod === 'otp' ? loginOtp : loginPassword;
      const res = loginWithCredentials(identifier, secret, loginMethod === 'otp');
      setLoading(false);

      if (res.success) {
        navigate('/owner/dashboard');
      } else {
        setLoginError(res.error || 'Authentication failed. Please verify credentials.');
      }
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regOtpDispatched) {
      setRegOtpDispatched(true);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = signupUser({
        name: regName,
        phone: regPhone,
        email: regEmail,
        otpDelivery: regOtpPref,
        otp: regOtp,
        password: regPassword || 'Vyapar@123',
      });
      setLoading(false);

      if (res.success && res.user) {
        setRegSuccessUser({ id: res.user.id, name: res.user.name });
        setTimeout(() => {
          navigate('/owner/dashboard');
        }, 1200);
      } else {
        setRegError(res.error || 'Registration failed.');
      }
    }, 500);
  };

  const handleInstantDemo = () => {
    loginAsDemoOwner();
    navigate('/owner/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 max-w-4xl w-full rounded-3xl border border-border/80 bg-card overflow-hidden shadow-2xl">
        {/* Left Side: Brand Narrative & Demo Stats */}
        <div className="lg:col-span-5 p-8 bg-gradient-to-b from-card to-muted/50 border-b lg:border-b-0 lg:border-r border-border/70 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center font-serif font-black text-brand-dark text-xs shadow-md">
                VM
              </div>
              <span className="text-sm font-bold tracking-tight text-foreground">
                Vyapar<span className="text-gold-400">Map</span>
              </span>
            </div>

            <h2 className="text-2xl font-serif font-bold text-foreground leading-tight">
              Location intelligence for serious retail founders.
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sign in to manage your private store lease, review hourly customer walk-in telemetry, and benchmark against competing corridors.
            </p>
          </div>

          {/* Quick Demo Access Card */}
          <div className="p-4 rounded-2xl border border-gold-500/30 bg-gold-500/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold font-mono text-gold-400 uppercase">
                <Sparkles size={14} /> 1-Click Evaluation
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-300 font-bold">
                ID: 000001
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-foreground/85">
              <div className="font-semibold text-foreground">Abhinav Choudhary • Atrix Cafe</div>
              <div className="text-muted-foreground">C-scheme, Jaipur • Verified Store Telemetry</div>
            </div>
            <Button
              variant="gold"
              size="sm"
              onClick={handleInstantDemo}
              className="w-full text-xs font-bold gap-2 justify-center"
            >
              <ShieldCheck size={14} /> Sign In as Abhinav (Demo)
            </Button>
          </div>

          <div className="text-[10px] font-mono text-muted-foreground">
            VyaparMap Security • Zero-Knowledge Telemetry
          </div>
        </div>

        {/* Right Side: Login & Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/50 border border-border/60 max-w-xs">
            <button
              onClick={() => {
                setTab('login');
                setLoginError('');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                tab === 'login' ? 'bg-card text-foreground font-bold shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setTab('register');
                setRegError('');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                tab === 'register' ? 'bg-card text-foreground font-bold shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* TAB 1: SIGN IN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Email, Phone Number, or User ID
                </label>
                <Input
                  required
                  placeholder="e.g. Abhinav@gmail.com / 9999999999 / 000001"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  leftIcon={<Mail size={14} />}
                />
              </div>

              {/* Login Method Toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-muted-foreground">Authentication Mode:</span>
                <div className="flex items-center gap-1 bg-muted/50 p-0.5 rounded-lg text-[11px] font-medium border border-border/50">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`px-2.5 py-0.5 rounded-md transition-colors ${
                      loginMethod === 'password' ? 'bg-card font-bold text-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('otp')}
                    className={`px-2.5 py-0.5 rounded-md transition-colors ${
                      loginMethod === 'otp' ? 'bg-card font-bold text-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    OTP Code
                  </button>
                </div>
              </div>

              {loginMethod === 'password' ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-muted-foreground">Password</label>
                    <span className="text-[10px] text-gold-400 font-mono">Demo: Abhinav@123</span>
                  </div>
                  <Input
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    leftIcon={<Lock size={14} />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-foreground text-muted-foreground"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-muted-foreground">One-Time Password (OTP)</label>
                    <button
                      type="button"
                      onClick={() => setOtpSentNotice(true)}
                      className="text-[11px] text-gold-400 hover:text-gold-300 font-mono underline"
                    >
                      Resend OTP
                    </button>
                  </div>
                  <Input
                    required
                    maxLength={6}
                    placeholder="111111"
                    value={loginOtp}
                    onChange={e => setLoginOtp(e.target.value)}
                    leftIcon={<KeyRound size={14} />}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Default demo OTP is <strong className="text-gold-400 font-mono">111111</strong>.
                  </p>
                </div>
              )}

              <Button
                variant="gold"
                size="lg"
                type="submit"
                isLoading={loading}
                className="w-full text-xs font-bold uppercase tracking-wider mt-4"
              >
                Sign In to Owner Portal
              </Button>
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {regError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccessUser && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5 animate-fade-in">
                  <CheckCircle2 size={18} className="shrink-0" />
                  <div>
                    <div className="font-bold">Account Created! Assigned ID: #{regSuccessUser.id}</div>
                    <div className="text-[11px] text-emerald-400/80">
                      Redirecting to your store registration setup...
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Full Name (Proprietor)</label>
                <Input
                  required
                  placeholder="e.g. Abhinav Choudhary"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  leftIcon={<User size={14} />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Phone Number (p.no)</label>
                  <Input
                    required
                    type="tel"
                    placeholder="9999999999"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    leftIcon={<Phone size={14} />}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                  <Input
                    required
                    type="email"
                    placeholder="name@business.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    leftIcon={<Mail size={14} />}
                  />
                </div>
              </div>

              {/* OTP Delivery Preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Send Verification OTP Through:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegOtpPref('SMS')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      regOtpPref === 'SMS'
                        ? 'border-gold-500/60 bg-gold-500/10 text-gold-300 font-bold'
                        : 'border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Phone size={13} /> SMS (Mobile)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegOtpPref('Email')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      regOtpPref === 'Email'
                        ? 'border-gold-500/60 bg-gold-500/10 text-gold-300 font-bold'
                        : 'border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Mail size={13} /> Email (Inbox)
                  </button>
                </div>
              </div>

              {/* Step 2: OTP Verification */}
              {regOtpDispatched ? (
                <div className="space-y-3 pt-2 border-t border-border/70 animate-fade-in">
                  <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-xs text-gold-300 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <Send size={13} /> OTP Dispatched to your {regOtpPref}!
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Enter the 6-digit verification code below. (Demo OTP is <span className="text-gold-400 font-mono font-bold">111111</span>)
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Enter 6-Digit OTP</label>
                    <Input
                      required
                      maxLength={6}
                      placeholder="111111"
                      value={regOtp}
                      onChange={e => setRegOtp(e.target.value)}
                      leftIcon={<KeyRound size={14} />}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Set Password (Optional)
                    </label>
                    <Input
                      type="password"
                      placeholder="e.g. Abhinav@123"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      leftIcon={<Lock size={14} />}
                    />
                  </div>

                  <Button
                    variant="gold"
                    size="lg"
                    type="submit"
                    isLoading={loading}
                    className="w-full text-xs font-bold uppercase tracking-wider mt-2"
                  >
                    Verify OTP & Generate User ID
                  </Button>
                </div>
              ) : (
                <Button
                  variant="gold"
                  size="lg"
                  type="submit"
                  className="w-full text-xs font-bold uppercase tracking-wider mt-4"
                >
                  Request Verification OTP
                </Button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


