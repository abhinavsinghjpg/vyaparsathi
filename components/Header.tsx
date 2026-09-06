import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, UserCheck, Shield, CheckCircle2, AlertCircle, LogOut, LogIn, Store, User, Database } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/system/auth/frontend/AuthContext';
import { Button } from './Button';
import { Badge } from './Badge';
import { SQLVaultModal } from './SQLVaultModal';
import { sqlVault } from '@/system/database/sqlVault';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'BusinessMap', subtitle: 'Location intelligence for deliberate expansion' },
  '/ai-advisor': { title: 'AI Advisor', subtitle: 'Location intelligence & prediction' },
  '/find-business': { title: 'Business Finder', subtitle: 'Discover optimal business setups' },
  '/map': { title: 'Map Explorer', subtitle: 'Interactive heatmap & location analysis' },
  '/franchises': { title: 'Franchise Network', subtitle: 'Discover verified franchise opportunities' },
  '/properties': { title: 'Commercial Properties', subtitle: 'High-footfall real estate map' },
  '/analytics': { title: 'Market Analytics', subtitle: 'Revenue, ROI & competitor insights' },
  '/owner/dashboard': { title: 'Owner Dashboard', subtitle: 'Private store performance & telemetry' },
  '/login': { title: 'Access Portal', subtitle: 'Sign in to VyaparMap' },
  '/loans': { title: 'Smart Scheme Router & Credit', subtitle: 'MoSJE concessional loans & 10% margin structuring (SIH 26091)' },
};

