'use client';
import React, { useEffect, useState } from 'react';

import Footer from '@/components/owner/Footer';
import { useAppContext } from '@/context/AppContext';

const OrderManagement = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock orders data
  const mockOrders = [
    {
      id: '#ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      products: [
        { name: 'Premium Fashion Collection', quantity: 1, price: 249 },
      ],
      total: 249,
      status: 'Pending',
      date: '2024-01-15',
      address: '123 Fashion St, Style City, SC 12345',
    },
    {
      id: '#ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      products: [
        { name: 'Designer Fashion Set', quantity: 2, price: 399 },
        { name: 'Lifestyle Accessories', quantity: 1, price: 159 },
      ],
      total: 957,
      status: 'Processing',
      date: '2024-01-14',
      address: '456 Trend Ave, Fashion Town, FT 67890',
    },
    {
      id: '#ORD-003',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      products: [{ name: 'Lifestyle Fashion Bundle', quantity: 1, price: 159 }],
      total: 159,
      status: 'Shipped',
      date: '2024-01-13',
      address: '789 Style Blvd, Chic City, CC 54321',
    },
    {
      id: '#ORD-004',
      customer: 'Sarah Wilson',
      email: 'sarah@example.com',
      products: [{ name: 'Elegant Evening Wear', quantity: 1, price: 499 }],
      total: 499,
      status: 'Delivered',
      date: '2024-01-12',
      address: '321 Glamour Rd, Beauty Borough, BB 98765',
    },
    {
      id: '#ORD-005',
      customer: 'David Brown',
      email: 'david@example.com',
      products: [
        { name: 'Premium Fashion Collection', quantity: 1, price: 249 },
      ],
      total: 249,
      status: 'Cancelled',
      date: '2024-01-11',
      address: '654 Modern St, Contemporary City, MC 13579',
    },
  ];

  const statusOptions = [
    'All',
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  useEffect(() => {
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        order =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const getStatusColor = status => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'Processing':
        return 'text-blue-400 bg-blue-500/20';
      case 'Shipped':
        return 'text-purple-400 bg-purple-500/20';
      case 'Delivered':
        return 'text-green-400 bg-green-500/20';
      case 'Cancelled':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleViewOrder = orderId => {
    console.log('View order details:', orderId);
    // Open order details modal or navigate to order details page
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'Pending').length,
      processing: orders.filter(o => o.status === 'Processing').length,
      shipped: orders.filter(o => o.status === 'Shipped').length,
      delivered: orders.filter(o => o.status === 'Delivered').length,
      cancelled: orders.filter(o => o.status === 'Cancelled').length,
      totalRevenue: orders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + o.total, 0),
    };
    return stats;
  };

  const stats = getOrderStats();

  return (
    <div className='flex-1 min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black text-gray-400'>
      {/* Main content area */}
      <div className='p-6 space-y-6 animate-fade-in-up'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>
              Order Management
            </h1>
            <p className='text-gray-400'>
              Track and manage all customer orders
            </p>
          </div>
        </div>

        {/* Order Statistics */}
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4'>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Total Orders</p>
            <p className='text-2xl font-bold text-white'>{stats.total}</p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Pending</p>
            <p className='text-2xl font-bold text-yellow-400'>
              {stats.pending}
            </p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Processing</p>
            <p className='text-2xl font-bold text-blue-400'>
              {stats.processing}
            </p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Shipped</p>
            <p className='text-2xl font-bold text-purple-400'>
              {stats.shipped}
            </p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Delivered</p>
            <p className='text-2xl font-bold text-green-400'>
              {stats.delivered}
            </p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Cancelled</p>
            <p className='text-2xl font-bold text-red-400'>{stats.cancelled}</p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Revenue</p>
            <p className='text-2xl font-bold text-amber-400'>
              {currency}
              {stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            {/* Search */}
            <div className='flex-1'>
              <input
                type='text'
                placeholder='Search orders by ID, customer name, or email...'
                className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className='md:w-48'>
              <select
                className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-6'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-700/50'>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Order ID
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Customer
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Products
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Total
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Date
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
                {filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    className='border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors'
                  >
                    <td className='py-3 px-4'>
                      <p className='text-white font-medium'>{order.id}</p>
                    </td>
                    <td className='py-3 px-4'>
                      <div>
                        <p className='text-white font-medium'>
                          {order.customer}
                        </p>
                        <p className='text-gray-400 text-sm'>{order.email}</p>
                      </div>
                    </td>
                    <td className='py-3 px-4'>
                      <div>
                        {order.products.map((product, index) => (
                          <p key={index} className='text-gray-300 text-sm'>
                            {product.name} (x{product.quantity})
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className='py-3 px-4'>
                      <p className='text-white font-medium'>
                        {currency}
                        {order.total}
                      </p>
                    </td>
                    <td className='py-3 px-4'>
                      <p className='text-gray-300'>{order.date}</p>
                    </td>
                    <td className='py-3 px-4'>
                      <select
                        value={order.status}
                        onChange={e =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`px-2 py-1 rounded-full text-xs font-medium border-none outline-none ${getStatusColor(order.status)}`}
                      >
                        {statusOptions
                          .filter(s => s !== 'All')
                          .map(status => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className='py-3 px-4'>
                      <div className='flex space-x-2'>
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className='text-blue-400 hover:text-blue-300 p-1'
                          title='View Details'
                        >
                          👁️
                        </button>
                        <button
                          className='text-green-400 hover:text-green-300 p-1'
                          title='Print Invoice'
                        >
                          🖨️
                        </button>
                        <button
                          className='text-amber-400 hover:text-amber-300 p-1'
                          title='Contact Customer'
                        >
                          📧
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className='text-center py-8'>
                <p className='text-gray-400'>
                  No orders found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderManagement;
