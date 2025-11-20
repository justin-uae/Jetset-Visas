import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiClock,
    FiGlobe,
    FiCheckCircle,
    FiAlertCircle,
    FiShoppingCart,
    FiArrowLeft,
    FiFileText,
    FiDollarSign,
    FiUsers
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchVisaByHandle, selectSelectedVisa, selectVisasLoading } from '../../redux/slices/visaSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import type { VisaVariant } from '../../types/visa-types';
import { FaWhatsapp } from 'react-icons/fa';

const VisaDetail: React.FC = () => {
    const { handle } = useParams<{ handle: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const visa = useAppSelector(selectSelectedVisa);
    const loading = useAppSelector(selectVisasLoading);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<VisaVariant | null>(null);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'notes'>('overview');

    useEffect(() => {
        if (handle) {
            dispatch(fetchVisaByHandle(handle));
        }
    }, [handle, dispatch]);

    // Set default variant when visa loads
    useEffect(() => {
        if (visa && visa.variants.length > 0 && !selectedVariant) {
            // Default to adult variant or first variant
            const defaultVariant = visa.variants.find(
                v => v.title.toLowerCase().includes('adult')
            ) || visa.variants[0];
            setSelectedVariant(defaultVariant);
        }
    }, [visa, selectedVariant]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 text-sm">Loading visa details...</p>
                </div>
            </div>
        );
    }

    if (!visa) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center px-4">
                    <div className="text-4xl sm:text-6xl mb-4">🔍</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Visa Not Found</h2>
                    <button
                        onClick={() => navigate('/visas')}
                        className="text-primary hover:text-accent text-sm sm:text-base"
                    >
                        Browse All Visas
                    </button>
                </div>
            </div>
        );
    }

    const handleAddonToggle = (addonId: string) => {
        setSelectedAddons(prev =>
            prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
    };

    const calculateTotal = () => {
        if (!selectedVariant) return 0;

        let total = selectedVariant.price * quantity;

        selectedAddons.forEach(addonId => {
            const addon = visa.addons.find((a: any) => a.id === addonId);
            if (addon) {
                total += addon.price * quantity;
            }
        });

        return total;
    };

    const handleAddToCart = () => {
        if (!selectedVariant) {
            return;
        }

        const selectedAddonsList = visa.addons.filter((addon: any) =>
            selectedAddons.includes(addon.id)
        );

        dispatch(addToCart({
            visa: visa,
            quantity: quantity,
            selectedVariant: selectedVariant,
            addons: selectedAddonsList,
        }));

        navigate('/cart');
    };

    const handleWhatsAppInquiry = () => {
        if (!visa) return;

        const phoneNumber = `${import.meta.env.VITE_CONTACT_NUMBER}`; // UAE format: 971 + number without leading zero
        const message = `Hi! I'm interested in booking this Visa`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };


    return (
        <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-primary transition-colors text-sm"
                    >
                        <FiArrowLeft className="mr-2" size={18} />
                        <span>Back to Visas</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* Left Column - Images and Details */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
                            <div className="relative h-56 sm:h-80 lg:h-96 bg-gray-100">
                                <img
                                    loading='lazy'
                                    src={visa.images[selectedImage]}
                                    alt={visa.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white rounded-full p-2 sm:p-3 shadow-lg">
                                    <span className="text-2xl sm:text-3xl lg:text-4xl">{visa.flag}</span>
                                </div>
                            </div>
                            {visa.images.length > 1 && (
                                <div className="flex gap-2 p-3 sm:p-4 bg-white overflow-x-auto">
                                    {visa.images.map((img: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === index
                                                ? 'border-primary'
                                                : 'border-gray-200 hover:border-gray-400'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                loading='lazy'
                                                alt={`${visa.title} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title and Basic Info */}
                        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6">
                            <div className="mb-4">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                                    {visa.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                                        {visa.country}
                                    </span>
                                    {/* <span className="px-3 py-1 bg-gray-100 rounded-full">
                                        {visa.country}
                                    </span> */}
                                </div>
                            </div>

                            {/* Quick Info Cards */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <FiClock className="text-primary mb-2" size={18} />
                                    <div className="text-xs text-gray-600 mb-1">Duration</div>
                                    <div className="font-bold text-gray-900 text-sm sm:text-base">{visa.duration}</div>
                                </div>
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <FiGlobe className="text-primary mb-2" size={18} />
                                    <div className="text-xs text-gray-600 mb-1">Entry Type</div>
                                    <div className="font-bold text-gray-900 text-sm sm:text-base">{visa.entryType}</div>
                                </div>
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <FiCheckCircle className="text-accent mb-2" size={18} />
                                    <div className="text-xs text-gray-600 mb-1">Processing</div>
                                    <div className="font-bold text-gray-900 text-sm sm:text-base">{visa.processingTime}</div>
                                </div>
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <FiDollarSign className="text-accent mb-2" size={18} />
                                    <div className="text-xs text-gray-600 mb-1">Starting from</div>
                                    <div className="font-bold text-accent text-sm sm:text-base">AED {visa.price}</div>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                {visa.description}
                            </p>
                        </div>

                        {/* Tabs Section */}
                        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
                            <div className="flex border-b overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`flex-1 min-w-[100px] px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-colors ${activeTab === 'overview'
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('requirements')}
                                    className={`flex-1 min-w-[100px] px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-colors ${activeTab === 'requirements'
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Requirements
                                </button>
                                <button
                                    onClick={() => setActiveTab('notes')}
                                    className={`flex-1 min-w-[100px] px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap ${activeTab === 'notes'
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Important Notes
                                </button>
                            </div>

                            <div className="p-4 sm:p-6">
                                {activeTab === 'overview' && (
                                    <div>
                                        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">
                                            Visa Features
                                        </h3>
                                        <ul className="space-y-2 sm:space-y-3">
                                            {visa.features.map((feature: string, index: number) => (
                                                <li key={index} className="flex items-start">
                                                    <FiCheckCircle className="text-accent mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0" size={16} />
                                                    <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'requirements' && (
                                    <div>
                                        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">
                                            Required Documents
                                        </h3>
                                        <ul className="space-y-2 sm:space-y-3">
                                            {visa.requirements.map((req: string, index: number) => (
                                                <li key={index} className="flex items-start">
                                                    <FiFileText className="text-primary mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0" size={16} />
                                                    <span className="text-gray-700 text-sm sm:text-base">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'notes' && (
                                    <div>
                                        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">
                                            Todo
                                        </h3>
                                        <ul className="space-y-2 sm:space-y-3">
                                            {visa.importantNotes.map((note: string, index: number) => (
                                                <li key={index} className="flex items-start">
                                                    <FiAlertCircle className="text-accent mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0" size={16} />
                                                    <span className="text-gray-700 text-sm sm:text-base">{note}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24 bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
                            <div>
                                <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-1 sm:mb-2">
                                    Book Your Visa
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Select options and add to cart
                                </p>
                            </div>

                            {/* Variant Selector (Adult/Child) */}
                            {visa.variants.length > 1 && (
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                        <FiUsers className="inline mr-2" size={16} />
                                        Applicant Type
                                    </label>
                                    <div className="space-y-2">
                                        {visa.variants.map((variant) => (
                                            <label
                                                key={variant.id}
                                                className={`flex items-center justify-between p-2.5 sm:p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedVariant?.id === variant.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="variant"
                                                        checked={selectedVariant?.id === variant.id}
                                                        onChange={() => setSelectedVariant(variant)}
                                                        className="mr-2 sm:mr-3 w-4 h-4"
                                                    />
                                                    <span className="font-medium text-gray-900 text-sm sm:text-base">
                                                        {variant.title}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-primary text-sm sm:text-base">
                                                    AED {variant.price}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                    Number of Applicants
                                </label>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-300 hover:border-primary flex items-center justify-center font-bold text-lg transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl sm:text-2xl font-bold min-w-[30px] text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-300 hover:border-primary flex items-center justify-center font-bold text-lg transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Addons */}
                            {visa.addons && visa.addons.length > 0 && (
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                        Additional Services
                                    </label>
                                    <div className="space-y-2 sm:space-y-3">
                                        {visa.addons.map((addon: any) => (
                                            <label
                                                key={addon.id}
                                                className="flex items-start p-2.5 sm:p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-primary"
                                                style={{
                                                    borderColor: selectedAddons.includes(addon.id)
                                                        ? '#002D5B'
                                                        : '#E5E7EB',
                                                    backgroundColor: selectedAddons.includes(addon.id)
                                                        ? '#002D5B10'
                                                        : 'white',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAddons.includes(addon.id)}
                                                    onChange={() => handleAddonToggle(addon.id)}
                                                    className="mt-0.5 sm:mt-1 mr-2 sm:mr-3 w-4 h-4"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                                                        {addon.title}
                                                    </div>
                                                    <div className="text-xs text-gray-600 mt-0.5 sm:mt-1">
                                                        {addon.description}
                                                    </div>
                                                    <div className="text-accent font-bold mt-1 text-sm sm:text-base">
                                                        +AED {addon.price}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Price Summary */}
                            <div className="border-t pt-3 sm:pt-4">
                                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-gray-600">
                                            {selectedVariant?.title || 'Visa'} × {quantity}
                                        </span>
                                        <span className="font-medium">
                                            AED {selectedVariant ? selectedVariant.price * quantity : 0}
                                        </span>
                                    </div>
                                    {selectedAddons.map(addonId => {
                                        const addon = visa.addons.find((a: any) => a.id === addonId);
                                        return addon ? (
                                            <div key={addonId} className="flex justify-between text-xs sm:text-sm">
                                                <span className="text-gray-600">
                                                    {addon.title} × {quantity}
                                                </span>
                                                <span className="font-medium">
                                                    AED {addon.price * quantity}
                                                </span>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                                <div className="flex justify-between items-center pt-2 sm:pt-3 border-t">
                                    <span className="font-bold text-base sm:text-lg text-gray-900">Total</span>
                                    <span className="font-bold text-xl sm:text-2xl text-accent">
                                        AED {calculateTotal()}
                                    </span>
                                </div>
                            </div>

                            {/* Add to Cart Button - Desktop */}
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedVariant}
                                className="hidden lg:flex w-full bg-accent text-white py-3 sm:py-4 rounded-lg font-bold hover:bg-accent-dark transition-colors items-center justify-center shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                <FiShoppingCart className="mr-2" size={20} />
                                Add to Cart
                            </button>
                            <button
                                onClick={handleWhatsAppInquiry}
                                className="w-full bg-gradient-to-r bg-primary text-white font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
                            >
                                Inquire via WhatsApp
                                <FaWhatsapp className="w-5 h-5" />
                            </button>

                            {/* Contact Support */}
                            <div className="hidden lg:block text-center pt-3 sm:pt-4 border-t">
                                <p className="text-xs sm:text-sm text-gray-600 mb-2">Need Help?</p>
                                <a
                                    href="tel:+97154567263"
                                    className="text-primary font-semibold hover:text-accent text-sm sm:text-base"
                                >
                                    +971 54 567 2633
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Bar - Mobile Only */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                        <div className="text-xs text-gray-600">Total Amount</div>
                        <div className="text-xl font-bold text-accent">AED {calculateTotal()}</div>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant}
                        className="flex-1 bg-accent text-white py-3 rounded-lg font-bold hover:bg-accent-dark transition-colors flex items-center justify-center shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                    >
                        <FiShoppingCart className="mr-2" size={18} />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VisaDetail;