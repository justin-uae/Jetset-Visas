import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { login, clearError } from '../../redux/slices/authSlice';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const validateForm = () => {
        const errors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Invalid email format';
        }

        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await dispatch(login({ email, password })).unwrap();
            navigate('/');
        } catch (err) {
            // Error handled by Redux
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-sm sm:text-base text-gray-600">Sign in to your account to continue</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-6 sm:p-8">
                    {/* Error Alert */}
                    {error && (
                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                            <FiAlertCircle className="w-5 h-5 text-red-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-red-800">{error}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (validationErrors.email) {
                                            setValidationErrors({ ...validationErrors, email: undefined });
                                        }
                                    }}
                                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base ${validationErrors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="your@email.com"
                                />
                            </div>
                            {validationErrors.email && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (validationErrors.password) {
                                            setValidationErrors({ ...validationErrors, password: undefined });
                                        }
                                    }}
                                    className={`w-full pl-10 pr-12 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base ${validationErrors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {validationErrors.password && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                            )}
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-primary rounded mr-2" />
                                <span className="text-gray-700">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-primary hover:text-accent font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or</span>
                        </div>
                    </div>

                    {/* Guest Checkout */}
                    <button
                        onClick={() => navigate('/cart')}
                        className="w-full bg-gray-100 text-gray-700 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base"
                    >
                        Continue as Guest
                    </button>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">Don't have an account? </span>
                        <Link to="/signup" className="text-primary hover:text-accent font-semibold">
                            Sign Up
                        </Link>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-xs sm:text-sm text-gray-600">
                        Need help? Contact us at{' '}
                        <a href="tel:+971545672633" className="text-primary hover:underline font-medium">
                            +971 54 567 2633
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;