export function Header({ onToggleSidebar }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isOwner, toggleUserMode, loginAsDemoOwner, logoutToVisitor } = useAuth();
  const [notifCount, setNotifCount] = useState(3);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [sqlTxnCount, setSqlTxnCount] = useState(() => sqlVault.getTransactionLogs().length);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSqlUpdate = () => {
      setSqlTxnCount(sqlVault.getTransactionLogs().length);
    };
    window.addEventListener('vyapar_sql_event', handleSqlUpdate);
    return () => window.removeEventListener('vyapar_sql_event', handleSqlUpdate);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentMeta = PAGE_TITLES[location.pathname] || {
    title: 'VyaparMap',
    subtitle: 'Location Intelligence',
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/90 px-4 sm:px-6 backdrop-blur-md transition-all">
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
            aria-label="Toggle sidebar"
          >
            <Menu size={19} />
          </button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              {currentMeta.title}
            </h1>
            {location.pathname === '/owner/dashboard' && (
              <Badge variant="gold" className="text-[10px] uppercase font-mono">
                Private
              </Badge>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground hidden sm:block">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right side: Mode Switcher, Notifications, Theme, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live SQL DB Vault Button */}
        <button
          onClick={() => setShowSqlModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gold-500/40 bg-gold-500/10 hover:bg-gold-500/20 text-xs font-medium text-gold-400 transition-all shadow-sm group"
          title="Open Live SQL Database Vault & Real-Time Transaction Console"
        >
          <Database size={13} className="text-gold-400 group-hover:rotate-12 transition-transform" />
          <span className="font-mono font-bold hidden sm:inline">SQL DB Vault</span>
          <span className="px-1.5 py-0.2 rounded-full bg-gold-500/20 text-[10px] font-mono font-bold text-gold-300 border border-gold-500/30">
            {sqlTxnCount}
          </span>
        </button>

        {/* User Mode Toggle Pill (Guest vs Business Owner) */}
        <button
          onClick={toggleUserMode}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/80 bg-muted/30 hover:bg-muted/60 text-xs font-medium transition-all"
          title={`Click to switch to ${isOwner ? 'Guest Explorer' : 'Registered Owner'} mode`}
        >
          {isOwner ? (
            <>
              <Shield size={13} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold hidden sm:inline">Owner Mode</span>
            </>
          ) : (
            <>
              <UserCheck size={13} className="text-amber-400" />
              <span className="text-muted-foreground hidden sm:inline">Guest Mode</span>
            </>
          )}
          <span className="text-[10px] text-muted-foreground underline ml-0.5">Switch</span>
        </button>

        {/* Notifications (Requirement 11: Flagged ON only in Registered Mode) */}
        {isOwner && (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowNotifs(!showNotifs);
                setNotifCount(0);
              }}
              className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell size={17} />
              {notifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
                  {notifCount}
                </span>
              )}
            </Button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border border-border bg-card p-3 shadow-xl z-50 text-xs animate-fade-in">
                <div className="flex items-center justify-between border-b border-border pb-2 mb-2 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Store size={13} className="text-gold-400" />
                    <span>Store Telemetry Alerts</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">Live Feed</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="font-semibold text-emerald-400 flex items-center justify-between">
                      <span>Daily Revenue Settlement</span>
                      <span className="font-mono text-[10px] text-foreground">₹18,450</span>
                    </div>
                    <div className="text-muted-foreground text-[11px] mt-0.5">+14% above projected micro-market benchmark.</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
                    <div className="font-semibold text-foreground flex items-center justify-between">
                      <span>New Customer Review</span>
                      <span className="font-mono text-[10px] text-gold-400">5.0 ★</span>
                    </div>
                    <div className="text-muted-foreground text-[11px] mt-0.5">&quot;Best filter coffee & ambiance in the area!&quot; — Neha S.</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
                    <div className="font-semibold text-foreground">Peak Footfall Surge</div>
                    <div className="text-muted-foreground text-[11px] mt-0.5">Surge of 180 visitors/hr detected around 7:00 PM near entry.</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
                    <div className="font-semibold text-amber-400">Inventory Telemetry</div>
                    <div className="text-muted-foreground text-[11px] mt-0.5">Dairy & signature roast stock at 22% threshold. Restock recommended.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Interactive Profile Avatar Button & Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500/20 to-amber-600/30 border border-gold-500/40 text-xs font-bold text-gold-300 shadow-sm hover:ring-2 hover:ring-gold-400/40 transition-all cursor-pointer select-none"
            title={`${user.name} - Click for Account Profile`}
            aria-label="User profile menu"
          >
            {isOwner ? getInitials(user.name) : 'G'}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-border bg-card p-4 shadow-2xl z-50 text-xs animate-fade-in space-y-3">
              {/* User Identity Header */}
              <div className="flex items-start gap-3 border-b border-border/80 pb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center font-serif font-black text-brand-dark text-sm shadow-md shrink-0">
                  {isOwner ? getInitials(user.name) : 'VM'}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-foreground truncate">{user.name}</span>
                    {isOwner && user.id && (
                      <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-gold-500/20 text-gold-300 font-semibold shrink-0">
                        #{user.id}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                  {user.phone && (
                    <div className="text-[10px] font-mono text-muted-foreground/80 mt-0.5">
                      +91 {user.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Status / Business Details */}
              {isOwner ? (
                <div className="space-y-2 rounded-xl bg-muted/40 p-3 border border-border/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-muted-foreground">Store Profile</span>
                    {user.isVerified ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 size={11} /> Verified by VyaparMap
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        <AlertCircle size={11} /> Pending Verification
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Store size={13} className="text-gold-400" />
                    <span>{user.businessName || 'Atrix'}</span>
                    <span className="text-[10px] font-normal text-muted-foreground">
                      ({user.businessType || 'Cafe'})
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Location: {user.city || 'Jaipur'}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-amber-500/10 p-3 border border-amber-500/20 text-amber-300 text-[11px] space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <User size={13} /> Guest Explorer Mode
                  </div>
                  <p className="text-muted-foreground text-[10px]">
                    Owner telemetry and private analytics are hidden. Sign in or switch to registered mode.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-1.5 pt-1">
                {isOwner ? (
                  <>
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/owner/dashboard');
                      }}
                      className="w-full text-xs font-bold gap-2 justify-center"
                    >
                      <Store size={14} /> Open Owner Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowProfileMenu(false);
                        logoutToVisitor();
                      }}
                      className="w-full text-xs font-medium text-destructive hover:bg-destructive/10 border-destructive/20 gap-2 justify-center"
                    >
                      <LogOut size={13} /> Sign Out to Guest Mode
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/login');
                      }}
                      className="w-full text-xs font-bold gap-2 justify-center"
                    >
                      <LogIn size={14} /> Sign In / Register Account
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowProfileMenu(false);
                        loginAsDemoOwner();
                      }}
                      className="w-full text-xs font-medium text-gold-400 border-gold-500/30 hover:bg-gold-500/10 gap-1.5 justify-center"
                    >
                      <CheckCircle2 size={13} /> 1-Click Demo Login (Abhinav)
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live SQL Database Vault & Real-Time Console Modal */}
      <SQLVaultModal isOpen={showSqlModal} onClose={() => setShowSqlModal(false)} />
    </header>
  );
}

