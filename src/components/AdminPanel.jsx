import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Eye, Edit2, LogOut, Users, DollarSign } from 'lucide-react';

export default function AdminPanel({ onClose }) {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [pricing, setPricing] = useState({
    monthly: 1000,
    quarterly: 2500,
    biannual: 4500,
    yearly: 8000,
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(null);
  const [isSavingPricing, setIsSavingPricing] = useState(false);
  const [priceChanged, setPriceChanged] = useState(false);

  // Load users and pricing from localStorage
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('joinedUsers') || '[]');
    setUsers(savedUsers);

    const savedPricing = localStorage.getItem('pricing');
    if (savedPricing) {
      setPricing(JSON.parse(savedPricing));
    }
  }, []);

  // Handle user status update
  const handleStatusUpdate = (userId, newStatus) => {
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, status: newStatus } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('joinedUsers', JSON.stringify(updatedUsers));
    setEditingUser(null);
  };

  // Handle user deletion
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('joinedUsers', JSON.stringify(updatedUsers));
    }
  };

  // Handle pricing update
  const handlePricingChange = (key, value) => {
    setPricing(prev => ({
      ...prev,
      [key]: parseInt(value) || 0
    }));
    setPriceChanged(true);
  };

  const handleSavePricing = () => {
    setIsSavingPricing(true);
    localStorage.setItem('pricing', JSON.stringify(pricing));
    setTimeout(() => {
      setIsSavingPricing(false);
      setPriceChanged(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'inactive':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getDobAge = (dateOfBirth) => {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#0d0d0d] border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#111] border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bebas text-2xl tracking-wider text-white">ADMIN PANEL</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 bg-[#111]">
          <button
            onClick={() => setTab('users')}
            className={`flex items-center gap-2 px-6 py-4 font-barlow font-semibold tracking-wider text-sm transition-all ${
              tab === 'users'
                ? 'bg-[#ff1a1a] text-white border-b-2 border-[#ff1a1a]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users size={18} />
            Users ({users.length})
          </button>
          <button
            onClick={() => setTab('pricing')}
            className={`flex items-center gap-2 px-6 py-4 font-barlow font-semibold tracking-wider text-sm transition-all ${
              tab === 'pricing'
                ? 'bg-[#ff1a1a] text-white border-b-2 border-[#ff1a1a]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <DollarSign size={18} />
            Pricing
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {tab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📝</div>
                    <p className="text-gray-400">No users joined yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {users.map((user, idx) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-[#111] border border-white/10 p-4 rounded hover:border-white/20 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bebas text-lg text-white tracking-wide">
                                {user.fullName}
                              </h3>
                              <span className={`text-xs font-barlow font-bold px-3 py-1 rounded border ${getStatusColor(user.status)}`}>
                                {user.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-2">
                              <div>
                                <span className="text-gray-500 text-xs">Phone</span>
                                <p className="text-white">{user.phone}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs">Gender</span>
                                <p className="text-white">{user.gender}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs">Age</span>
                                <p className="text-white">{getDobAge(user.dateOfBirth)} years</p>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs">Package</span>
                                <p className="text-white">{user.packageDuration}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs">Category</span>
                                <p className="text-white">{user.category}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs">Training</span>
                                <p className="text-white">{user.trainingType}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs">Time Slot</span>
                                <p className="text-white">{user.preferredTime}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs">Payment</span>
                                <p className="text-white">{user.paymentMode}</p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              Joined: {new Date(user.joinedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowUserDetail(user)}
                              className="p-2 text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded transition-colors"
                              title="Edit Status"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                              title="Delete User"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Edit Status Modal */}
                        <AnimatePresence>
                          {editingUser?.id === user.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-4 pt-4 border-t border-white/10"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">Update Status:</span>
                                {['pending', 'active', 'inactive'].map(status => (
                                  <button
                                    key={status}
                                    onClick={() => handleStatusUpdate(user.id, status)}
                                    className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                                      user.status === status
                                        ? 'bg-[#ff1a1a] text-white'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                                  >
                                    {status.toUpperCase()}
                                  </button>
                                ))}
                                <button
                                  onClick={() => setEditingUser(null)}
                                  className="ml-auto text-xs text-gray-500 hover:text-white"
                                >
                                  Cancel
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'pricing' && (
              <motion.div
                key="pricing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <h3 className="font-bebas text-xl tracking-wider text-white mb-6">PACKAGE PRICING</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'monthly', label: 'Monthly' },
                    { key: 'quarterly', label: '3 Months' },
                    { key: 'biannual', label: '6 Months' },
                    { key: 'yearly', label: 'Yearly' },
                  ].map(pkg => (
                    <div key={pkg.key} className="bg-[#111] border border-white/10 p-6 rounded">
                      <label className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase block mb-3">
                        {pkg.label} Price
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-gray-400">₹</span>
                        <input
                          type="number"
                          value={pricing[pkg.key]}
                          onChange={(e) => handlePricingChange(pkg.key, e.target.value)}
                          className="flex-1 bg-[#0a0a0a] border border-white/10 text-white font-inter text-lg px-4 py-3
                                     focus:outline-none focus:border-[#ff1a1a]/60 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {priceChanged && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm rounded"
                  >
                    You have unsaved changes
                  </motion.div>
                )}

                <motion.button
                  onClick={handleSavePricing}
                  disabled={!priceChanged || isSavingPricing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full bg-[#ff1a1a] text-white font-barlow font-bold tracking-widest text-sm px-5 py-4 uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSavingPricing ? 'Saving...' : 'Save Pricing'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout Button */}
        <div className="border-t border-white/5 bg-[#111] px-6 py-4">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors font-barlow font-semibold tracking-wider text-sm py-2"
          >
            <LogOut size={18} />
            Close Admin Panel
          </button>
        </div>
      </motion.div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {showUserDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUserDetail(null)}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0d0d0d] border border-white/10 max-w-md w-full max-h-[80vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bebas text-2xl tracking-wider text-white">USER DETAILS</h3>
                <button
                  onClick={() => setShowUserDetail(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-gray-500 text-xs font-barlow">Full Name</span>
                  <p className="text-white font-semibold">{showUserDetail.fullName}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-barlow">Phone</span>
                  <p className="text-white">{showUserDetail.phone}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-barlow">Gender</span>
                  <p className="text-white">{showUserDetail.gender}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-barlow">Date of Birth</span>
                  <p className="text-white">{new Date(showUserDetail.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-barlow">Age</span>
                  <p className="text-white">{getDobAge(showUserDetail.dateOfBirth)} years</p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <span className="text-gray-500 text-xs font-barlow">Package Duration</span>
                  <p className="text-white">{showUserDetail.packageDuration}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-barlow">Category</span>
                  <p className="text-white">{showUserDetail.category}</p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <span className="text-gray-500 text-xs font-barlow">Training Type</span>
                  <p className="text-white">{showUserDetail.trainingType}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-barlow">Preferred Time</span>
                  <p className="text-white">{showUserDetail.preferredTime}</p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <span className="text-gray-500 text-xs font-barlow">Payment Mode</span>
                  <p className="text-white">{showUserDetail.paymentMode}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-barlow">Status</span>
                  <p className={`text-sm font-bold px-3 py-1 rounded border inline-block ${getStatusColor(showUserDetail.status)}`}>
                    {showUserDetail.status.toUpperCase()}
                  </p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <span className="text-gray-500 text-xs font-barlow">Joined Date</span>
                  <p className="text-white">{new Date(showUserDetail.joinedAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-barlow">Agreed to Terms</span>
                  <p className="text-green-500 font-semibold">✓ Yes</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
