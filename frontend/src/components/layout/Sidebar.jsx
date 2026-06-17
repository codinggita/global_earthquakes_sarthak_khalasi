import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Globe, FileText, BarChart3, User, Settings, X, Activity,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { setSidebarOpen } from '../../features/ui/uiSlice';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/earthquakes', label: 'Earthquakes', icon: Globe },
  { path: '/reports', label: 'Felt Reports', icon: FileText },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { isAdmin } = useAuth();
  const location = useLocation();

  const closeSidebar = () => dispatch(setSidebarOpen(false));

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] flex flex-col
          bg-[var(--color-surface-card)] border-r border-[var(--color-border)]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo / Brand */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-display font-bold text-[var(--color-text-primary)] leading-tight">
                SeismoTrack
              </h1>
              <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">
                Dashboard
              </p>
            </div>
          </div>
          <button onClick={closeSidebar} className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors">
            <X size={18} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Main Menu
          </p>
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => window.innerWidth < 1024 && closeSidebar()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]'
                  }`}
              >
                <Icon
                  size={18}
                  className={`transition-colors ${isActive ? 'text-primary-500' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]'}`}
                />
                {label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-[var(--color-border)]">
          <div className="glass-card p-3 bg-gradient-primary/5">
            <p className="text-xs font-semibold text-[var(--color-text-primary)] mb-1">
              {isAdmin ? '🛡️ Admin Access' : '👤 User Access'}
            </p>
            <p className="text-[10px] text-[var(--color-text-muted)]">
              {isAdmin ? 'Full CRUD permissions' : 'Read & report access'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
