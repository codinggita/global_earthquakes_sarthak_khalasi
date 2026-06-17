import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Eye, EyeOff, Mail, Lock, Activity, Zap } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { loginUser } from '../../features/auth/authSlice';
import useAuth from '../../hooks/useAuth';

const validationSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '0.75rem',
      backgroundColor: 'rgba(99,102,241,0.04)',
      '& fieldset': { borderColor: 'rgba(99,102,241,0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.5)' },
      '&.Mui-focused fieldset': { borderColor: '#6366f1' },
    },
    '& .MuiInputBase-input': { color: 'var(--color-text-primary)' },
    '& .MuiInputLabel-root': { color: 'var(--color-text-secondary)' },
    '& .MuiFormHelperText-root': { fontSize: '0.72rem' },
  };

  return (
    <>
      <Helmet>
        <title>Login – Global Earthquakes Dashboard</title>
        <meta name="description" content="Sign in to access the Global Earthquakes seismic monitoring dashboard." />
      </Helmet>

      <div className="min-h-screen flex bg-[var(--color-surface)]">
        {/* Left branding panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-dark flex-col items-center justify-center p-12">
          {/* Animated blobs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary-600/20 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-accent-600/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

          <div className="relative z-10 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-500/30">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold text-white mb-4">
              SeismoTrack
            </h1>
            <p className="text-primary-200 text-lg mb-8 max-w-sm">
              Real-time global earthquake monitoring and seismic data analytics platform.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
              {[
                { icon: Zap, label: 'Real-time Data' },
                { icon: Activity, label: 'Analytics' },
                { icon: Activity, label: 'Reports' },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="glass p-3 rounded-xl text-center">
                  <Icon className="w-5 h-5 text-primary-300 mx-auto mb-1" />
                  <p className="text-[10px] text-primary-200">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right login form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-display font-bold text-[var(--color-text-primary)]">SeismoTrack</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-display font-bold text-[var(--color-text-primary)] mb-2">
                Welcome back
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                Sign in to your dashboard account
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
              <TextField
                id="email"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={16} className="text-primary-400" />
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
              />

              <TextField
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={16} className="text-primary-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                        size="small"
                        sx={{ color: 'var(--color-text-muted)' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
              />

              <button
                type="submit"
                disabled={isLoading || !formik.isValid}
                id="login-submit"
                className="w-full py-3 rounded-xl bg-gradient-primary text-white font-semibold text-sm
                  hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 flex items-center justify-center gap-2
                  shadow-lg shadow-primary-500/25 mt-2"
              >
                {isLoading ? (
                  <CircularProgress size={18} sx={{ color: 'white' }} />
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-500 font-semibold hover:text-primary-400 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
