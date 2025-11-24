import React, { useState, useEffect, useMemo } from 'react';
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
    FiUsers,
    FiInfo,
    FiPhone,
    FiZap
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchVisaByHandle, selectSelectedVisa, selectVisasLoading } from '../../redux/slices/visaSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import type { VisaVariant } from '../../types/visa-types';
import { FaWhatsapp } from 'react-icons/fa';
import { useCurrency } from '../../utils/useCurrency';

const VisaDetail: React.FC = () => {
    const { handle } = useParams<{ handle: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { formatPrice } = useCurrency();

    const visa = useAppSelector(selectSelectedVisa);
    const loading = useAppSelector(selectVisasLoading);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<VisaVariant | null>(null);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'notes'>('overview');
    const [showPolicyModal, setShowPolicyModal] = useState(false);

    useEffect(() => {
        if (handle) {
            dispatch(fetchVisaByHandle(handle));
        }
    }, [handle, dispatch]);

    // Set default variant when visa loads
    useEffect(() => {
        if (visa && visa.variants.length > 0 && !selectedVariant) {
            const defaultVariant = visa.variants.find(
                v => v.title.toLowerCase().includes('adult')
            ) || visa.variants[0];
            setSelectedVariant(defaultVariant);
        }
    }, [visa, selectedVariant]);

    const isGCCVisa = useMemo(() => {
        return visa?.isGCC;
    }, [visa]);

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

        let total = formatPrice(selectedVariant.price * quantity);

        selectedAddons.forEach(addonId => {
            const addon = visa.addons.find((a: any) => a.id === addonId);
            if (addon) {
                total += addon.price * quantity;
            }
        });

        return total;
    };

    const handleAddToCart = () => {
        if (!selectedVariant) return;

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

        const phoneNumber = `${import.meta.env.VITE_CONTACT_NUMBER}`;

        let message = `Hi! I'm interested in the ${visa.title}.\n\n`;
        message += `📍 Destination: ${visa.country}\n`;
        message += `⏱️ Duration: ${visa.duration}\n`;
        message += `👤 Applicant Type: ${selectedVariant?.title || 'Adult'}\n`;
        message += `👥 Number of Applicants: ${quantity}\n`;

        if (selectedAddons.length > 0) {
            const addonsText = visa.addons
                .filter((addon: any) => selectedAddons.includes(addon.id))
                .map((addon: any) => addon.title)
                .join(', ');
            message += `✨ Additional Services: ${addonsText}\n`;
        }

        message += `\nCould you please provide more information about the requirements and processing?`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
            {/* Policy Modal for GCC Visas */}
            {/* Policy Modal - Responsive */}
            {showPolicyModal && isGCCVisa && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiInfo className="text-amber-600 w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <h3 className="text-base sm:text-xl font-bold text-gray-900">
                                        UAE & Gulf Visa Policy
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowPolicyModal(false)}
                                    className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
                                >
                                    <span className="text-xl sm:text-2xl">✕</span>
                                </button>
                            </div>

                            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-700">
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                                    <p className="font-semibold text-amber-900 mb-2 text-sm sm:text-base">
                                        Important Terms & Conditions:
                                    </p>
                                    <ul className="space-y-2 sm:space-y-2.5">
                                        <li className="flex items-start">
                                            <span className="mr-2 flex-shrink-0">•</span>
                                            <span>Visa approval is at the sole discretion of the respective immigration authorities.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2 flex-shrink-0">•</span>
                                            <span className="font-semibold text-amber-900">
                                                Visa charges are non-refundable in the event of rejection.
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2 flex-shrink-0">•</span>
                                            <span>
                                                Applicants may be required to pay a refundable security deposit to safeguard against absconding, overstaying, or violating visa conditions.
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2 flex-shrink-0">•</span>
                                            <span>
                                                The security deposit is refunded only after the applicant exits the country within the permitted visa validity or changes status to employment or any other visa type.
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <p className="text-xs text-gray-500 px-1">
                                    By proceeding with the payment, you acknowledge and agree to these terms and conditions.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                                <button
                                    onClick={() => setShowPolicyModal(false)}
                                    className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-sm sm:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPolicyModal(false);
                                        handleAddToCart();
                                    }}
                                    className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition text-sm sm:text-base"
                                >
                                    I Agree, Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                {/* Global Visa Notice - Responsive */}
                {!isGCCVisa && (
                    <div className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FiGlobe className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">
                                    Global Visa - Inquiry Required
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">
                                    Visa conditions for <span className="font-semibold">{visa.country}</span> vary based on nationality, travel dates, and specific requirements. Due to these factors:
                                </p>
                                <ul className="text-xs sm:text-sm text-gray-700 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                                    <li className="flex items-start">
                                        <FiCheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                        <span className="sm:text-sm">Visa validity and stay duration depend on immigration rules and your nationality</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiCheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                        <span className="sm:text-sm">Documentation requirements must be verified with suppliers</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiCheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                        <span className="sm:text-sm">Processing time and eligibility need to be confirmed</span>
                                    </li>
                                </ul>
                                <div className="bg-white rounded-lg p-2.5 sm:p-3 border border-blue-200">
                                    <p className="text-xs sm:text-sm font-semibold text-blue-900">
                                        💡 Please submit an inquiry via WhatsApp. We'll verify all requirements and guide you through the process.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* GCC Visa Notice - Responsive */}
                {isGCCVisa && (
                    <div className="mb-4 sm:mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <FiCheckCircle className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">
                                    UAE & Gulf Visa - Online Payment Available
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">
                                    You can proceed with online payment for this visa. However, please note:
                                </p>
                                <ul className="text-xs sm:text-sm text-gray-700 space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                                    <li className="flex items-start">
                                        <FiAlertCircle className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                        <span>
                                            <span className="font-semibold">Visa approval</span> is at the discretion of immigration authorities
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiAlertCircle className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                        <span>
                                            <span className="font-semibold">Visa charges are non-refundable</span> in case of rejection
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiInfo className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                        <span>A refundable security deposit may be required</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={() => setShowPolicyModal(true)}
                                    className="text-xs sm:text-sm font-semibold text-green-700 hover:text-green-800 underline inline-flex items-center"
                                >
                                    View Complete Policy
                                    <span className="ml-1">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                                {/* Visa Type Badge */}
                                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${isGCCVisa
                                        ? 'bg-green-500 text-white'
                                        : 'bg-blue-500 text-white'
                                        }`}>
                                        {isGCCVisa ? '🇦🇪 UAE & Gulf Visa' : '🌍 Global Visa'}
                                    </span>
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
                                </div>
                            </div>

                            {/* Quick Info Cards */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                {visa.duration && <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <FiClock className="text-primary mb-2" size={18} />
                                    <div className="text-xs text-gray-600 mb-1">Duration</div>
                                    <div className="font-bold text-gray-900 text-sm sm:text-base">{visa.duration}</div>
                                </div>}
                                {visa.entryType && <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <FiGlobe className="text-primary mb-2" size={18} />
                                    <div className="text-xs text-gray-600 mb-1">Entry Type</div>
                                    <div className="font-bold text-gray-900 text-sm sm:text-base">{visa.entryType}</div>
                                </div>}
                                {visa.processingTime && <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <FiCheckCircle className="text-accent mb-2" size={18} />
                                    <div className="text-xs text-gray-600 mb-1">Processing</div>
                                    <div className="font-bold text-gray-900 text-sm sm:text-base">{visa.processingTime}</div>
                                </div>}
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <FiDollarSign className="text-accent mb-2" size={18} />
                                    <div className="text-xs text-gray-600 mb-1">
                                        {isGCCVisa ? 'Starting from' : 'Indicative Price'}
                                    </div>
                                    <div className="font-bold text-accent text-sm sm:text-base">{formatPrice(visa.price)}</div>
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
                                        <ul className="space-y-2 sm:space-y-3">
                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-3">
                                                    {isGCCVisa ? 'Visa Validity Information' : 'Important Notice'}
                                                </h4>
                                                {isGCCVisa ? (
                                                    <div>
                                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                                                            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                                                <li className="flex items-start">
                                                                    <FiCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                                    <span>Visa validity: 59 days from the date of issuance for entry into the UAE</span>
                                                                </li>
                                                                <li className="flex items-start">
                                                                    <FiCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                                    <span>Stay duration is as specified in the visa type selected</span>
                                                                </li>
                                                                <li className="flex items-start">
                                                                    <FiCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                                    <span>Entry type: {visa.entryType}</span>
                                                                </li>
                                                                <li className="flex items-start">
                                                                    <FiAlertCircle className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                                    <span className="font-medium">Overstaying may result in fines and future visa restrictions</span>
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        <div className="border-t pt-4 mt-4">
                                                            <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-3">
                                                                Processing Time
                                                            </h4>
                                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                                                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                                                    <li className="flex items-start">
                                                                        <FiClock className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                                        <span><span className="font-semibold">Normal Processing:</span> 48-72 hours</span>
                                                                    </li>
                                                                    <li className="flex items-start">
                                                                        <FiZap className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                                        <span><span className="font-semibold">Express Processing:</span> 24 hours (Additional 199 AED charge applies)</span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        <div className="border-t pt-4 mt-4">
                                                            <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-3">
                                                                What's Included
                                                            </h4>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                                                <div className="flex items-center text-xs sm:text-sm text-gray-700">
                                                                    <FiCheckCircle className="text-accent mr-2 flex-shrink-0" size={14} />
                                                                    <span>Visa processing & submission</span>
                                                                </div>
                                                                <div className="flex items-center text-xs sm:text-sm text-gray-700">
                                                                    <FiCheckCircle className="text-accent mr-2 flex-shrink-0" size={14} />
                                                                    <span>Document verification</span>
                                                                </div>
                                                                <div className="flex items-center text-xs sm:text-sm text-gray-700">
                                                                    <FiCheckCircle className="text-accent mr-2 flex-shrink-0" size={14} />
                                                                    <span>Expert consultation</span>
                                                                </div>
                                                                <div className="flex items-center text-xs sm:text-sm text-gray-700">
                                                                    <FiCheckCircle className="text-accent mr-2 flex-shrink-0" size={14} />
                                                                    <span>Email notifications</span>
                                                                </div>
                                                                <div className="flex items-center text-xs sm:text-sm text-gray-700">
                                                                    <FiCheckCircle className="text-accent mr-2 flex-shrink-0" size={14} />
                                                                    <span>24/7 customer support</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                                        <p className="text-xs sm:text-sm text-gray-700 mb-3">
                                                            <span className="font-semibold text-blue-900">Visa validity varies by nationality:</span> The duration of stay for {visa.country} depends on your nationality, passport type, and immigration rules.
                                                        </p>
                                                        <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                                            <li className="flex items-start">
                                                                <FiInfo className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                                <span>Some nationalities may receive 9-12 days based on travel itinerary</span>
                                                            </li>
                                                            <li className="flex items-start">
                                                                <FiInfo className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                                <span>Others may be eligible for 30-90 days stay</span>
                                                            </li>
                                                            <li className="flex items-start">
                                                                <FiInfo className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                                <span className="font-medium">We'll confirm exact validity after reviewing your details</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            {visa?.features.map((feature: string, index: number) => (
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
                                        <ul className="space-y-2 sm:space-y-3">
                                            {visa?.requirements?.map((req: string, index: number) => (
                                                <li key={index} className="flex items-start">
                                                    <FiFileText className="text-primary mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0" size={16} />
                                                    <span className="text-gray-700 text-sm sm:text-base">{req}</span>
                                                </li>
                                            ))}

                                            {isGCCVisa && (
                                                <div className="border-t pt-4 mt-4">
                                                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-3">
                                                        Complete Document Checklist
                                                    </h4>
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 space-y-2">
                                                        <div className="flex items-start text-xs sm:text-sm">
                                                            <FiFileText className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                            <span>Passport copies (front and signature page) for each visitor</span>
                                                        </div>
                                                        <div className="flex items-start text-xs sm:text-sm">
                                                            <FiFileText className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                            <span>Color photograph with white background for each visitor</span>
                                                        </div>
                                                        <div className="flex items-start text-xs sm:text-sm">
                                                            <FiFileText className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                            <span>Guarantor's Passport, Visa & Emirates ID</span>
                                                        </div>
                                                        <div className="flex items-start text-xs sm:text-sm">
                                                            <FiFileText className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                            <span>Round-trip ticket (Not mandatory)</span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 mt-3">
                                                        <h5 className="font-semibold text-xs sm:text-sm text-amber-900 mb-2">
                                                            Additional Requirements for Pakistani Nationals:
                                                        </h5>
                                                        <div className="space-y-2">
                                                            <div className="flex items-start text-xs sm:text-sm">
                                                                <FiFileText className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                                <span>Proof of stay in UAE (Tenancy Contract of guarantor or confirmed hotel reservation)</span>
                                                            </div>
                                                            <div className="flex items-start text-xs sm:text-sm">
                                                                <FiFileText className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                                <span>CNIC (Computerized National Identity Card)</span>
                                                            </div>
                                                            <div className="flex items-start text-xs sm:text-sm">
                                                                <FiFileText className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                                <span>Last 6 months bank statement (of visitor or guarantor)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-3">
                                                    Document Specifications
                                                </h4>
                                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 space-y-2">
                                                    <div className="flex items-start text-xs sm:text-sm">
                                                        <FiCheckCircle className="text-primary mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                        <div>
                                                            <span className="font-medium">Passport Photos:</span>
                                                            <span className="text-gray-600"> White background, 2x2 inches, recent (within 6 months)</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start text-xs sm:text-sm">
                                                        <FiCheckCircle className="text-primary mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                        <div>
                                                            <span className="font-medium">Passport Copy:</span>
                                                            <span className="text-gray-600"> Clear, colored scan showing all details</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start text-xs sm:text-sm">
                                                        <FiCheckCircle className="text-primary mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                        <div>
                                                            <span className="font-medium">Supporting Documents:</span>
                                                            <span className="text-gray-600"> PDF or JPG format, clear and legible</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {!isGCCVisa && (
                                                <div className="border-t pt-4">
                                                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-3">
                                                        Additional Requirements (May Apply)
                                                    </h4>
                                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                                                        <p className="text-xs sm:text-sm text-gray-700 mb-2">
                                                            Depending on your nationality and visa type, you may also need:
                                                        </p>
                                                        <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                                            <li className="flex items-start">
                                                                <span className="mr-2">•</span>
                                                                <span>Travel itinerary or flight bookings</span>
                                                            </li>
                                                            <li className="flex items-start">
                                                                <span className="mr-2">•</span>
                                                                <span>Hotel reservations or accommodation proof</span>
                                                            </li>
                                                            <li className="flex items-start">
                                                                <span className="mr-2">•</span>
                                                                <span>Bank statements (last 3-6 months)</span>
                                                            </li>
                                                            <li className="flex items-start">
                                                                <span className="mr-2">•</span>
                                                                <span>Cover letter stating purpose of visit</span>
                                                            </li>
                                                            <li className="flex items-start">
                                                                <span className="mr-2">•</span>
                                                                <span>Travel insurance (recommended)</span>
                                                            </li>
                                                        </ul>
                                                        <p className="text-xs text-gray-600 mt-3 font-medium">
                                                            We'll confirm exact requirements after reviewing your application
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'notes' && (
                                    <div>
                                        <ul className="space-y-2 sm:space-y-3">
                                            {visa.importantNotes.map((note: string, index: number) => (
                                                <li key={index} className="flex items-start">
                                                    <FiAlertCircle className="text-accent mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0" size={16} />
                                                    <span className="text-gray-700 text-sm sm:text-base">{note}</span>
                                                </li>
                                            ))}

                                            {isGCCVisa && (
                                                <div className="border-t pt-4 mt-4">
                                                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-3">
                                                        Critical Information
                                                    </h4>
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 space-y-2">
                                                        <div className="flex items-start text-xs sm:text-sm">
                                                            <FiAlertCircle className="text-red-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                            <div>
                                                                <span className="font-semibold text-red-900">Recent UAE Visit:</span>
                                                                <span className="text-gray-700"> The chances of rejection are high if the applicant has visited the UAE within the past month.</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start text-xs sm:text-sm">
                                                            <FiAlertCircle className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                            <div>
                                                                <span className="font-semibold text-amber-900">Guarantor Required:</span>
                                                                <span className="text-gray-700"> A refundable security deposit and guarantor documents are required for all visa applications.</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start text-xs sm:text-sm">
                                                            <FiInfo className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                            <div>
                                                                <span className="font-semibold text-blue-900">No Guarantor/Direct Relative:</span>
                                                                <span className="text-gray-700"> A refundable deposit of 2,500 AED is required. This will be refunded within 7-8 working days after exit, visa status change, or rejection.</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start text-xs sm:text-sm">
                                                            <FiAlertCircle className="text-red-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                            <div>
                                                                <span className="font-semibold text-red-900">Approval Discretion:</span>
                                                                <span className="text-gray-700"> Visa approval is at the sole discretion of immigration authorities. Visa charges are non-refundable in case of rejection.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </ul>
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-3">
                                                {isGCCVisa ? 'Refund & Cancellation Policy' : 'Payment & Refund Policy'}
                                            </h4>
                                            {isGCCVisa ? (
                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 space-y-2">
                                                    <div className="flex items-start text-xs sm:text-sm">
                                                        <FiAlertCircle className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                        <div>
                                                            <span className="font-semibold text-amber-900">Non-Refundable:</span>
                                                            <span className="text-gray-700"> Visa fees are non-refundable in case of rejection by immigration authorities.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start text-xs sm:text-sm">
                                                        <FiInfo className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                        <div>
                                                            <span className="font-semibold">Security Deposit:</span>
                                                            <span className="text-gray-700"> May be required and is fully refundable upon exit or visa status change.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start text-xs sm:text-sm">
                                                        <FiCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                        <div>
                                                            <span className="font-semibold">Cancellation Before Processing:</span>
                                                            <span className="text-gray-700"> Full refund if cancelled before submission to immigration (processing fee may apply).</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 space-y-2">
                                                    <div className="flex items-start text-xs sm:text-sm">
                                                        <FiInfo className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                        <div>
                                                            <span className="font-semibold text-blue-900">Payment After Confirmation:</span>
                                                            <span className="text-gray-700"> Payment is collected only after we confirm eligibility, requirements, and exact pricing.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start text-xs sm:text-sm">
                                                        <FiCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                        <div>
                                                            <span className="font-semibold">Transparent Pricing:</span>
                                                            <span className="text-gray-700"> No hidden fees. Final quote includes all processing charges.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start text-xs sm:text-sm">
                                                        <FiAlertCircle className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                                                        <div>
                                                            <span className="font-semibold text-amber-900">Refund Policy:</span>
                                                            <span className="text-gray-700"> Refund terms will be clearly communicated before payment based on supplier and immigration policies.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-3">
                                                Travel Advisory
                                            </h4>
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 space-y-2 text-xs sm:text-sm text-gray-700">
                                                <p className="flex items-start">
                                                    <span className="mr-2">•</span>
                                                    <span>Ensure your passport is valid for at least 6 months from date of travel</span>
                                                </p>
                                                <p className="flex items-start">
                                                    <span className="mr-2">•</span>
                                                    <span>Check if you need any health requirements or vaccinations for your destination</span>
                                                </p>
                                                <p className="flex items-start">
                                                    <span className="mr-2">•</span>
                                                    <span>Carry printed copies of your visa and supporting documents during travel</span>
                                                </p>
                                                <p className="flex items-start">
                                                    <span className="mr-2">•</span>
                                                    <span>Review entry restrictions and COVID-19 requirements if applicable</span>
                                                </p>
                                                <p className="flex items-start">
                                                    <span className="mr-2">•</span>
                                                    <span>Contact your embassy for country-specific travel advisories</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="border-t pt-4">
                                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
                                                <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">
                                                    Need Assistance?
                                                </h4>
                                                <p className="text-xs sm:text-sm text-gray-700 mb-3">
                                                    Our visa experts are available 24/7 to help you with any questions about your application.
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <a href="tel:+97154567263"
                                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-primary/90 transition"
                                                    >
                                                        <FiPhone size={14} />
                                                        Call: +971 54 567 2633
                                                    </a>
                                                    <a href={`https://wa.me/${import.meta.env.VITE_CONTACT_NUMBER}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-[#128C7E] transition"
                                                    >
                                                        <FaWhatsapp size={14} />
                                                        WhatsApp Support
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
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
                                    {isGCCVisa ? 'Book Your Visa' : 'Request Information'}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    {isGCCVisa
                                        ? 'Select options and add to cart'
                                        : 'Configure your requirements and inquire'
                                    }
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
                                                    {formatPrice(variant.price)}
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
                            {visa?.addons && visa?.addons.length > 0 && (
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
                                                        +{formatPrice(addon?.price)}
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
                                            {selectedVariant ? formatPrice(selectedVariant.price * quantity) : 0}
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
                                                    {formatPrice(addon.price * quantity)}
                                                </span>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                                <div className="flex justify-between items-center pt-2 sm:pt-3 border-t">
                                    <span className="font-bold text-base sm:text-lg text-gray-900">
                                        {isGCCVisa ? 'Total' : 'Indicative Total'}
                                    </span>
                                    <span className="font-bold text-xl sm:text-2xl text-accent">
                                        {calculateTotal()}
                                    </span>
                                </div>
                                {!isGCCVisa && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        * Final price will be confirmed after verification
                                    </p>
                                )}
                            </div>

                            {/* CTA Buttons */}
                            {isGCCVisa ? (
                                <>
                                    {/* Add to Cart - Desktop */}
                                    <button
                                        onClick={() => setShowPolicyModal(true)}
                                        disabled={!selectedVariant}
                                        className="hidden lg:flex w-full bg-accent text-white py-3 sm:py-4 rounded-lg font-bold hover:bg-accent-dark transition-colors items-center justify-center shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
                                    >
                                        <FiShoppingCart className="mr-2" size={20} />
                                        Add to Cart & Pay Online
                                    </button>

                                    {/* WhatsApp Inquiry */}
                                    <button
                                        onClick={handleWhatsAppInquiry}
                                        className="w-full bg-primary text-white font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <FaWhatsapp className="w-5 h-5" />
                                        Or Inquire via WhatsApp
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleWhatsAppInquiry}
                                    className="w-full bg-primary text-white font-bold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                                >
                                    <FaWhatsapp className="w-5 h-5" />
                                    Inquire via WhatsApp
                                </button>
                            )}

                            {/* Contact Support */}
                            <div className="hidden lg:block text-center pt-3 sm:pt-4 border-t">
                                <p className="text-xs sm:text-sm text-gray-600 mb-2">Need Help?</p>

                                <a href="tel:+97154567263"
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
            {isGCCVisa && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                            <div className="text-xs text-gray-600">Total Amount</div>
                            <div className="text-xl font-bold text-accent">AED {calculateTotal()}</div>
                        </div>
                        <button
                            onClick={() => setShowPolicyModal(true)}
                            disabled={!selectedVariant}
                            className="flex-1 bg-accent text-white py-3 rounded-lg font-bold hover:bg-accent-dark transition-colors flex items-center justify-center shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                        >
                            <FiShoppingCart className="mr-2" size={18} />
                            Add to Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisaDetail;