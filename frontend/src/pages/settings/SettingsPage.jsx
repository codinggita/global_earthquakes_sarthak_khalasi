import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Switch, FormControlLabel } from '@mui/material';
import { Sun, Moon, Palette, Info } from 'lucide-react';
import { toggleTheme } from '../../features/ui/uiSlice';
import useAuth from '../../hooks/useAuth';

const SettingsSection = ({ title, children }) => (
  <div className="glass-card p-5">
    <h3 className="text-sm font-display font-bold text-[var(--color-text-primary)] mb-4">{title}</h3>
    {children}
  </div>
);

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((s) => s.ui);
  const { username, email, role } = useAuth();
  const isDark = theme === 'dark';

  return (
    <>
      <Helmet>
        <title>Settings – Global Earthquakes Dashboard</title>
        <meta name="description" content="Manage your dashboard preferences and theme settings." />
      </Helmet>

      <div className="space-y-5 max-w-2xl mx-auto animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Settings</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Manage your dashboard preferences</p>
        </div>

        {/* Appearance */}
        <SettingsSection title="Appearance">
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-elevated)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  {isDark ? <Moon size={16} className="text-primary-400" /> : <Sun size={16} className="text-primary-400" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Currently using {isDark ? 'dark' : 'light'} theme · Saved in localStorage
                  </p>
                </div>
              </div>
              <Switch
                checked={isDark}
                onChange={() => dispatch(toggleTheme())}
                id="theme-switch"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#6366f1' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#6366f1' },
                }}
              />
            </div>

            {/* Theme Preview Cards */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => !isDark || dispatch(toggleTheme())}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  !isDark ? 'border-primary-500 bg-primary-500/5' : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                }`}
              >
                <div className="w-full h-12 rounded-lg bg-white border border-gray-200 mb-2 flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">Light Mode</p>
                {!isDark && <p className="text-[10px] text-primary-500 font-medium mt-0.5">Active</p>}
              </button>
              <button
                onClick={() => isDark || dispatch(toggleTheme())}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isDark ? 'border-primary-500 bg-primary-500/5' : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                }`}
              >
                <div className="w-full h-12 rounded-lg bg-slate-900 border border-slate-700 mb-2 flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">Dark Mode</p>
                {isDark && <p className="text-[10px] text-primary-500 font-medium mt-0.5">Active</p>}
              </button>
            </div>
          </div>
        </SettingsSection>

        {/* Account Info (read-only) */}
        <SettingsSection title="Account Information">
          <div className="space-y-2">
            {[
              { label: 'Username', value: username },
              { label: 'Email', value: email },
              { label: 'Role', value: role?.charAt(0).toUpperCase() + role?.slice(1) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-elevated)]">
                <span className="text-xs text-[var(--color-text-muted)] font-medium">{label}</span>
                <span className="text-sm text-[var(--color-text-primary)] font-semibold">{value}</span>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 mt-3 p-3 rounded-xl bg-primary-500/5 border border-primary-500/20">
            <Info size={14} className="text-primary-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[var(--color-text-secondary)]">
              Account details are managed through the backend. Contact an administrator to update your information.
            </p>
          </div>
        </SettingsSection>

        {/* Data & Storage */}
        <SettingsSection title="Data & Storage">
          <div className="space-y-3">
            {[
              { label: 'Auth Token', location: 'localStorage', description: 'JWT token for API authentication' },
              { label: 'Theme Preference', location: 'localStorage', description: 'Light/dark mode preference' },
              { label: 'User Session', location: 'localStorage', description: 'Cached user profile data' },
              { label: 'Active Filters', location: 'sessionStorage', description: 'Temporary filter state (cleared on tab close)' },
            ].map(({ label, location, description }) => (
              <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-elevated)]">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-primary-500/10 text-primary-500">
                  {location}
                </span>
              </div>
            ))}
          </div>
        </SettingsSection>
      </div>
    </>
  );
};

export default SettingsPage;
