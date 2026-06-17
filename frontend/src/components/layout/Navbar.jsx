import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, LogOut, Bell } from 'lucide-react';
import { IconButton, Tooltip, Avatar } from '@mui/material';
import { toggleTheme, toggleSidebar } from '../../features/ui/uiSlice';
import { logoutUser } from '../../features/auth/authSlice';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.ui);
  const { username, email, isAdmin } = useAuth();

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/login');
    });
  };

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : email
      ? email.slice(0, 2).toUpperCase()
      : 'U';

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6
      bg-[var(--color-surface-card)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden p-2 rounded-xl hover:bg-[var(--color-surface-elevated)] transition-colors"
          id="sidebar-toggle"
        >
          <Menu size={20} className="text-[var(--color-text-secondary)]" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-sm font-display font-semibold text-[var(--color-text-primary)]">
            Global Earthquakes
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            Seismic Monitoring Dashboard
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        {/* Theme Toggle */}
        <Tooltip title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
          <IconButton
            onClick={() => dispatch(toggleTheme())}
            size="small"
            id="theme-toggle"
            sx={{
              color: 'var(--color-text-secondary)',
              '&:hover': { backgroundColor: 'var(--color-surface-elevated)' },
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            size="small"
            sx={{
              color: 'var(--color-text-secondary)',
              '&:hover': { backgroundColor: 'var(--color-surface-elevated)' },
            }}
          >
            <Bell size={18} />
          </IconButton>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-6 bg-[var(--color-border)] mx-2" />

        {/* User Info */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-[var(--color-surface-elevated)] transition-colors"
          id="user-profile-btn"
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: '0.75rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1, #d946ef)',
            }}
          >
            {initials}
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-[var(--color-text-primary)] leading-tight">
              {username || 'User'}
            </p>
            <p className="text-[10px] text-[var(--color-text-muted)]">
              {isAdmin ? 'Administrator' : 'User'}
            </p>
          </div>
        </button>

        {/* Logout */}
        <Tooltip title="Logout">
          <IconButton
            onClick={handleLogout}
            size="small"
            id="logout-btn"
            sx={{
              color: 'var(--color-text-secondary)',
              '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
            }}
          >
            <LogOut size={18} />
          </IconButton>
        </Tooltip>
      </div>
    </header>
  );
};

export default Navbar;
