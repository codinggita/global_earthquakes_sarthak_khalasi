import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Avatar } from '@mui/material';
import { User, Mail, Shield, Calendar, Activity } from 'lucide-react';
import { loadUserProfile } from '../../features/auth/authSlice';
import useAuth from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatters';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-3 border-b border-[var(--color-border-light)] last:border-0">
    <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
      <Icon size={16} className="text-primary-500" />
    </div>
    <div className="flex-1">
      <p className="text-xs text-[var(--color-text-muted)] font-medium">{label}</p>
      <p className="text-sm text-[var(--color-text-primary)] font-semibold mt-0.5">{value || '—'}</p>
    </div>
  </div>
);

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, username, email, role, isAdmin } = useAuth();

  useEffect(() => { dispatch(loadUserProfile()); }, [dispatch]);

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : email ? email.slice(0, 2).toUpperCase() : 'U';

  return (
    <>
      <Helmet>
        <title>Profile – Global Earthquakes Dashboard</title>
        <meta name="description" content="View and manage your profile information on the Global Earthquakes dashboard." />
      </Helmet>

      <div className="space-y-5 max-w-2xl mx-auto animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Profile</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Your account information</p>
        </div>

        {/* Profile Hero */}
        <div className="glass-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: '1.75rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1, #d946ef)',
              boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
            }}
          >
            {initials}
          </Avatar>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-display font-bold text-[var(--color-text-primary)]">{username}</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                ${isAdmin
                  ? 'bg-primary-500/10 text-primary-500'
                  : 'bg-green-500/10 text-green-500'
                }`}>
                <Shield size={11} />
                {isAdmin ? 'Administrator' : 'User'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]">
                <Activity size={11} />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-display font-bold text-[var(--color-text-primary)] mb-3">
            Account Details
          </h3>
          <InfoRow icon={User} label="Username" value={username} />
          <InfoRow icon={Mail} label="Email Address" value={email} />
          <InfoRow icon={Shield} label="Role" value={role?.charAt(0).toUpperCase() + role?.slice(1)} />
          <InfoRow icon={Calendar} label="Account Created" value={user?.createdAt ? formatDate(user.createdAt, { hour: undefined, minute: undefined }) : '—'} />
          <InfoRow icon={Calendar} label="Last Updated" value={user?.updatedAt ? formatDate(user.updatedAt) : '—'} />
        </div>

        {/* Permissions Summary */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-display font-bold text-[var(--color-text-primary)] mb-4">
            Access Permissions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'View Earthquake Data', allowed: true },
              { label: 'Submit Felt Reports', allowed: true },
              { label: 'View Analytics', allowed: true },
              { label: 'Create Earthquakes', allowed: isAdmin },
              { label: 'Edit Earthquake Records', allowed: isAdmin },
              { label: 'Delete Records', allowed: isAdmin },
            ].map(({ label, allowed }) => (
              <div key={label} className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--color-surface-elevated)]">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${allowed ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {allowed ? '✓' : '✕'}
                </div>
                <span className="text-xs font-medium text-[var(--color-text-primary)]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
