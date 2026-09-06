import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Bot,
  Lightbulb,
  Map,
  BarChart3,
  Store,
  Building2,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Lock,
  Landmark,
} from 'lucide-react';
import { useAuth } from '@/system/auth/frontend/AuthContext';
import { cn } from './utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  to: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  badge?: string;
  locked?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const { user, isOwner, toggleUserMode, logoutToVisitor } = useAuth();

  const analyticsItems: NavItem[] = [
    { to: '/map', icon: Map, label: 'Map Explorer' },
    { to: '/analytics', icon: BarChart3, label: 'Market Analytics' },
  ];

  if (isOwner) {
    analyticsItems.push({
      to: '/owner/dashboard',
      icon: ShieldCheck,
      label: 'Owner Dashboard',
      badge: 'ACTIVE',
    });
  }

  const navSections: NavSection[] = [
    {
      title: 'AI Tools',
      items: [
        { to: '/ai-advisor', icon: Bot, label: 'AI Advisor', badge: 'NEW' },
        { to: '/find-business', icon: Lightbulb, label: 'Find Business' },
        { to: '/loans', icon: Landmark, label: 'Smart Scheme Router', badge: 'MoSJE' },
      ],
    },
    {
      title: 'Analytics & Maps',
      items: analyticsItems,
    },
    {
      title: 'Marketplace',
      items: [
        { to: '/franchises', icon: Store, label: 'Franchises' },
        { to: '/properties', icon: Building2, label: 'Properties' },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'sticky top-0 h-screen shrink-0 flex flex-col border-r border-border/80 bg-card/95 backdrop-blur-md transition-all duration-300 z-40 select-none overflow-hidden',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center px-4 border-b border-border/70 justify-between">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-amber-600 font-serif font-black text-brand-dark text-sm shadow-md shadow-gold-500/20">
            VM
          </div>
          {!collapsed && (
            <div className="flex flex-col animate-fade-in">
              <span className="text-sm font-bold tracking-tight text-foreground leading-tight">
                Vyapar<span className="text-gold-400">Map</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">
                Location Intel
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Home Link */}
        <div>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary font-semibold border border-primary/20 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )
            }
            title={collapsed ? 'Home' : undefined}
          >
            <Home size={17} className="shrink-0" />
            {!collapsed && <span>Home Overview</span>}
          </NavLink>
        </div>

        {/* Sections */}
        {navSections.map(section => (
          <div key={section.title} className="space-y-1.5">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 font-mono">
                {section.title}
              </h4>
            )}
            <div className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors group relative',
                        isActive
                          ? 'bg-primary/10 text-primary font-semibold border border-primary/25 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                        item.locked && 'opacity-85'
                      )
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Icon
                        size={17}
                        className={cn(
                          'shrink-0 transition-transform group-hover:scale-110',
                          item.locked ? 'text-amber-400/80' : 'text-current'
                        )}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          'text-[9px] font-mono px-1.5 py-0.5 rounded-full uppercase tracking-wider',
                          item.badge === 'NEW'
                            ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                            : item.badge === 'PRIVATE'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-gold-500/20 text-gold-300 font-semibold'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Footer Card */}
      <div className="p-3 border-t border-border/70 space-y-2">
        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs animate-fade-in flex items-center justify-between">
            <div className="overflow-hidden">
              <div className="font-semibold text-foreground truncate">{user.name}</div>
              <div className="text-[11px] text-muted-foreground truncate">
                {isOwner ? (user.businessName || 'Business Owner') : 'Guest Explorer'}
              </div>
            </div>
            <button
              type="button"
              onClick={toggleUserMode}
              className="text-[10px] text-gold-400 hover:text-gold-300 font-mono underline ml-2 shrink-0"
              title="Toggle role"
            >
              {isOwner ? 'Guest Mode' : 'Go Owner (Demo)'}
            </button>
          </div>
        )}

        {/* Sign In / Sign Out Button */}
        {isOwner ? (
          <button
            type="button"
            onClick={logoutToVisitor}
            className={cn(
              'flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 border border-destructive/20 transition-colors',
              collapsed && 'px-0'
            )}
            title="Sign Out to Guest Mode"
          >
            <LogOut size={15} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className={cn(
              'flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-medium text-gold-400 hover:bg-gold-500/10 border border-gold-500/20 transition-colors',
              collapsed && 'px-0'
            )}
            title="Sign In"
          >
            <LogIn size={15} />
            {!collapsed && <span>Sign In</span>}
          </button>
        )}

        {/* Collapse Toggle */}
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center justify-center gap-1.5 w-full py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors font-mono uppercase tracking-wider"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
