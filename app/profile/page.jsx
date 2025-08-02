'use client'
import { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";

const UserProfile = () => {
    const { userData, fetchUserData, router } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        address: {
            area: '',
            city: '',
            state: '',
            pincode: '',
        }
    });

    // Initialize profile data when userData is loaded
    useEffect(() => {
        if (userData) {
            setProfileData({
                fullName: userData.fullName || '',
                email: userData.email || '',
                phoneNumber: userData.phoneNumber || '',
                dateOfBirth: userData.dateOfBirth || '',
                gender: userData.gender || '',
                address: {
                    area: userData.address?.area || '',
                    city: userData.address?.city || '',
                    state: userData.address?.state || '',
                    pincode: userData.address?.pincode || '',
                }
            });
            setLoading(false);
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('address.')) {
            const addressField = name.split('.')[1];
            setProfileData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Here you would typically make an API call to update user data
            console.log('Saving profile data:', profileData);
            
            // Simulate API call
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update local userData state (you might want to update your context)
            await fetchUserData();
            
            setIsEditing(false);
            setLoading(false);
            
            // You could show a success message here
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            setLoading(false);
            alert('Error updating profile. Please try again.');
        }
    };

    const handleCancel = () => {
        // Reset to original userData
        if (userData) {
            setProfileData({
                fullName: userData.fullName || '',
                email: userData.email || '',
                phoneNumber: userData.phoneNumber || '',
                dateOfBirth: userData.dateOfBirth || '',
                gender: userData.gender || '',
                address: {
                    area: userData.address?.area || '',
                    city: userData.address?.city || '',
                    state: userData.address?.state || '',
                    pincode: userData.address?.pincode || '',
                }
            });
        }
        setIsEditing(false);
    };

    if (loading) return <Loading />;

    return (
        <div className="bg-gradient-to-r from-black via-gray-900 to-black min-h-screen">
            <Navbar />
            <br />
            <br />
            <br />
            
            <div className="px-6 md:px-16 lg:px-32 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex flex-col items-center pt-12">
                            <p className="text-2xl md:text-3xl font-medium text-gray-500/80">
                                My Profile
                            </p>
                            <div className="w-16 h-0.5 bg-orange-600 rounded-full mt-2"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Picture Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 text-center">
                                <div className="relative mx-auto w-32 h-32 mb-4">
                                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-4xl font-bold">
                                            {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                    {profileData.fullName || 'User Name'}
                                </h3>
                                <p className="text-gray-500/80 mb-4">
                                    {profileData.email || 'user@example.com'}
                                </p>
                                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
                                    Change Photo
                                </button>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mt-6">
                                <h4 className="text-lg font-semibold text-gray-300 mb-4">Quick Actions</h4>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => router.push('/my-orders')}
                                        className="w-full text-left px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors flex items-center gap-3"
                                    >
                                        <span>📦</span>
                                        My Orders
                                    </button>
                                    <button 
                                        onClick={() => router.push('/add-address')}
                                        className="w-full text-left px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors flex items-center gap-3"
                                    >
                                        <span>📍</span>
                                        Manage Addresses
                                    </button>
                                    <button className="w-full text-left px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors flex items-center gap-3">
                                        <span>🔒</span>
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold text-gray-300">
                                        Profile Information
                                    </h3>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleCancel}
                                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleSave} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={profileData.fullName}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-colors ${
                                                    isEditing 
                                                        ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-orange-500' 
                                                        : 'bg-gray-800 border-gray-700 text-gray-400'
                                                }`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-colors ${
                                                    isEditing 
                                                        ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-orange-500' 
                                                        : 'bg-gray-800 border-gray-700 text-gray-400'
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={profileData.phoneNumber}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-colors ${
                                                    isEditing 
                                                        ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-orange-500' 
                                                        : 'bg-gray-800 border-gray-700 text-gray-400'
                                                }`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={profileData.dateOfBirth}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-colors ${
                                                    isEditing 
                                                        ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-orange-500' 
                                                        : 'bg-gray-800 border-gray-700 text-gray-400'
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-sm font-medium mb-2">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={profileData.gender}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-colors ${
                                                isEditing 
                                                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-orange-500' 
                                                    : 'bg-gray-800 border-gray-700 text-gray-400'
                                            }`}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </select>
                                    </div>

                                    {/* Address Section */}
                                    <div className="pt-4 border-t border-gray-700">
                                        <h4 className="text-lg font-semibold text-gray-300 mb-4">Address Information</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-gray-400 text-sm font-medium mb-2">
                                                    Area/Street
                                                </label>
                                                <textarea
                                                    name="address.area"
                                                    value={profileData.address.area}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    rows={3}
                                                    className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-colors resize-none ${
                                                        isEditing 
                                                            ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-orange-500' 
                                                            : 'bg-gray-800 border-gray-700 text-gray-400'
                                                    }`}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="address.city"
                                                        value={profileData.address.city}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-colors ${
                                                            isEditing 
                                                                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-orange-500' 
                                                                : 'bg-gray-800 border-gray-700 text-gray-400'
                                                        }`}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                                        State
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="address.state"
                                                        value={profileData.address.state}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-colors ${
                                                            isEditing 
                                                                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-orange-500' 
                                                                : 'bg-gray-800 border-gray-700 text-gray-400'
                                                        }`}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                                        Pin Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="address.pincode"
                                                        value={profileData.address.pincode}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-colors ${
                                                            isEditing 
                                                                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-orange-500' 
                                                                : 'bg-gray-800 border-gray-700 text-gray-400'
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default UserProfile;