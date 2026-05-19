import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Eye, Edit2, LogOut, Users, DollarSign, Mail, Lock } from 'lucide-react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';

export default function FirebaseAdminPanel({ onClose }) {
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
  
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Check if user is logged in
  useEffect(() => {
    if (!auth) {
      setIsAuthenticated(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsAuthenticated(!!user);
      if (user) {
        loadUsersAndPricing();
      }
    });
    return unsubscribe;
  }, []);

  // Load users and pricing from Firestore
  const loadUsersAndPricing = async () => {
    if (!db) {
      return;
    }

    try {
      // Load users
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);

      // Load pricing
      const pricingDoc = await getDocs(collection(db, 'pricing'));
      if (pricingDoc.size > 0) {
        setPricing(pricingDoc.docs[0].data());
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    if (!auth) {
      setLoginError('Firebase is not configured. Set the VITE_FIREBASE_* environment variables first.');
      setIsLoggingIn(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    if (!auth) {
      onClose();
      return;
    }

    try {
      await signOut(auth);
      setIsAuthenticated(false);
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle user status update
  const handleStatusUpdate = async (userId, newStatus) => {
    if (!db) {
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { status: newStatus });
      loadUsersAndPricing();
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!db) {
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        loadUsersAndPricing();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
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

  // Save pricing to Firestore
  const handleSavePricing = async () => {
    if (!db) {
      return;
    }

    setIsSavingPricing(true);
    try {
      const pricingRef = doc(db, 'pricing', 'default');
      await setDoc(pricingRef, pricing, { merge: true });
      setPriceChanged(false);
    } catch (error) {
      console.error('Error saving pricing:', error);
    } finally {
      setIsSavingPricing(false);
    }
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

  // Login UI
  if (!isAuthenticated) {
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
          className="bg-[#0d0d0d] border border-white/10 w-full max-w-md"
        >
          {/* Header */}
          <div className="bg-[#111] border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <h2 className="font-bebas text-2xl tracking-wider text-white">ADMIN LOGIN</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X size={24} />
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {!isFirebaseConfigured && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm rounded">
                Firebase is not configured yet. Add the VITE_FIREBASE_* values to a .env file to enable admin login.
              </div>
            )}

            <div>
              <label className="block text-sm font-barlow text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@getfit.com"
                  className="w-full bg-[#111] border border-white/10 text-white pl-10 pr-4 py-3
                             focus:outline-none focus:border-[#ff1a1a]/60 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-barlow text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111] border border-white/10 text-white pl-10 pr-4 py-3
                             focus:outline-none focus:border-[#ff1a1a]/60 transition-colors"
                  required
                />
              </div>
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded"
              >
                {loginError}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoggingIn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#ff1a1a] text-white font-barlow font-bold tracking-widest text-sm px-5 py-3 uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>

          <div className="border-t border-white/5 bg-[#111] px-6 py-4 text-center text-xs text-gray-500">
            Use your Firebase admin credentials to login
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Main Admin Panel (after login)
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
                                {(user.status || 'pending').toUpperCase()}
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
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors font-barlow font-semibold tracking-wider text-sm py-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

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
                    <span className="text-gray-500 text-xs font-barlow">Email</span>
                    <p className="text-white">{showUserDetail.email}</p>
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
                    <span className="text-gray-500 text-xs font-barlow">Category</span>
                    <p className="text-white">{showUserDetail.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs font-barlow">Training Type</span>
                    <p className="text-white">{showUserDetail.trainingType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs font-barlow">Package Duration</span>
                    <p className="text-white">{showUserDetail.packageDuration}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs font-barlow">Preferred Time Slot</span>
                    <p className="text-white">{showUserDetail.preferredTime}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs font-barlow">Payment Mode</span>
                    <p className="text-white">{showUserDetail.paymentMode}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs font-barlow">Status</span>
                    <p className="text-white font-semibold">{(showUserDetail.status || 'pending').toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs font-barlow">Joined Date</span>
                    <p className="text-white">{new Date(showUserDetail.joinedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
