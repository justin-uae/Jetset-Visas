import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPackage, FiLogOut, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { fetchCustomerOrders, selectOrders, selectOrdersError, selectOrdersLoading } from '../../redux/slices/orderSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useCurrency } from '../../utils/useCurrency';
import { logout } from '../../redux/slices/authSlice';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { formatPrice } = useCurrency();

    const { user, isAuthenticated, accessToken } = useAppSelector((state) => state.auth);
    const orders = useAppSelector(selectOrders);
    const loading = useAppSelector(selectOrdersLoading);
    const error = useAppSelector(selectOrdersError);

    useEffect(() => {
        if (!isAuthenticated || !accessToken) {
            navigate('/login');
            return;
        }

        // Fetch orders when component mounts
        dispatch(fetchCustomerOrders(accessToken));
    }, [isAuthenticated, accessToken, navigate, dispatch]);
    console.log("user", user);
    console.log("isAuthenticated", isAuthenticated);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login');
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'fulfilled':
            case 'paid':
                return <FiCheckCircle className="text-green-600" />;
            case 'pending':
            case 'partially_fulfilled':
                return <FiClock className="text-yellow-600" />;
            case 'unfulfilled':
                return <FiAlertCircle className="text-orange-600" />;
            default:
                return <FiAlertCircle className="text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'fulfilled':
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
            case 'partially_fulfilled':
                return 'bg-yellow-100 text-yellow-800';
            case 'unfulfilled':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'fulfilled':
                return 'Completed';
            case 'unfulfilled':
                return 'Processing';
            case 'partially_fulfilled':
                return 'Partially Completed';
            case 'pending':
                return 'Pending';
            case 'paid':
                return 'Paid';
            default:
                return status || 'Unknown';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Profile Info */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <FiUser className="text-primary text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {user?.firstName} {user?.lastName}
                                </h1>
                                <p className="text-gray-600 flex items-center gap-2">
                                    <FiMail className="text-sm" />
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <FiLogOut />
                            Logout
                        </button>
                    </div>

                    {/* Account Details */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Account Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">First Name</label>
                                <p className="text-gray-900 font-semibold mt-1">{user?.firstName || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Last Name</label>
                                <p className="text-gray-900 font-semibold mt-1">{user?.lastName || 'N/A'}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-sm font-medium text-gray-600">Email Address</label>
                                <p className="text-gray-900 font-semibold mt-1">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bookings Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FiPackage className="text-primary" />
                            My Visa Bookings
                        </h2>
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            {orders.length} {orders.length === 1 ? 'booking' : 'bookings'}
                        </span>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start">
                                <FiAlertCircle className="text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-semibold text-red-900">Error Loading Orders</h4>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="text-gray-600 mt-4">Loading your bookings...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12">
                            <FiPackage className="text-gray-400 text-5xl mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                            <p className="text-gray-600 mb-6">Start exploring our visa services</p>
                            <button
                                onClick={() => navigate('/visas')}
                                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Browse Visas
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900">Order {order.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.processedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(order.fulfillmentStatus)}
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                    order.fulfillmentStatus
                                                )}`}
                                            >
                                                {getStatusLabel(order.fulfillmentStatus)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {order.lineItems.edges.map((edge, index) => {
                                            const item = edge.node;
                                            const itemPrice = item.variant?.price.amount
                                                ? parseFloat(item.variant.price.amount)
                                                : 0;

                                            return (
                                                <div key={`${order.id}-${index}`} className="flex justify-between text-sm">
                                                    <span className="text-gray-700">
                                                        {item.title} × {item.quantity}
                                                    </span>
                                                    <span className="text-gray-900 font-semibold">
                                                        {formatPrice(itemPrice)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="font-bold text-lg text-accent">
                                            {formatPrice(parseFloat(order.totalPrice.amount))}
                                        </span>
                                    </div>

                                    {/* Financial Status */}
                                    <div className="mt-3 flex items-center gap-2 text-sm">
                                        <span className="text-gray-600">Payment:</span>
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                                order.financialStatus
                                            )}`}
                                        >
                                            {getStatusLabel(order.financialStatus)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;