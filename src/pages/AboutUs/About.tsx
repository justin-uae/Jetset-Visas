import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiAward,
    FiUsers,
    FiGlobe,
    FiCheckCircle,
    FiTrendingUp,
    FiShield,
    FiClock,
    FiHeart,
    FiTarget,
    FiStar
} from 'react-icons/fi';

const AboutUs: React.FC = () => {
    const navigate = useNavigate();

    const stats = [
        { icon: FiTrendingUp, value: '98%', label: 'Success Rate', color: 'text-green-600' },
        { icon: FiUsers, value: '50,000+', label: 'Happy Clients', color: 'text-blue-600' },
        { icon: FiGlobe, value: '40+', label: 'Countries Covered', color: 'text-purple-600' },
        { icon: FiClock, value: '15+', label: 'Years Experience', color: 'text-orange-600' },
    ];

    const values = [
        {
            icon: FiShield,
            title: 'Trust & Transparency',
            description: 'We believe in honest communication and transparent processes. No hidden fees, no false promises.',
        },
        {
            icon: FiTarget,
            title: 'Excellence',
            description: 'We strive for perfection in every application, ensuring the highest standards of service.',
        },
        {
            icon: FiHeart,
            title: 'Customer First',
            description: 'Your success is our success. We go above and beyond to make your visa journey smooth.',
        },
        {
            icon: FiCheckCircle,
            title: 'Reliability',
            description: 'Count on us for accurate information, timely processing, and consistent support.',
        },
    ];

    const services = [
        {
            title: 'Schengen Visa Consultancy',
            description: 'Expert guidance for all 27 Schengen countries with specialized documentation support.',
        },
        {
            title: 'UAE Visa Services',
            description: 'Comprehensive UAE visa solutions including tourist, transit, and long-term visas.',
        },
        {
            title: 'Document Assistance',
            description: 'Professional help with documentation, attestation, and translation services.',
        },
        {
            title: 'Premium Support',
            description: '24/7 customer support and priority processing for urgent applications.',
        },
    ];

    const team = [
        {
            name: 'Expert Visa Consultants',
            description: 'Our team consists of certified immigration consultants with extensive knowledge of visa regulations.',
        },
        {
            name: 'Dedicated Support Staff',
            description: 'Multilingual support team available to assist you in Arabic, English, Hindi, and Urdu.',
        },
        {
            name: 'Documentation Specialists',
            description: 'Experienced professionals who ensure your documents meet all embassy requirements.',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            
            <div className="relative bg-gradient-to-r from-primary to-primary text-white py-12 sm:py-16 lg:py-20">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-full mb-4 sm:mb-6">
                        <FiAward className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                        About Jetset Visa Services
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-6 sm:mb-8">
                        Professional Global Visa Consultants with 98% Success Rate
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                        <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 rounded-full">
                            <FiStar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-300" />
                            <span className="font-semibold text-sm sm:text-base">4.9/5 Rating</span>
                        </div>
                        <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 rounded-full">
                            <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-300" />
                            <span className="font-semibold text-sm sm:text-base">98% Success</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                {/* Stats Section */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 text-center hover:shadow-xl transition-shadow">
                            <stat.icon className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${stat.color} mx-auto mb-2 sm:mb-3`} />
                            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                                {stat.value}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* About Content */}
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-12 sm:mb-16 lg:mb-20">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Who We Are</h2>
                        <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                            <p>
                                Jetset Visa Services is a leading visa consultancy based in Abu Dhabi, UAE, specializing in global visa services. With over 15 years of experience in the immigration industry, we have successfully processed over 50,000 visa applications with an impressive 98% success rate.
                            </p>
                            <p>
                                We understand that obtaining a visa can be a complex and stressful process. That's why we're committed to making your visa journey as smooth and hassle-free as possible. Our team of expert consultants stays updated with the latest immigration laws and embassy requirements to provide you with accurate guidance and reliable service.
                            </p>
                            <p>
                                Whether you're planning a European vacation, a business trip, or relocating to the UAE, we handle every aspect of your visa application with professionalism and care. Our personalized approach ensures that each client receives tailored solutions based on their specific needs and circumstances.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Our Mission</h2>
                        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-l-4 border-primary rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                            <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed">
                                "To provide world-class visa consultancy services that empower individuals and businesses to explore global opportunities with confidence and ease."
                            </p>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose Us?</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            {[
                                'Certified and experienced visa consultants',
                                '98% visa approval success rate',
                                'Fast-track and priority processing available',
                                '24/7 customer support',
                                'Transparent pricing with no hidden fees',
                                'End-to-end assistance from application to approval',
                                'Free visa consultation',
                                'Document verification and attestation services',
                            ].map((item, index) => (
                                <li key={index} className="flex items-start text-sm sm:text-base">
                                    <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Our Values */}
                <div className="mb-12 sm:mb-16 lg:mb-20">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Our Core Values</h2>
                        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we do and help us serve you better
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                                    <value.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Our Services */}
                <div className="mb-12 sm:mb-16 lg:mb-20">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">What We Offer</h2>
                        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                            Comprehensive visa solutions tailored to your travel needs
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 border-l-4 border-accent hover:shadow-lg transition-shadow">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Our Team */}
                <div className="mb-12 sm:mb-16 lg:mb-20">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Our Expert Team</h2>
                        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                            Dedicated professionals committed to your visa success
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-accent to-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <FiUsers className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{member.name}</h3>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-primary to-primary rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12 text-white text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Start Your Visa Journey?</h2>
                    <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
                        Let our expert consultants guide you through the visa application process. Get started today with a free consultation!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <button
                            onClick={() => navigate('/visas')}
                            className="px-6 sm:px-8 py-3 bg-accent text-white rounded-lg font-bold hover:bg-gray-100 hover:text-accent transition-colors text-sm sm:text-base"
                        >
                            Browse Visa Services
                        </button>
                    </div>

                    <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20">
                        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                            <div>
                                <div className="text-2xl sm:text-3xl font-bold mb-1">15+</div>
                                <div className="text-xs sm:text-sm text-white/80">Years Experience</div>
                            </div>
                            <div>
                                <div className="text-2xl sm:text-3xl font-bold mb-1">98%</div>
                                <div className="text-xs sm:text-sm text-white/80">Success Rate</div>
                            </div>
                            <div>
                                <div className="text-2xl sm:text-3xl font-bold mb-1">24/7</div>
                                <div className="text-xs sm:text-sm text-white/80">Support Available</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 sm:mt-12 lg:mt-16 bg-blue-50 rounded-lg sm:rounded-xl p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Trusted by Thousands</h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Join our community of satisfied clients who achieved their travel dreams
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-center">
                        <div className="flex items-center bg-white px-4 sm:px-6 py-3 rounded-lg shadow-sm">
                            <FiShield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2 sm:mr-3" />
                            <div className="text-left">
                                <div className="text-xs sm:text-sm font-semibold text-gray-900">Licensed</div>
                                <div className="text-xs text-gray-600">Certified Consultants</div>
                            </div>
                        </div>
                        <div className="flex items-center bg-white px-4 sm:px-6 py-3 rounded-lg shadow-sm">
                            <FiStar className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2 sm:mr-3" />
                            <div className="text-left">
                                <div className="text-xs sm:text-sm font-semibold text-gray-900">4.9/5 Rating</div>
                                <div className="text-xs text-gray-600">Google Reviews</div>
                            </div>
                        </div>
                        <div className="flex items-center bg-white px-4 sm:px-6 py-3 rounded-lg shadow-sm">
                            <FiHeart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mr-2 sm:mr-3" />
                            <div className="text-left">
                                <div className="text-xs sm:text-sm font-semibold text-gray-900">50K+ Clients</div>
                                <div className="text-xs text-gray-600">Served Successfully</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;