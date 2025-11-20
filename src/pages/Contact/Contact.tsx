import React, { useState } from 'react';
import {
    FiMapPin,
    FiPhone,
    FiMail,
    FiClock,
    FiSend,
    FiAlertCircle,
    FiCheckCircle
} from 'react-icons/fi';
import ReCAPTCHA from 'react-google-recaptcha';

interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState<ContactForm>({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleRecaptchaChange = (token: string | null) => {
        setRecaptchaToken(token);
        if (token && errors.recaptcha) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.recaptcha;
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        if (!recaptchaToken) {
            newErrors.recaptcha = 'Please complete the reCAPTCHA verification';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: '' });

        try {
            const response = await fetch('/api/contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    recaptchaToken: recaptchaToken,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSubmitStatus({
                    type: 'success',
                    message: 'Thank you for contacting us! We will get back to you soon.',
                });

                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
                setRecaptchaToken(null);

                // Reset reCAPTCHA
                // if (window.grecaptcha) {
                //     window.grecaptcha.reset();
                // }
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
            });
        } finally {
            setIsSubmitting(false);

            // Scroll to top to show message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Get In Touch
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        Have questions about visa applications? Our expert consultants are here to help you with
                        personalized guidance and support.
                    </p>
                </div>

                {/* Status Messages */}
                {submitStatus.type && (
                    <div className={`max-w-4xl mx-auto mb-8 p-4 rounded-lg flex items-start gap-3 ${submitStatus.type === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                        }`}>
                        {submitStatus.type === 'success' ? (
                            <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                            <FiAlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <p className={`text-sm ${submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                            }`}>
                            {submitStatus.message}
                        </p>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name and Email Row */}
                                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your Name"
                                            className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition ${errors.name ? 'border-red-500' : 'border-gray-200'
                                                }`}
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Your Email"
                                            className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition ${errors.email ? 'border-red-500' : 'border-gray-200'
                                                }`}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Your Subject"
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition ${errors.subject ? 'border-red-500' : 'border-gray-200'
                                            }`}
                                    />
                                    {errors.subject && (
                                        <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Write Your Message"
                                        rows={6}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none ${errors.message ? 'border-red-500' : 'border-gray-200'
                                            }`}
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                                    )}
                                </div>

                                {/* reCAPTCHA */}
                                <div>
                                    <ReCAPTCHA
                                        sitekey={RECAPTCHA_SITE_KEY}
                                        onChange={handleRecaptchaChange}
                                    />
                                    {errors.recaptcha && (
                                        <p className="text-red-500 text-sm mt-1">{errors.recaptcha}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            SEND MESSAGE
                                            <FiSend className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        {/* Office Address */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FiMapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Office Address</h3>
                                    <p className="text-gray-600 text-sm">
                                        Hor Al Anz - Building 101, Dubai, UAE
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Call Us */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FiPhone className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                                    <a
                                        href="tel:+97154567263"
                                        className="text-gray-600 text-sm hover:text-accent transition"
                                    >
                                        +971 54 567 2633
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Email Us */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FiMail className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                                    <a
                                        href="mailto:info@jetsetvisas.ae"
                                        className="text-gray-600 text-sm hover:text-accent transition break-all"
                                    >
                                        info@jetsetvisas.ae
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Office Open */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FiClock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Office Open</h3>
                                    <p className="text-gray-600 text-sm">
                                        Mon - Sat (09AM - 6PM)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;