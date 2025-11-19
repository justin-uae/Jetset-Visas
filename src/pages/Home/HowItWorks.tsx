import React from 'react';
import { FiSearch, FiFileText, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

interface StepProps {
    number: number;
    icon: React.ReactNode;
    title: string;
    description: string;
}

const Step: React.FC<StepProps> = ({ number, icon, title, description }) => {
    return (
        <div className="relative">
            <div className="flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
                    {icon}
                </div>

                {/* Step Number */}
                <div className="absolute -top-3 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg shadow-lg">
                    {number}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>

                {/* Description */}
                <p className="text-gray-600">{description}</p>
            </div>

            {/* Connector Line (hidden on last item and mobile) */}
            {number < 4 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-secondary -z-10"></div>
            )}
        </div>
    );
};

const HowItWorks: React.FC = () => {
    const steps = [
        {
            icon: <FiSearch />,
            title: 'Choose Your Visa',
            description: 'Browse our extensive collection of visa options and select the one that fits your travel needs',
        },
        {
            icon: <FiFileText />,
            title: 'Submit Documents',
            description: 'Upload your required documents securely through our platform or send them via email',
        },
        {
            icon: <FiCreditCard />,
            title: 'Make Payment',
            description: 'Complete your payment securely through our trusted payment gateway',
        },
        {
            icon: <FiCheckCircle />,
            title: 'Receive Your Visa',
            description: 'Get your approved visa delivered to your email within the processing time',
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Get your visa in 4 simple steps. Fast, secure, and hassle-free process
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
                    {steps.map((step, index) => (
                        <Step
                            key={index}
                            number={index + 1}
                            icon={step.icon}
                            title={step.title}
                            description={step.description}
                        />
                    ))}
                </div>

                {/* Additional Info */}
                <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">24-48h</div>
                            <div className="text-gray-600">Average Processing Time</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">98%</div>
                            <div className="text-gray-600">Success Rate</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                            <div className="text-gray-600">Customer Support</div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-6 text-lg">
                        Ready to start your visa application?
                    </p>
                    <a
                        href="/visas"
                        className="inline-flex items-center px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg"
                    >
                        Get Started Now
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;