import React from 'react';
import { FiStar } from 'react-icons/fi';

interface TestimonialProps {
    name: string;
    country: string;
    rating: number;
    text: string;
    visaType: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ name, country, rating, text, visaType }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-2xl transition-shadow duration-300">
            {/* Rating */}
            <div className="flex items-center mb-4">
                {[...Array(rating)].map((_, i) => (
                    <FiStar key={i} className="text-accent fill-current" size={20} />
                ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{text}"
            </p>

            {/* User Info */}
            <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg mr-4">
                    {name.charAt(0)}
                </div>
                <div>
                    <div className="font-bold text-gray-900">{name}</div>
                    <div className="text-sm text-gray-600">{country} • {visaType}</div>
                </div>
            </div>
        </div>
    );
};

const Testimonials: React.FC = () => {
    const testimonials = [
        {
            name: 'Ahmed Al Mansouri',
            country: 'UAE',
            rating: 5,
            text: 'Excellent service! Got my parents\' UAE tourist visa within 24 hours. The process was smooth and the team was very responsive to all my queries.',
            visaType: 'UAE Tourist Visa',
        },
        {
            name: 'Priya Sharma',
            country: 'India',
            rating: 5,
            text: 'Applied for a Schengen visa and received it before the expected date. Very professional service and great customer support. Highly recommended!',
            visaType: 'Schengen Visa',
        },
        {
            name: 'Mohammed Hassan',
            country: 'Saudi Arabia',
            rating: 5,
            text: 'Best visa service I have used. They handled everything from documentation to submission. Got my family\'s visas without any hassle.',
            visaType: 'Saudi Tourist Visa',
        },
        {
            name: 'Sarah Johnson',
            country: 'USA',
            rating: 5,
            text: 'I was worried about the visa application process, but they made it so easy. Clear communication and fast processing. Will definitely use again!',
            visaType: 'UAE Business Visa',
        },
        {
            name: 'Rajesh Kumar',
            country: 'India',
            rating: 5,
            text: 'Applied for multiple visas for my business trip. All were processed efficiently and delivered on time. Great value for money!',
            visaType: 'Multiple Country Visas',
        },
        {
            name: 'Fatima Al Zaabi',
            country: 'UAE',
            rating: 5,
            text: 'Very reliable service. They kept me updated throughout the process and answered all my questions promptly. Stress-free experience!',
            visaType: 'Turkey E-Visa',
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Trusted by thousands of travelers worldwide
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-16 text-center">
                    <div className="inline-flex flex-wrap items-center justify-center gap-8 bg-white rounded-2xl shadow-lg px-8 py-6">
                        <div className="flex items-center">
                            <FiStar className="text-accent fill-current text-2xl mr-2" />
                            <div className="text-left">
                                <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                                <div className="text-sm text-gray-600">Average Rating</div>
                            </div>
                        </div>
                        <div className="h-12 w-px bg-gray-300 hidden sm:block"></div>
                        <div className="text-left">
                            <div className="text-2xl font-bold text-gray-900">10,000+</div>
                            <div className="text-sm text-gray-600">Happy Customers</div>
                        </div>
                        <div className="h-12 w-px bg-gray-300 hidden sm:block"></div>
                        <div className="text-left">
                            <div className="text-2xl font-bold text-gray-900">98%</div>
                            <div className="text-sm text-gray-600">Success Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;