import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiGlobe, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import type { VisaProduct } from '../../types/visa-types';

interface VisaCardProps extends Omit<VisaProduct, 'variants' | 'addons' | 'features' | 'requirements' | 'importantNotes'> {
    popular?: boolean;
}

const VisaCard: React.FC<VisaCardProps> = ({
    title,
    country,
    flag,
    duration,
    entryType,
    price,
    processingTime,
    images,
    handle,
    isGCC,
    popular = false,
}) => {
    const image = images[0];

    return (
        <Link
            to={`/visas/${handle}`}
            className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 hover:border-primary"
        >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    loading='lazy'
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Flag Badge */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg text-2xl">
                    {flag}
                </div>

                {/* Popular Badge */}
                {popular && (
                    <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                        POPULAR
                    </div>
                )}

                {/* Country Name Overlay */}
                <div className="absolute bottom-4 left-4 text-white font-bold text-lg drop-shadow-lg">
                    {country}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors min-h-[56px]">
                    {title}
                </h3>

                {/* Details Grid */}
                <div className="space-y-2 mb-4">
                    {/* Duration */}
                    <div className="flex items-center text-sm text-gray-600">
                        <FiClock className="mr-2 text-primary flex-shrink-0" size={16} />
                        <span className="font-medium">{duration}</span>
                    </div>

                    {/* Entry Type */}
                    <div className="flex items-center text-sm text-gray-600">
                        <FiGlobe className="mr-2 text-primary flex-shrink-0" size={16} />
                        <span>{entryType}</span>
                    </div>

                    {/* Processing Time */}
                    {processingTime && (
                        <div className="flex items-center text-sm text-gray-600">
                            <FiCheckCircle className="mr-2 text-accent flex-shrink-0" size={16} />
                            <span>{processingTime}</span>
                        </div>
                    )}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Starting from</div>
                        <div className="text-2xl font-bold text-accent">
                            AED {price}
                        </div>
                    </div>
                    <div className="flex items-center text-primary font-semibold group-hover:text-accent transition-colors">
                        <span className="mr-1">{isGCC ? `Apply` : `Enquire now`}</span>
                        <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VisaCard;