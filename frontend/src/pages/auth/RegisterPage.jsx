import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Eye, EyeOff, Mail, Lock, User, Activity } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { registerUser } from '../../features/auth/authSlice';
import useAuth from '../../hooks/useAuth';

const validationSchema = Yup.object({
  username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: { username: '', email: '', password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: ({ username, email, password }) => {
      dispatch(registerUser({ username, email, password }));
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
        <title>Register – Global Earthquakes Dashboard</title>
        <meta name="description" content="Create an account to access the Global Earthquakes seismic monitoring dashboard." />
      </Helmet>

      <div className="min-h-screen flex bg-[var(--color-surface)]">
        {/* Left branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-dark flex-col items-center justify-center p-12">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-accent-600/20 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full bg-primary-600/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-500/30">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold text-white mb-4">Join SeismoTrack</h1>
            <p className="text-primary-200 text-lg mb-8 max-w-sm">
              Create an account and start monitoring global seismic activity in real-time.
            </p>
            <div className="space-y-3 text-left max-w-xs mx-auto">
              {['Access real-time earthquake data', 'Submit felt intensity reports', 'View advanced analytics'].map((t, i) => (
                <div key={i} className="flex items-center gap-3 glass p-3 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0" />
                  <p className="text-sm text-primary-100">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-display font-bold text-[var(--color-text-primary)]">SeismoTrack</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-display font-bold text-[var(--color-text-primary)] mb-2">
                Create account
              </h2>
              <p className="text-[var(--color-text-secondary)]">Fill in your details to get started</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
              <TextField
                id="username"
                name="username"
                label="Username"
                fullWidth
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><User size={16} className="text-primary-400" /></InputAdornment>,
                }}
                sx={inputSx}
              />

              <TextField
                id="reg-email"
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
                  startAdornment: <InputAdornment position="start"><Mail size={16} className="text-primary-400" /></InputAdornment>,
                }}
                sx={inputSx}
              />

              <TextField
                id="reg-password"
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
                  startAdornment: <InputAdornment position="start"><Lock size={16} className="text-primary-400" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" size="small" sx={{ color: 'var(--color-text-muted)' }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
              />

              <TextField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock size={16} className="text-primary-400" /></InputAdornment>,
                }}
                sx={inputSx}
              />

              <button
                type="submit"
                disabled={isLoading || !formik.isValid}
                id="register-submit"
                className="w-full py-3 rounded-xl bg-gradient-primary text-white font-semibold text-sm
                  hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 flex items-center justify-center gap-2
                  shadow-lg shadow-primary-500/25 mt-2"
              >
                {isLoading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-400 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
