'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { assets } from '@/assets/assets';
import Footer from '@/components/Footer';
import ImageUpload from '@/components/ImageUpload';
import Loading from '@/components/Loading';
import Navbar from '@/components/Navbar';
import { useAppContext } from '@/context/AppContext';

const UserProfile = () => {
  const { token, userRole, router } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
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
    },
  });

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setProfileData({
              fullName: data.user.name || '',
              email: data.user.email || '',
              phoneNumber: data.user.phoneNumber || '',
              dateOfBirth: data.user.dateOfBirth || '',
              gender: data.user.gender || '',
              address: {
                area: data.user.address?.area || '',
                city: data.user.address?.city || '',
                state: data.user.address?.state || '',
                pincode: data.user.address?.pincode || '',
              },
            });
          }
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, router]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsEditing(false);
          alert('Profile updated successfully!');
        } else {
          alert(data.message || 'Failed to update profile');
        }
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '+1-555-0123',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      address: {
        area: 'Downtown',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
      },
    });
    setIsEditing(false);
  };

  // Handle profile photo upload
  const handlePhotoUpload = async file => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch('/api/profile/upload-photo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfilePhoto(data.photoUrl);
          alert('Profile photo updated successfully!');
        } else {
          throw new Error(data.message || 'Failed to upload photo');
        }
      } else {
        throw new Error('Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  if (loading) return <Loading />;

  if (!token) {
    return (
      <div className='bg-gradient-to-r from-black via-gray-900 to-black min-h-screen'>
        <Navbar />
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-white mb-4'>
              Access Denied
            </h1>
            <p className='text-gray-400 mb-6'>
              Please log in to view your profile.
            </p>
            <button
              onClick={() => router.push('/login')}
              className='bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700'
            >
              Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-r from-black via-gray-900 to-black min-h-screen'>
      <Navbar />
      <br />
      <br />
      <br />

      <div className='px-6 md:px-16 lg:px-32 py-16'>
        <div className='max-w-6xl mx-auto'>
          {/* Header */}
          <div className='flex flex-col items-center mb-12'>
            <div className='flex flex-col items-center pt-12'>
              <p className='text-2xl md:text-3xl font-medium text-gray-500/80'>
                My Profile
              </p>
              <div className='w-16 h-0.5 bg-orange-600 rounded-full mt-2'></div>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-12 justify-items-center'>
            {/* Profile Picture Section */}
            <div className='lg:col-span-1 flex flex-col items-center justify-center min-h-[500px] w-full'>
              <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-8 text-center w-full max-w-sm shadow-lg mx-auto'>
                <div className='flex justify-center items-center mb-8'>
                  <div className='flex justify-center items-center'>
                    <ImageUpload
                      currentImageUrl={profilePhoto}
                      onImageUpload={handlePhotoUpload}
                      size='lg'
                      className='mx-auto'
                      fallbackName={profileData.fullName || 'User'}
                    />
                  </div>
                </div>
                <h3 className='text-xl font-semibold text-gray-300 mb-3'>
                  {profileData.fullName || 'User Name'}
                </h3>
                <p className='text-gray-500/80 mb-6'>
                  {profileData.email || 'user@example.com'}
                </p>
                <div className='text-xs text-gray-500 text-center'>
                  Click or drag to upload photo
                </div>
              </div>

              {/* Quick Actions */}
              <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mt-8 w-full max-w-sm mx-auto'>
                <h4 className='text-lg font-semibold text-gray-300 mb-6 text-center'>
                  Quick Actions
                </h4>
                <div className='space-y-4'>
                  <button
                    onClick={() => router.push('/my-orders')}
                    className='w-full text-left px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors flex items-center gap-3'
                  >
                    <span>📦</span>
                    My Orders
                  </button>
                  <button
                    onClick={() => router.push('/add-address')}
                    className='w-full text-left px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors flex items-center gap-3'
                  >
                    <span>📍</span>
                    Manage Addresses
                  </button>
                  <button className='w-full text-left px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors flex items-center gap-3'>
                    <span>🔒</span>
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Details Form */}
            <div className='lg:col-span-2 flex justify-center'>
              <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 w-full max-w-2xl'>
                <div className='flex justify-between items-center mb-6'>
                  <h3 className='text-xl font-semibold text-gray-300'>
                    Profile Information
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className='bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors'
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className='flex gap-2'>
                      <button
                        onClick={handleCancel}
                        className='bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors'
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSave} className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-gray-400 text-sm font-medium mb-2'>
                        Full Name
                      </label>
                      <input
                        type='text'
                        name='fullName'
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
                      <label className='block text-gray-400 text-sm font-medium mb-2'>
                        Email
                      </label>
                      <input
                        type='email'
                        name='email'
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

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-gray-400 text-sm font-medium mb-2'>
                        Phone Number
                      </label>
                      <input
                        type='tel'
                        name='phoneNumber'
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
                      <label className='block text-gray-400 text-sm font-medium mb-2'>
                        Date of Birth
                      </label>
                      <input
                        type='date'
                        name='dateOfBirth'
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
                    <label className='block text-gray-400 text-sm font-medium mb-2'>
                      Gender
                    </label>
                    <select
                      name='gender'
                      value={profileData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-colors ${
                        isEditing
                          ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-orange-500'
                          : 'bg-gray-800 border-gray-700 text-gray-400'
                      }`}
                    >
                      <option value=''>Select Gender</option>
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                      <option value='other'>Other</option>
                      <option value='prefer-not-to-say'>
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  {/* Address Section */}
                  <div className='pt-4 border-t border-gray-700'>
                    <h4 className='text-lg font-semibold text-gray-300 mb-4'>
                      Address Information
                    </h4>
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-gray-400 text-sm font-medium mb-2'>
                          Area/Street
                        </label>
                        <textarea
                          name='address.area'
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
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div>
                          <label className='block text-gray-400 text-sm font-medium mb-2'>
                            City
                          </label>
                          <input
                            type='text'
                            name='address.city'
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
                          <label className='block text-gray-400 text-sm font-medium mb-2'>
                            State
                          </label>
                          <input
                            type='text'
                            name='address.state'
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
                          <label className='block text-gray-400 text-sm font-medium mb-2'>
                            Pin Code
                          </label>
                          <input
                            type='text'
                            name='address.pincode'
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
