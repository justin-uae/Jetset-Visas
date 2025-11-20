import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { register, clearError } from '../../redux/slices/authSlice';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [agreeToTerms, setAgreeToTerms] = useState(false);

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

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (validationErrors[field]) {
            setValidationErrors({ ...validationErrors, [field]: '' });
        }
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!agreeToTerms) {
            errors.terms = 'You must agree to the terms and conditions';
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
            await dispatch(
                register({
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                })
            ).unwrap();
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
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-sm sm:text-base text-gray-600">Join us and start your visa journey</p>
                </div>

                {/* Signup Card */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-6 sm:p-8">
                    {/* Error Alert */}
                    {error && (
                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                            <FiAlertCircle className="w-5 h-5 text-red-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-red-800">{error}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => handleChange('firstName', e.target.value)}
                                        className={`w-full pl-10 pr-3 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${validationErrors.firstName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="John"
                                    />
                                </div>
                                {validationErrors.firstName && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => handleChange('lastName', e.target.value)}
                                        className={`w-full pl-10 pr-3 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${validationErrors.lastName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Doe"
                                    />
                                </div>
                                {validationErrors.lastName && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${validationErrors.email ? 'border-red-500' : 'border-gray-300'
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
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className={`w-full pl-10 pr-12 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${validationErrors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Minimum 6 characters"
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    className={`w-full pl-10 pr-12 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Re-enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {validationErrors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms & Conditions */}
                        <div>
                            <label className="flex items-start cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreeToTerms}
                                    onChange={(e) => {
                                        setAgreeToTerms(e.target.checked);
                                        if (validationErrors.terms) {
                                            setValidationErrors({ ...validationErrors, terms: '' });
                                        }
                                    }}
                                    className="mt-1 mr-2 sm:mr-3 w-4 h-4"
                                />
                                <span className="text-xs sm:text-sm text-gray-700">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-primary hover:underline">
                                        Terms and Conditions
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-primary hover:underline">
                                        Privacy Policy
                                    </Link>
                                </span>
                            </label>
                            {validationErrors.terms && (
                                <p className="text-red-500 text-xs mt-1 ml-6">{validationErrors.terms}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
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

                    {/* Sign In Link */}
                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link to="/login" className="text-primary hover:text-accent font-semibold">
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Benefits */}
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Why Create an Account?</h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                        {[
                            'Track your visa applications',
                            'Faster checkout process',
                            'Save multiple traveler profiles',
                            'Access order history',
                        ].map((benefit, index) => (
                            <li key={index} className="flex items-center text-xs sm:text-sm text-gray-700">
                                <FiCheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
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

export default Signup;