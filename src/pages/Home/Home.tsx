import React from 'react';
import Hero from './Hero';
import FeaturedVisas from './FeaturedVisas';
import BestVisa from './BestVisa';
import HowItWorks from './HowItWorks';

const Home: React.FC = () => {
    return (
        <>

            <div className="min-h-screen">
                {/* Hero Section */}
                <Hero />
                <BestVisa />

                {/* Categories Section */}
                {/* <Categories /> */}

                {/* Featured Visas */}
                <FeaturedVisas />

                {/* How It Works */}
                <HowItWorks />

                {/* Popular Countries */}
                {/* <CountryGrid /> */}

                {/* Testimonials */}
                {/* <Testimonials /> */}

                {/* Final CTA Section */}
                <section className="bg-gradient-to-r from-primary to-primary py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Start Your Visa Application?
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Join thousands of satisfied customers who trust us with their visa needs
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/visas"
                                className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg"
                            >
                                Browse All Visas
                            </a>
                            {/* <a
                                href="/contact"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                            >
                                Contact Us
                            </a> */}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;