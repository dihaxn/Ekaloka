'use client'
import React, { useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import Footer from '@/components/owner/Footer'

const Settings = () => {
    const { userRole } = useAppContext()
    
    // Store Settings State
    const [storeSettings, setStoreSettings] = useState({
        storeName: 'Dai Fashion',
        storeDescription: 'Premium fashion and lifestyle brand',
        storeEmail: 'contact@daifashion.com',
        storePhone: '+1 (555) 123-4567',
        storeAddress: '123 Fashion Street, Style City, SC 12345',
        currency: 'USD',
        timezone: 'America/New_York',
        language: 'English'
    })

    // Business Settings State
    const [businessSettings, setBusinessSettings] = useState({
        taxRate: 8.5,
        shippingRate: 9.99,
        freeShippingThreshold: 75,
        returnPolicy: 30,
        processingTime: 2,
        lowStockThreshold: 10
    })

    // Notification Settings State
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        orderNotifications: true,
        lowStockAlerts: true,
        customerSignups: false,
        weeklyReports: true,
        monthlyReports: true,
        marketingEmails: false
    })

    // Security Settings State
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        loginAlerts: true,
        sessionTimeout: 60,
        passwordRequirements: 'strong'
    })

    // Appearance Settings State
    const [appearanceSettings, setAppearanceSettings] = useState({
        theme: 'dark',
        primaryColor: 'amber',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: 'US'
    })

    const [activeTab, setActiveTab] = useState('store')
    const [isLoading, setIsLoading] = useState(false)

    const tabs = [
        { id: 'store', label: 'Store Settings', icon: '🏪' },
        { id: 'business', label: 'Business', icon: '💼' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'security', label: 'Security', icon: '🔒' },
        { id: 'appearance', label: 'Appearance', icon: '🎨' }
    ]

    const handleSaveSettings = async (settingsType) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            alert(`${settingsType} settings saved successfully!`)
        } catch (error) {
            alert('Error saving settings. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleStoreSettingsChange = (field, value) => {
        setStoreSettings(prev => ({ ...prev, [field]: value }))
    }

    const handleBusinessSettingsChange = (field, value) => {
        setBusinessSettings(prev => ({ ...prev, [field]: value }))
    }

    const handleNotificationToggle = (field) => {
        setNotificationSettings(prev => ({ ...prev, [field]: !prev[field] }))
    }

    const handleSecuritySettingsChange = (field, value) => {
        setSecuritySettings(prev => ({ ...prev, [field]: value }))
    }

    const handleAppearanceSettingsChange = (field, value) => {
        setAppearanceSettings(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black text-gray-400">
            {/* Main content area */}
            <div className="p-6 space-y-6 animate-fade-in-up">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                        <p className="text-gray-400">Manage your store configuration and preferences</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1">
                            <span className="text-amber-400 text-sm font-medium">Role: {userRole}</span>
                        </div>
                    </div>
                </div>

                {/* Settings Tabs */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg">
                    <div className="border-b border-gray-700/50">
                        <nav className="flex space-x-8 px-6 py-3 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                            : 'text-gray-400 hover:text-amber-400 hover:bg-gray-700/50'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Store Settings Tab */}
                        {activeTab === 'store' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white">Store Information</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Store Name</label>
                                        <input
                                            type="text"
                                            value={storeSettings.storeName}
                                            onChange={(e) => handleStoreSettingsChange('storeName', e.target.value)}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Store Email</label>
                                        <input
                                            type="email"
                                            value={storeSettings.storeEmail}
                                            onChange={(e) => handleStoreSettingsChange('storeEmail', e.target.value)}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Store Phone</label>
                                        <input
                                            type="tel"
                                            value={storeSettings.storePhone}
                                            onChange={(e) => handleStoreSettingsChange('storePhone', e.target.value)}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                                        <select
                                            value={storeSettings.currency}
                                            onChange={(e) => handleStoreSettingsChange('currency', e.target.value)}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        >
                                            <option value="USD">USD - US Dollar</option>
                                            <option value="EUR">EUR - Euro</option>
                                            <option value="GBP">GBP - British Pound</option>
                                            <option value="CAD">CAD - Canadian Dollar</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Store Description</label>
                                    <textarea
                                        rows={3}
                                        value={storeSettings.storeDescription}
                                        onChange={(e) => handleStoreSettingsChange('storeDescription', e.target.value)}
                                        className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Store Address</label>
                                    <textarea
                                        rows={2}
                                        value={storeSettings.storeAddress}
                                        onChange={(e) => handleStoreSettingsChange('storeAddress', e.target.value)}
                                        className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                    />
                                </div>

                                <button
                                    onClick={() => handleSaveSettings('Store')}
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30"
                                >
                                    {isLoading ? 'Saving...' : 'Save Store Settings'}
                                </button>
                            </div>
                        )}

                        {/* Business Settings Tab */}
                        {activeTab === 'business' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white">Business Configuration</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Tax Rate (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={businessSettings.taxRate}
                                            onChange={(e) => handleBusinessSettingsChange('taxRate', parseFloat(e.target.value))}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Shipping Rate ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={businessSettings.shippingRate}
                                            onChange={(e) => handleBusinessSettingsChange('shippingRate', parseFloat(e.target.value))}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Free Shipping Threshold ($)</label>
                                        <input
                                            type="number"
                                            value={businessSettings.freeShippingThreshold}
                                            onChange={(e) => handleBusinessSettingsChange('freeShippingThreshold', parseInt(e.target.value))}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Return Policy (days)</label>
                                        <input
                                            type="number"
                                            value={businessSettings.returnPolicy}
                                            onChange={(e) => handleBusinessSettingsChange('returnPolicy', parseInt(e.target.value))}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Processing Time (days)</label>
                                        <input
                                            type="number"
                                            value={businessSettings.processingTime}
                                            onChange={(e) => handleBusinessSettingsChange('processingTime', parseInt(e.target.value))}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Low Stock Threshold</label>
                                        <input
                                            type="number"
                                            value={businessSettings.lowStockThreshold}
                                            onChange={(e) => handleBusinessSettingsChange('lowStockThreshold', parseInt(e.target.value))}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSaveSettings('Business')}
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30"
                                >
                                    {isLoading ? 'Saving...' : 'Save Business Settings'}
                                </button>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white">Notification Preferences</h3>
                                
                                <div className="space-y-4">
                                    {Object.entries(notificationSettings).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                                            <div>
                                                <h4 className="text-white font-medium capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </h4>
                                                <p className="text-gray-400 text-sm">
                                                    {key === 'emailNotifications' && 'Receive email notifications for important events'}
                                                    {key === 'orderNotifications' && 'Get notified when new orders are placed'}
                                                    {key === 'lowStockAlerts' && 'Alert when product inventory is low'}
                                                    {key === 'customerSignups' && 'Notification for new customer registrations'}
                                                    {key === 'weeklyReports' && 'Receive weekly performance reports'}
                                                    {key === 'monthlyReports' && 'Receive monthly business summaries'}
                                                    {key === 'marketingEmails' && 'Marketing and promotional emails'}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleNotificationToggle(key)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    value ? 'bg-amber-500' : 'bg-gray-600'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        value ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleSaveSettings('Notification')}
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30"
                                >
                                    {isLoading ? 'Saving...' : 'Save Notification Settings'}
                                </button>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white">Security Settings</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                                        <div>
                                            <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                                            <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                                        </div>
                                        <button
                                            onClick={() => handleSecuritySettingsChange('twoFactorAuth', !securitySettings.twoFactorAuth)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                securitySettings.twoFactorAuth ? 'bg-amber-500' : 'bg-gray-600'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                                        <div>
                                            <h4 className="text-white font-medium">Login Alerts</h4>
                                            <p className="text-gray-400 text-sm">Get notified of new login attempts</p>
                                        </div>
                                        <button
                                            onClick={() => handleSecuritySettingsChange('loginAlerts', !securitySettings.loginAlerts)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                securitySettings.loginAlerts ? 'bg-amber-500' : 'bg-gray-600'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    securitySettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="p-4 bg-gray-900/50 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
                                        <select
                                            value={securitySettings.sessionTimeout}
                                            onChange={(e) => handleSecuritySettingsChange('sessionTimeout', parseInt(e.target.value))}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-800 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        >
                                            <option value={30}>30 minutes</option>
                                            <option value={60}>1 hour</option>
                                            <option value={120}>2 hours</option>
                                            <option value={480}>8 hours</option>
                                            <option value={0}>Never</option>
                                        </select>
                                    </div>

                                    <div className="p-4 bg-gray-900/50 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Password Requirements</label>
                                        <select
                                            value={securitySettings.passwordRequirements}
                                            onChange={(e) => handleSecuritySettingsChange('passwordRequirements', e.target.value)}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-800 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        >
                                            <option value="basic">Basic (8+ characters)</option>
                                            <option value="strong">Strong (8+ chars, mixed case, numbers)</option>
                                            <option value="very_strong">Very Strong (12+ chars, mixed case, numbers, symbols)</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSaveSettings('Security')}
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30"
                                >
                                    {isLoading ? 'Saving...' : 'Save Security Settings'}
                                </button>
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white">Appearance & Display</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                                        <select
                                            value={appearanceSettings.theme}
                                            onChange={(e) => handleAppearanceSettingsChange('theme', e.target.value)}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        >
                                            <option value="dark">Dark Theme</option>
                                            <option value="light">Light Theme</option>
                                            <option value="auto">Auto (System)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
                                        <select
                                            value={appearanceSettings.primaryColor}
                                            onChange={(e) => handleAppearanceSettingsChange('primaryColor', e.target.value)}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        >
                                            <option value="amber">Amber</option>
                                            <option value="blue">Blue</option>
                                            <option value="green">Green</option>
                                            <option value="purple">Purple</option>
                                            <option value="red">Red</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Date Format</label>
                                        <select
                                            value={appearanceSettings.dateFormat}
                                            onChange={(e) => handleAppearanceSettingsChange('dateFormat', e.target.value)}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        >
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Number Format</label>
                                        <select
                                            value={appearanceSettings.numberFormat}
                                            onChange={(e) => handleAppearanceSettingsChange('numberFormat', e.target.value)}
                                            className="w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                                        >
                                            <option value="US">US (1,234.56)</option>
                                            <option value="EU">EU (1.234,56)</option>
                                            <option value="IN">IN (1,23,456.78)</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSaveSettings('Appearance')}
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30"
                                >
                                    {isLoading ? 'Saving...' : 'Save Appearance Settings'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Settings
