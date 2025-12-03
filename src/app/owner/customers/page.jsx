'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import Footer from '@/components/owner/Footer';
import { useAppContext } from '@/context/AppContext';

const CustomerManagement = () => {
  const { currency } = useAppContext();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock customer data
  const mockCustomers = [
    {
      id: 'CUST-001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      avatar: '/images/profile-photos/profile_1756194622298.jpg',
      segment: 'VIP',
      totalOrders: 12,
      totalSpent: 2450,
      averageOrderValue: 204,
      lastOrderDate: '2024-01-15',
      joinDate: '2023-08-15',
      status: 'Active',
      location: 'New York, USA',
      favoriteCategory: 'Fashion',
      loyaltyPoints: 245,
      orders: [
        {
          id: '#ORD-001',
          date: '2024-01-15',
          amount: 249,
          status: 'Delivered',
        },
        {
          id: '#ORD-012',
          date: '2024-01-10',
          amount: 399,
          status: 'Delivered',
        },
        {
          id: '#ORD-025',
          date: '2024-01-05',
          amount: 159,
          status: 'Delivered',
        },
      ],
    },
    {
      id: 'CUST-002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 987-6543',
      avatar: '/images/profile-photos/profile_1756194641621.png',
      segment: 'Regular',
      totalOrders: 8,
      totalSpent: 1680,
      averageOrderValue: 210,
      lastOrderDate: '2024-01-14',
      joinDate: '2023-10-22',
      status: 'Active',
      location: 'Los Angeles, USA',
      favoriteCategory: 'Accessories',
      loyaltyPoints: 168,
      orders: [
        {
          id: '#ORD-002',
          date: '2024-01-14',
          amount: 957,
          status: 'Processing',
        },
        {
          id: '#ORD-018',
          date: '2024-01-08',
          amount: 299,
          status: 'Delivered',
        },
      ],
    },
    {
      id: 'CUST-003',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 (555) 456-7890',
      avatar: '/images/profile-photos/profile_1756194880809.jpg',
      segment: 'Regular',
      totalOrders: 5,
      totalSpent: 895,
      averageOrderValue: 179,
      lastOrderDate: '2024-01-13',
      joinDate: '2023-12-01',
      status: 'Active',
      location: 'Chicago, USA',
      favoriteCategory: 'Clothing',
      loyaltyPoints: 89,
      orders: [
        { id: '#ORD-003', date: '2024-01-13', amount: 159, status: 'Shipped' },
        {
          id: '#ORD-021',
          date: '2024-01-07',
          amount: 329,
          status: 'Delivered',
        },
      ],
    },
    {
      id: 'CUST-004',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1 (555) 321-9876',
      avatar: '/images/profile-photos/profile_1756195075738.jpg',
      segment: 'VIP',
      totalOrders: 15,
      totalSpent: 3250,
      averageOrderValue: 217,
      lastOrderDate: '2024-01-12',
      joinDate: '2023-06-10',
      status: 'Active',
      location: 'Miami, USA',
      favoriteCategory: 'Fashion',
      loyaltyPoints: 325,
      orders: [
        {
          id: '#ORD-004',
          date: '2024-01-12',
          amount: 499,
          status: 'Delivered',
        },
        {
          id: '#ORD-015',
          date: '2024-01-09',
          amount: 279,
          status: 'Delivered',
        },
      ],
    },
    {
      id: 'CUST-005',
      name: 'David Brown',
      email: 'david@example.com',
      phone: '+1 (555) 654-3210',
      avatar: '/images/profile-photos/profile_1756195088808.jpg',
      segment: 'New',
      totalOrders: 2,
      totalSpent: 348,
      averageOrderValue: 174,
      lastOrderDate: '2024-01-11',
      joinDate: '2024-01-05',
      status: 'Active',
      location: 'Seattle, USA',
      favoriteCategory: 'Accessories',
      loyaltyPoints: 35,
      orders: [
        {
          id: '#ORD-005',
          date: '2024-01-11',
          amount: 249,
          status: 'Cancelled',
        },
        { id: '#ORD-029', date: '2024-01-06', amount: 99, status: 'Delivered' },
      ],
    },
    {
      id: 'CUST-006',
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '+1 (555) 789-0123',
      avatar: '/images/profile-photos/profile_1756197025615.jpg',
      segment: 'Regular',
      totalOrders: 7,
      totalSpent: 1420,
      averageOrderValue: 203,
      lastOrderDate: '2024-01-10',
      joinDate: '2023-09-18',
      status: 'Inactive',
      location: 'Boston, USA',
      favoriteCategory: 'Shoes',
      loyaltyPoints: 142,
      orders: [
        {
          id: '#ORD-010',
          date: '2024-01-10',
          amount: 189,
          status: 'Delivered',
        },
        {
          id: '#ORD-022',
          date: '2023-12-28',
          amount: 349,
          status: 'Delivered',
        },
      ],
    },
  ];

  const segments = ['All', 'VIP', 'Regular', 'New'];
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest_spent', label: 'Highest Spent' },
    { value: 'most_orders', label: 'Most Orders' },
    { value: 'name_asc', label: 'Name A-Z' },
    { value: 'name_desc', label: 'Name Z-A' },
  ];

  useEffect(() => {
    setCustomers(mockCustomers);
    setFilteredCustomers(mockCustomers);
  }, []);

  useEffect(() => {
    let filtered = customers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        customer =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Segment filter
    if (segmentFilter !== 'All') {
      filtered = filtered.filter(
        customer => customer.segment === segmentFilter
      );
    }

    // Sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort(
          (a, b) => new Date(b.lastOrderDate) - new Date(a.lastOrderDate)
        );
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate));
        break;
      case 'highest_spent':
        filtered.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
      case 'most_orders':
        filtered.sort((a, b) => b.totalOrders - a.totalOrders);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, segmentFilter, sortBy, customers]);

  const getSegmentColor = segment => {
    switch (segment) {
      case 'VIP':
        return 'text-amber-400 bg-amber-500/20';
      case 'Regular':
        return 'text-blue-400 bg-blue-500/20';
      case 'New':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Active':
        return 'text-green-400 bg-green-500/20';
      case 'Inactive':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const handleViewCustomer = customer => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const handleContactCustomer = customer => {
    window.open(`mailto:${customer.email}`);
  };

  const getCustomerStats = () => {
    const stats = {
      total: customers.length,
      vip: customers.filter(c => c.segment === 'VIP').length,
      regular: customers.filter(c => c.segment === 'Regular').length,
      new: customers.filter(c => c.segment === 'New').length,
      active: customers.filter(c => c.status === 'Active').length,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
      averageOrderValue:
        customers.reduce((sum, c) => sum + c.averageOrderValue, 0) /
        customers.length,
    };
    return stats;
  };

  const stats = getCustomerStats();

  return (
    <div className='flex-1 min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black text-gray-400'>
      {/* Main content area */}
      <div className='p-6 space-y-6 animate-fade-in-up'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>
              Customer Management
            </h1>
            <p className='text-gray-400'>
              Manage and analyze your customer base
            </p>
          </div>
          <button className='mt-4 sm:mt-0 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30'>
            Export Customer Data
          </button>
        </div>

        {/* Customer Statistics */}
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4'>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Total Customers</p>
            <p className='text-2xl font-bold text-white'>{stats.total}</p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>VIP Customers</p>
            <p className='text-2xl font-bold text-amber-400'>{stats.vip}</p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Regular</p>
            <p className='text-2xl font-bold text-blue-400'>{stats.regular}</p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>New</p>
            <p className='text-2xl font-bold text-green-400'>{stats.new}</p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Active</p>
            <p className='text-2xl font-bold text-green-400'>{stats.active}</p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Total Revenue</p>
            <p className='text-2xl font-bold text-amber-400'>
              {currency}
              {stats.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Avg AOV</p>
            <p className='text-2xl font-bold text-purple-400'>
              {currency}
              {Math.round(stats.averageOrderValue)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Search */}
            <div>
              <input
                type='text'
                placeholder='Search customers by name, email, or ID...'
                className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Segment Filter */}
            <div>
              <select
                className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
                value={segmentFilter}
                onChange={e => setSegmentFilter(e.target.value)}
              >
                {segments.map(segment => (
                  <option key={segment} value={segment}>
                    {segment} Customers
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-6'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-700/50'>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Customer
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Segment
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Orders
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Total Spent
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    AOV
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Last Order
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Status
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr
                    key={customer.id}
                    className='border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors'
                  >
                    <td className='py-3 px-4'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-10 h-10 bg-gray-700 rounded-full overflow-hidden'>
                          <Image
                            src={customer.avatar}
                            alt={customer.name}
                            width={40}
                            height={40}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div>
                          <p className='text-white font-medium'>
                            {customer.name}
                          </p>
                          <p className='text-gray-400 text-sm'>
                            {customer.email}
                          </p>
                          <p className='text-gray-500 text-xs'>{customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className='py-3 px-4'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSegmentColor(customer.segment)}`}
                      >
                        {customer.segment}
                      </span>
                    </td>
                    <td className='py-3 px-4 text-gray-300'>
                      {customer.totalOrders}
                    </td>
                    <td className='py-3 px-4'>
                      <span className='text-white font-medium'>
                        {currency}
                        {customer.totalSpent.toLocaleString()}
                      </span>
                    </td>
                    <td className='py-3 px-4 text-gray-300'>
                      {currency}
                      {customer.averageOrderValue}
                    </td>
                    <td className='py-3 px-4 text-gray-300'>
                      {new Date(customer.lastOrderDate).toLocaleDateString()}
                    </td>
                    <td className='py-3 px-4'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className='py-3 px-4'>
                      <div className='flex space-x-2'>
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className='text-blue-400 hover:text-blue-300 p-1'
                          title='View Details'
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleContactCustomer(customer)}
                          className='text-green-400 hover:text-green-300 p-1'
                          title='Contact Customer'
                        >
                          📧
                        </button>
                        <button
                          className='text-amber-400 hover:text-amber-300 p-1'
                          title='View Orders'
                        >
                          📦
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCustomers.length === 0 && (
              <div className='text-center py-8'>
                <p className='text-gray-400'>
                  No customers found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showDetailsModal && selectedCustomer && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              {/* Modal Header */}
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-white'>
                  Customer Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className='text-gray-400 hover:text-white'
                >
                  ✕
                </button>
              </div>

              {/* Customer Info */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                <div className='space-y-4'>
                  <div className='flex items-center space-x-4'>
                    <div className='w-16 h-16 bg-gray-700 rounded-full overflow-hidden'>
                      <Image
                        src={selectedCustomer.avatar}
                        alt={selectedCustomer.name}
                        width={64}
                        height={64}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div>
                      <h3 className='text-xl font-bold text-white'>
                        {selectedCustomer.name}
                      </h3>
                      <p className='text-gray-400'>{selectedCustomer.email}</p>
                      <p className='text-gray-500'>{selectedCustomer.phone}</p>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Customer ID:</span>
                      <span className='text-white'>{selectedCustomer.id}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Location:</span>
                      <span className='text-white'>
                        {selectedCustomer.location}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Joined:</span>
                      <span className='text-white'>
                        {new Date(
                          selectedCustomer.joinDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Favorite Category:</span>
                      <span className='text-white'>
                        {selectedCustomer.favoriteCategory}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='bg-gray-900/50 rounded-lg p-4'>
                    <h4 className='text-lg font-bold text-white mb-2'>
                      Purchase Summary
                    </h4>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Total Orders:</span>
                        <span className='text-white font-medium'>
                          {selectedCustomer.totalOrders}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Total Spent:</span>
                        <span className='text-white font-medium'>
                          {currency}
                          {selectedCustomer.totalSpent.toLocaleString()}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Average Order:</span>
                        <span className='text-white font-medium'>
                          {currency}
                          {selectedCustomer.averageOrderValue}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Loyalty Points:</span>
                        <span className='text-amber-400 font-medium'>
                          {selectedCustomer.loyaltyPoints}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex space-x-2'>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getSegmentColor(selectedCustomer.segment)}`}
                    >
                      {selectedCustomer.segment}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCustomer.status)}`}
                    >
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <h4 className='text-lg font-bold text-white mb-4'>
                  Recent Orders
                </h4>
                <div className='space-y-2'>
                  {selectedCustomer.orders.map((order, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center p-3 bg-gray-900/50 rounded-lg'
                    >
                      <div>
                        <p className='text-white font-medium'>{order.id}</p>
                        <p className='text-gray-400 text-sm'>
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-white font-medium'>
                          {currency}
                          {order.amount}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'Delivered'
                              ? 'bg-green-500/20 text-green-400'
                              : order.status === 'Processing'
                                ? 'bg-blue-500/20 text-blue-400'
                                : order.status === 'Shipped'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CustomerManagement;
