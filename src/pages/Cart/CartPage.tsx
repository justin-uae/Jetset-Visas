import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowRight,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiCalendar,
  FiFileText,
  FiAlertCircle
} from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';

interface ApplicantForm {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  phoneNumber: string;
  specialRequest: string;
}

const VisaCartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [applicants, setApplicants] = useState<ApplicantForm[]>([
    {
      firstName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      nationality: '',
      email: '',
      phoneNumber: '',
      specialRequest: ''
    }
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleUpdateQuantity = (itemId: string, change: number) => {
    const item = cartItems.find(i => i.visa.id === itemId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      dispatch(updateQuantity({ itemId, quantity: newQuantity }));

      if (newQuantity > applicants.length) {
        const newApplicants = [...applicants];
        for (let i = applicants.length; i < newQuantity; i++) {
          newApplicants.push({
            firstName: '',
            lastName: '',
            gender: '',
            dateOfBirth: '',
            nationality: '',
            email: '',
            phoneNumber: '',
            specialRequest: ''
          });
        }
        setApplicants(newApplicants);
      } else if (newQuantity < applicants.length) {
        setApplicants(applicants.slice(0, newQuantity));
      }
    }
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleApplicantChange = (index: number, field: keyof ApplicantForm, value: string) => {
    const newApplicants = [...applicants];
    newApplicants[index] = {
      ...newApplicants[index],
      [field]: value
    };
    setApplicants(newApplicants);

    const errorKey = `applicant${index}_${field}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    applicants.forEach((applicant, index) => {
      if (!applicant.firstName.trim()) {
        newErrors[`applicant${index}_firstName`] = 'First name is required';
      }
      if (!applicant.lastName.trim()) {
        newErrors[`applicant${index}_lastName`] = 'Last name is required';
      }
      if (!applicant.gender) {
        newErrors[`applicant${index}_gender`] = 'Gender is required';
      }
      if (!applicant.dateOfBirth) {
        newErrors[`applicant${index}_dateOfBirth`] = 'Date of birth is required';
      }
      if (!applicant.nationality.trim()) {
        newErrors[`applicant${index}_nationality`] = 'Nationality is required';
      }
      if (!applicant.email.trim()) {
        newErrors[`applicant${index}_email`] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicant.email)) {
        newErrors[`applicant${index}_email`] = 'Invalid email format';
      }
      if (!applicant.phoneNumber.trim()) {
        newErrors[`applicant${index}_phoneNumber`] = 'Phone number is required';
      }
    });

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToCheckout = () => {
    setShowCheckoutForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitCheckout = () => {
    if (validateForm()) {
      console.log('Checkout data:', {
        cartItems,
        applicants,
        total: calculateTotal()
      });

      alert('Order submitted successfully! Redirecting to payment...');
    } else {
      alert('Please fill in all required fields');
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      let itemTotal = item.visa.price * item.quantity;
      if (item.addons) {
        item.addons.forEach(addon => {
          itemTotal += addon.price * item.quantity;
        });
      }
      return sum + itemTotal;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const serviceFee = 25;
  const calculateTotal = () => subtotal + serviceFee;

  const totalApplicants = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              {showCheckoutForm ? 'Checkout' : 'Your Cart'}
            </h1>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <FiShield className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              <span className="hidden sm:inline">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <FiCheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">Start exploring our visa services to begin your journey</p>
              <button
                onClick={() => navigate('/visas')}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition text-sm sm:text-base"
              >
                Browse Visa Services
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Cart Items or Checkout Form */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {!showCheckoutForm ? (
                <>
                  {/* Cart Items */}
                  {cartItems.map((item) => (
                    <div key={item.visa.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                      <div className="flex gap-3 sm:gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0">
                          <img
                            src={item?.visa?.images[0]}
                            alt={`${item.visa?.title}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 pr-2">
                              <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 line-clamp-2">
                                {item.visa.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600">{item.visa.country}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.visa.id)}
                              className="text-gray-400 hover:text-red-600 transition p-1 flex-shrink-0"
                            >
                              <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>

                          <div className="space-y-1 mb-3">
                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                              <FiCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{item.visa.entryType} - {item.visa.duration}</span>
                            </div>
                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                              <FiClock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{item.visa.processingTime}</span>
                            </div>
                            {item.addons && item.addons.length > 0 && (
                              <div className="text-xs sm:text-sm text-primary font-medium truncate">
                                + {item.addons.map(a => a.title).join(', ')}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => handleUpdateQuantity(item.visa.id, -1)}
                                className="p-1.5 sm:p-2 hover:bg-gray-100 transition"
                                disabled={item.quantity <= 1}
                              >
                                <FiMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <span className="px-2 sm:px-4 font-semibold text-sm sm:text-base">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.visa.id, 1)}
                                className="p-1.5 sm:p-2 hover:bg-gray-100 transition"
                              >
                                <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                                AED {(item.visa.price + (item.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0)) * item.quantity}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs sm:text-sm text-gray-600">
                                  AED {item.visa.price + (item.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0)} each
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {/* Checkout Form */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Applicant Information</h2>
                      <span className="text-xs sm:text-sm text-gray-600">
                        {totalApplicants} Applicant{totalApplicants > 1 ? 's' : ''}
                      </span>
                    </div>

                    {applicants.map((applicant, index) => (
                      <div key={index} className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b last:border-b-0">
                        <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">
                          Applicant {index + 1}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {/* First Name */}
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              First Name *
                            </label>
                            <div className="relative">
                              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                id={`applicant${index}_firstName`}
                                type="text"
                                value={applicant.firstName}
                                onChange={(e) => handleApplicantChange(index, 'firstName', e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors[`applicant${index}_firstName`] ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                placeholder="Enter first name"
                              />
                            </div>
                            {errors[`applicant${index}_firstName`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`applicant${index}_firstName`]}</p>
                            )}
                          </div>

                          {/* Last Name */}
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              Last Name *
                            </label>
                            <div className="relative">
                              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                id={`applicant${index}_lastName`}
                                type="text"
                                value={applicant.lastName}
                                onChange={(e) => handleApplicantChange(index, 'lastName', e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors[`applicant${index}_lastName`] ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                placeholder="Enter last name"
                              />
                            </div>
                            {errors[`applicant${index}_lastName`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`applicant${index}_lastName`]}</p>
                            )}
                          </div>

                          {/* Gender */}
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              Gender *
                            </label>
                            <select
                              id={`applicant${index}_gender`}
                              value={applicant.gender}
                              onChange={(e) => handleApplicantChange(index, 'gender', e.target.value)}
                              className={`w-full px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors[`applicant${index}_gender`] ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                            {errors[`applicant${index}_gender`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`applicant${index}_gender`]}</p>
                            )}
                          </div>

                          {/* Date of Birth */}
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              Date of Birth *
                            </label>
                            <div className="relative">
                              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                id={`applicant${index}_dateOfBirth`}
                                type="date"
                                value={applicant.dateOfBirth}
                                onChange={(e) => handleApplicantChange(index, 'dateOfBirth', e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors[`applicant${index}_dateOfBirth`] ? 'border-red-500' : 'border-gray-300'
                                  }`}
                              />
                            </div>
                            {errors[`applicant${index}_dateOfBirth`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`applicant${index}_dateOfBirth`]}</p>
                            )}
                          </div>

                          {/* Nationality */}
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              Nationality *
                            </label>
                            <div className="relative">
                              <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                id={`applicant${index}_nationality`}
                                type="text"
                                value={applicant.nationality}
                                onChange={(e) => handleApplicantChange(index, 'nationality', e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors[`applicant${index}_nationality`] ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                placeholder="Enter nationality"
                              />
                            </div>
                            {errors[`applicant${index}_nationality`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`applicant${index}_nationality`]}</p>
                            )}
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              Email Address *
                            </label>
                            <div className="relative">
                              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                id={`applicant${index}_email`}
                                type="email"
                                value={applicant.email}
                                onChange={(e) => handleApplicantChange(index, 'email', e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors[`applicant${index}_email`] ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                placeholder="Enter email address"
                              />
                            </div>
                            {errors[`applicant${index}_email`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`applicant${index}_email`]}</p>
                            )}
                          </div>

                          {/* Phone Number */}
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              Phone Number *
                            </label>
                            <div className="relative">
                              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                id={`applicant${index}_phoneNumber`}
                                type="tel"
                                value={applicant.phoneNumber}
                                onChange={(e) => handleApplicantChange(index, 'phoneNumber', e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${errors[`applicant${index}_phoneNumber`] ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                placeholder="+971 XX XXX XXXX"
                              />
                            </div>
                            {errors[`applicant${index}_phoneNumber`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`applicant${index}_phoneNumber`]}</p>
                            )}
                          </div>

                          {/* Special Request */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              Special Request (Optional)
                            </label>
                            <div className="relative">
                              <FiFileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                              <textarea
                                value={applicant.specialRequest}
                                onChange={(e) => handleApplicantChange(index, 'specialRequest', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                rows={3}
                                placeholder="Any special requests or additional information..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Terms and Conditions */}
                    <div className="mt-4 sm:mt-6">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeToTerms}
                          onChange={(e) => {
                            setAgreeToTerms(e.target.checked);
                            if (errors.terms) {
                              const newErrors = { ...errors };
                              delete newErrors.terms;
                              setErrors(newErrors);
                            }
                          }}
                          className="mt-1 mr-2 sm:mr-3 w-4 h-4"
                        />
                        <span className="text-xs sm:text-sm text-gray-700">
                          I agree to the{' '}
                          <a href="/terms" className="text-primary hover:underline">
                            Terms and Conditions
                          </a>{' '}
                          and{' '}
                          <a href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                      {errors.terms && (
                        <p className="text-red-500 text-xs mt-1 ml-6">{errors.terms}</p>
                      )}
                    </div>

                    {/* Important Notice */}
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start">
                        <FiAlertCircle className="text-amber-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0 w-4 h-4" />
                        <div className="text-xs sm:text-sm text-amber-800">
                          <p className="font-semibold mb-1">Important Notice</p>
                          <p>
                            Please ensure all information is accurate and matches your passport.
                            Incorrect information may lead to visa rejection and fees are non-refundable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:sticky lg:top-20">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Order Summary</h3>

                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  {cartItems.map((item) => (
                    <div key={item.visa.id} className="text-xs sm:text-sm">
                      <div className="flex justify-between text-gray-600 mb-1">
                        <span className="line-clamp-1">{item.visa.title}</span>
                        <span className="ml-2">AED {item.visa.price * item.quantity}</span>
                      </div>
                      {item.addons && item.addons.map((addon) => (
                        <div key={addon.id} className="flex justify-between text-gray-500 text-xs ml-3 sm:ml-4">
                          <span className="line-clamp-1">+ {addon.title}</span>
                          <span className="ml-2">AED {addon.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="border-t pt-2 sm:pt-3 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>AED {subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>Service Fee</span>
                    <span>AED {serviceFee.toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-2 sm:pt-3">
                    <div className="flex justify-between text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>AED {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {!showCheckoutForm ? (
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-accent text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-accent/90 transition flex items-center justify-center gap-2 mb-3 sm:mb-4 text-sm sm:text-base"
                  >
                    Proceed to Checkout
                    <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitCheckout}
                    className="w-full bg-accent text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-accent/90 transition flex items-center justify-center gap-2 mb-3 sm:mb-4 text-sm sm:text-base"
                  >
                    Submit & Pay
                    <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}

                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <FiShield className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiClock className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>Processing starts immediately after payment</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-accent flex-shrink-0" />
                    <span>Document verification included</span>
                  </div>
                </div>

                <div className="hidden lg:block mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>

              {/* Help Section */}
              <div className="hidden lg:block bg-blue-50 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Need Help?</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">
                  Our visa experts are available 24/7 to assist you
                </p>
                <a
                  href="tel:+97154567263"
                  className="text-xs sm:text-sm text-primary font-semibold hover:text-accent"
                >
                  +971 54 567 2633
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Bar - Mobile */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs text-gray-600">Total Amount</div>
              <div className="text-lg font-bold text-gray-900">AED {calculateTotal().toFixed(2)}</div>
            </div>
            <button
              onClick={showCheckoutForm ? handleSubmitCheckout : handleProceedToCheckout}
              className="flex-1 max-w-[180px] bg-accent text-white py-2.5 rounded-lg font-semibold hover:bg-accent/90 transition flex items-center justify-center gap-2 text-sm"
            >
              {showCheckoutForm ? 'Submit & Pay' : 'Checkout'}
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaCartPage;