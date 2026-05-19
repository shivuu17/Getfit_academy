import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Eye, Edit2, LogOut, Users, DollarSign, Mail, Lock, UserPlus, Menu } from 'lucide-react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getDoc, updateDoc, deleteDoc, doc, setDoc, addDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';

const normalizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : '');
const BOOTSTRAP_ADMIN_EMAIL = (import.meta.env.VITE_BOOTSTRAP_ADMIN_EMAIL || 'katiyarshivank927@gmail.com').trim().toLowerCase();

export default function FirebaseAdminPanel({ onClose }) {
  const [activePage, setActivePage] = useState('overview');
  const [users, setUsers] = useState([]);
  const [pricing, setPricing] = useState({
    monthly: 1000,
    quarterly: 2500,
    biannual: 4500,
    yearly: 8000,
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(null);
  const [showNewMemberForm, setShowNewMemberForm] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [newMemberError, setNewMemberError] = useState('');
  const [isCreatingMember, setIsCreatingMember] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    category: '',
    trainingType: '',
    packageDuration: '',
    preferredTime: '',
    paymentMode: '',
    status: '',
    lastPaymentDate: new Date().toISOString().slice(0,10),
    lastPaymentAmount: null,
    nextPaymentDate: null,
    nextPaymentAmount: null,
    paymentStatus: 'Paid',
  });

  const todayIso = new Date().toISOString().slice(0, 10);
  const [isSavingPricing, setIsSavingPricing] = useState(false);
  const [priceChanged, setPriceChanged] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (!auth) {
      setIsAuthenticated(false);
      setIsCheckingAccess(false);
      return undefined;
    }

    let isActive = true;

    const verifyAdminAccess = async (user) => {
      if (!db) {
        if (isActive) {
          setLoginError('Firebase is not configured. Set the VITE_FIREBASE_* environment variables first.');
          setIsAuthenticated(false);
          setIsCheckingAccess(false);
        }
        return;
      }

      try {
        const allowedAdminsDoc = await getDoc(doc(db, 'admins', 'allowed'));
        const allowedEmails = Array.isArray(allowedAdminsDoc.data()?.emails)
          ? allowedAdminsDoc.data().emails.map(normalizeEmail).filter(Boolean)
          : [];
        const userEmail = normalizeEmail(user?.email);
        const isBootstrapAdmin = userEmail === BOOTSTRAP_ADMIN_EMAIL;

        if (isBootstrapAdmin && allowedEmails.length === 0) {
          await setDoc(doc(db, 'admins', 'allowed'), {
            emails: [BOOTSTRAP_ADMIN_EMAIL],
          }, { merge: true });

          await setDoc(doc(db, 'pricing', 'default'), pricing, { merge: true });

          if (isActive) {
            setLoginError('');
            setIsAuthenticated(true);
            loadUsersAndPricing();
          }
          return;
        }

        if (!userEmail || !allowedEmails.includes(userEmail)) {
          if (isActive) {
            setLoginError('This email is not authorized to access the admin panel.');
            setIsAuthenticated(false);
          }
          await signOut(auth);
          return;
        }

        if (isActive) {
          setLoginError('');
          setIsAuthenticated(true);
          await setDoc(doc(db, 'pricing', 'default'), pricing, { merge: true });
          loadUsersAndPricing();
        }
      } catch (error) {
        console.error('Error verifying admin access:', error);
        if (isActive) {
          setLoginError('Unable to verify admin access. Check the admins/allowed document.');
          setIsAuthenticated(false);
        }

        try {
          await signOut(auth);
        } catch (signOutError) {
          console.error('Logout error after failed admin check:', signOutError);
        }
      } finally {
        if (isActive) {
          setIsCheckingAccess(false);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user) {
        if (isActive) {
          setIsAuthenticated(false);
          setIsCheckingAccess(false);
        }
        return;
      }

      setIsCheckingAccess(true);
      verifyAdminAccess(user);
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
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
      // Load payments if accessible, but do not block the admin list when payments are missing
      let paymentsList = [];
      try {
        const paymentsSnapshot = await getDocs(collection(db, 'payments'));
        paymentsList = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (paymentsError) {
        console.warn('Payments collection not readable yet:', paymentsError);
      }

      const paymentsByUser = paymentsList.reduce((acc, p) => {
        if (!acc[p.userId]) acc[p.userId] = [];
        acc[p.userId].push(p);
        return acc;
      }, {});

      const usersWithPayments = usersList.map(user => {
        const paymentsForUser = (paymentsByUser[user.id] || []).sort((a, b) => new Date(b.paidAt || 0) - new Date(a.paidAt || 0));
        const latest = paymentsForUser[0] || null;
        return {
          ...user,
          latestPayment: latest,
          nextPaymentDue: latest?.nextDue || null,
        };
      });

      setUsers(usersWithPayments);

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
      if (typeof error?.message === 'string' && error.message.includes('Firebase SDK is missing')) {
        setLoginError('Firebase package is not installed in this workspace. Run npm install and restart npm run dev.');
      } else {
        setLoginError(error.message);
      }
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
      setIsCheckingAccess(false);
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

  const handleNewMemberChange = (field, value) => {
    setNewMemberForm(prev => ({
      ...prev,
      [field]: value,
    }));
    setNewMemberError('');
  };

  const buildMemberFormFromEnquiry = (enquiry) => ({
    fullName: enquiry.fullName || enquiry.name || '',
    email: enquiry.email || '',
    phone: enquiry.phone || '',
    gender: enquiry.gender || '',
    dateOfBirth: enquiry.dateOfBirth || '',
    category: enquiry.category || '',
    trainingType: enquiry.trainingType || '',
    packageDuration: enquiry.packageDuration || enquiry.package || '',
    preferredTime: enquiry.preferredTime || '',
    paymentMode: enquiry.paymentMode || '',
    status: enquiry.status || 'active',
    lastPaymentDate: enquiry.lastPaymentDate || new Date().toISOString().slice(0, 10),
    lastPaymentAmount: enquiry.lastPaymentAmount ?? null,
    nextPaymentDate: enquiry.nextPaymentDate || enquiry.nextPaymentDue || '',
    nextPaymentAmount: enquiry.nextPaymentAmount ?? null,
    paymentStatus: enquiry.paymentStatus || 'Due',
  });

  const openMemberFormFromEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setNewMemberForm(buildMemberFormFromEnquiry(enquiry));
    setShowNewMemberForm(true);
    setNewMemberError('');
  };

  const handleEnquiryStatusUpdate = async (userId, status) => {
    if (!db) return;

    try {
      await updateDoc(doc(db, 'users', userId), {
        enquiryStatus: status,
        updatedAt: new Date().toISOString(),
      });
      loadUsersAndPricing();
    } catch (error) {
      console.error('Error updating enquiry status:', error);
    }
  };

  const resetNewMemberForm = () => {
    setNewMemberForm({
      fullName: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: '',
      category: '',
      trainingType: '',
      packageDuration: '',
      preferredTime: '',
      paymentMode: '',
      status: '',
      lastPaymentDate: todayIso,
      nextPaymentDate: '',
      paymentStatus: 'Paid',
    });
    setSelectedEnquiry(null);
    setNewMemberError('');
  };

  const isNewMemberFormValid = () => {
    const f = newMemberForm || {};
    const emailOk = typeof f.email === 'string' && /\S+@\S+\.\S+/.test(f.email);
    const phoneOk = typeof f.phone === 'string' && /\d{7,}/.test(f.phone.replace(/\D/g, ''));
    return !!(f.fullName && emailOk && phoneOk && f.dateOfBirth && f.category && f.trainingType && f.packageDuration && f.preferredTime && f.paymentMode);
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();

    if (!db) {
      setNewMemberError('Firebase is not configured.');
      return;
    }

    const fullName = newMemberForm.fullName.trim();
    const email = normalizeEmail(newMemberForm.email);
    const phone = newMemberForm.phone.trim();
    const category = newMemberForm.category.trim();
    const trainingType = newMemberForm.trainingType.trim();
    const preferredTime = newMemberForm.preferredTime.trim();
    const dateOfBirth = newMemberForm.dateOfBirth;
    const packageDuration = newMemberForm.packageDuration.trim();
    const paymentMode = newMemberForm.paymentMode.trim();
    const lastPaymentDate = newMemberForm.lastPaymentDate;
    const nextPaymentDate = newMemberForm.nextPaymentDate;
    const paymentStatus = newMemberForm.paymentStatus;

    if (!fullName || !email || !phone || !category || !trainingType || !preferredTime || !dateOfBirth || !packageDuration || !paymentMode) {
      setNewMemberError('Fill in all required member details before saving.');
      return;
    }

    setIsCreatingMember(true);
    setNewMemberError('');

    try {
      const createdAt = new Date().toISOString();

      // Ensure nextPaymentDate and status are computed
      const computedNext = nextPaymentDate || computeNextDueDate(lastPaymentDate || createdAt, packageDuration);
      const computedStatus = computePaymentStatus(computedNext);

      const lastAmount = computeNextPaymentAmount(packageDuration);
      const createdFromEnquiry = Boolean(selectedEnquiry);
      const memberPayload = {
        name: fullName,
        email,
        phone,
        package: packageDuration,
        category,
        trainingType,
        lastPaymentDate: lastPaymentDate || createdAt,
        lastPaymentAmount: lastAmount,
        nextPaymentDate: computedNext,
        nextPaymentAmount: computeNextPaymentAmount(packageDuration),
        paymentStatus: computedStatus,
        preferredTime,
        paymentMode,
        status: (newMemberForm.status || 'active').toLowerCase(),
        dateOfBirth,
        source: createdFromEnquiry ? 'enquiry-to-member' : 'admin-manual-entry',
        createdAt,
      };

      // Save to `users` first so the admin list always shows the member even if other writes fail
      await addDoc(collection(db, 'users'), {
        fullName,
        email,
        phone,
        gender: newMemberForm.gender,
        dateOfBirth,
        category,
        trainingType,
        packageDuration,
        preferredTime,
        paymentMode,
        status: (newMemberForm.status || 'active').toLowerCase(),
        joinedAt: createdAt,
        source: createdFromEnquiry ? 'enquiry-to-member' : 'admin-manual-entry',
        ...(createdFromEnquiry ? { enquiryStatus: 'joined' } : {}),
        createdAt,
      });

      // Try to save the richer record to `members`; do not block the whole create flow if this write fails
      try {
        await addDoc(collection(db, 'members'), memberPayload);
      } catch (uErr) {
        console.warn('Failed to add to members collection:', uErr);
      }

      setSuccessMessage('Member created successfully');
      setTimeout(() => setSuccessMessage(''), 4000);
      resetNewMemberForm();
      setShowNewMemberForm(false);
      loadUsersAndPricing();
    } catch (error) {
      console.error('Error creating member:', error);
      setNewMemberError(error?.message || 'Unable to save member right now.');
    } finally {
      setIsCreatingMember(false);
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

  // Helpers for payment handling
  const addMonthsSafe = (date, months) => {
    // Preserve day-of-month when possible; if the target month has fewer days, pick the last day.
    const d = new Date(date);
    const day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + months);
    const month = d.getMonth();
    const year = d.getFullYear();
    const daysInTarget = new Date(year, month + 1, 0).getDate();
    d.setDate(Math.min(day, daysInTarget));
    return d;
  };

  const computeNextDueDate = (startIso, packageDuration) => {
    try {
      const start = startIso ? new Date(startIso) : new Date();
      let next;
      switch ((packageDuration || '').toLowerCase()) {
        case 'monthly':
          next = addMonthsSafe(start, 1);
          break;
        case '3 months':
        case '3month':
        case 'quarterly':
          next = addMonthsSafe(start, 3);
          break;
        case '6 months':
        case '6month':
        case 'biannual':
          next = addMonthsSafe(start, 6);
          break;
        case 'yearly':
          next = addMonthsSafe(start, 12);
          break;
        default:
          next = addMonthsSafe(start, 1);
      }
      return next.toISOString();
    } catch (e) {
      console.error('computeNextDueDate error', e);
      return null;
    }
  };

  const computeNextPaymentAmount = (packageDuration) => {
    return getPriceForPackage(packageDuration || 'Monthly');
  };

  const formatDateValue = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString();
  };

  const getNextBillDate = (user) => {
    const explicitNext = user?.nextPaymentDate || user?.nextPaymentDue;
    if (explicitNext) {
      return formatDateValue(explicitNext);
    }

    const baseDate = user?.lastPaymentDate || user?.joinedAt;
    if (!baseDate || !user?.packageDuration) {
      return '—';
    }

    const computed = computeNextDueDate(baseDate, user.packageDuration);
    return formatDateValue(computed);
  };

  const computePaymentStatus = (nextDueIso) => {
    if (!nextDueIso) return 'Due';
    try {
      const now = new Date();
      const next = new Date(nextDueIso);
      if (now > next) return 'Overdue';
      return 'Paid';
    } catch (e) {
      return 'Due';
    }
  };

  // Auto-update nextPaymentDate and paymentStatus when lastPaymentDate or package changes
  useEffect(() => {
    if (!newMemberForm) return;
    const last = newMemberForm.lastPaymentDate || todayIso;
    if (!newMemberForm.packageDuration) {
      setNewMemberForm(prev => ({ ...prev, nextPaymentDate: '', nextPaymentAmount: null, paymentStatus: 'Due' }));
      return;
    }
    const next = computeNextDueDate(last, newMemberForm.packageDuration);
    const status = computePaymentStatus(next);
    setNewMemberForm(prev => ({ ...prev, nextPaymentDate: next, nextPaymentAmount: computeNextPaymentAmount(newMemberForm.packageDuration), paymentStatus: status }));
  }, [newMemberForm?.lastPaymentDate, newMemberForm?.packageDuration]);

  const handleMarkAsPaid = () => {
    if (!newMemberForm.packageDuration) {
      setNewMemberError('Select package duration first');
      return;
    }
    const now = new Date().toISOString().slice(0, 10);
    const next = computeNextDueDate(now, newMemberForm.packageDuration);
    const amt = computeNextPaymentAmount(newMemberForm.packageDuration);
    setNewMemberForm(prev => ({ ...prev, lastPaymentDate: now, lastPaymentAmount: amt, nextPaymentDate: next, nextPaymentAmount: computeNextPaymentAmount(newMemberForm.packageDuration), paymentStatus: computePaymentStatus(next) }));
  };

  const handleRenewPlan = () => {
    if (!newMemberForm.packageDuration) {
      setNewMemberError('Select package duration first');
      return;
    }
    const base = newMemberForm.nextPaymentDate || new Date().toISOString().slice(0, 10);
    const next = computeNextDueDate(base, newMemberForm.packageDuration);
    const amt = computeNextPaymentAmount(newMemberForm.packageDuration);
    setNewMemberForm(prev => ({ ...prev, lastPaymentDate: base, lastPaymentAmount: amt, nextPaymentDate: next, nextPaymentAmount: computeNextPaymentAmount(newMemberForm.packageDuration), paymentStatus: computePaymentStatus(next) }));
  };

  const getPriceForPackage = (packageDuration) => {
    const key = (packageDuration || '').toLowerCase();
    if (key.includes('monthly')) return pricing.monthly || 0;
    if (key.includes('3') || key.includes('quarter')) return pricing.quarterly || pricing.monthly || 0;
    if (key.includes('6') || key.includes('bi')) return pricing.biannual || pricing.monthly || 0;
    if (key.includes('year')) return pricing.yearly || pricing.monthly || 0;
    return pricing.monthly || 0;
  };

  const sortedUsers = [...users].sort((left, right) => {
    const leftTime = new Date(left.joinedAt || 0).getTime();
    const rightTime = new Date(right.joinedAt || 0).getTime();
    return rightTime - leftTime;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(user => (user.status || 'pending') === 'active').length;
  const pendingUsers = users.filter(user => (user.status || 'pending') === 'pending').length;
  const inactiveUsers = users.filter(user => (user.status || 'pending') === 'inactive').length;
  const memberUsers = sortedUsers.filter(user => (user.source || '') === 'admin-manual-entry' || (user.enquiryStatus || '').toLowerCase() === 'joined');
  const recentUsers = memberUsers.slice(0, 6);
  const enquiryUsers = sortedUsers.filter(user => (user.source || '') !== 'admin-manual-entry' && (user.enquiryStatus || '').toLowerCase() !== 'joined');
  const recentEnquiries = enquiryUsers.slice(0, 8);
  const paidMembers = users.filter(user => user.latestPayment && user.latestPayment.paid).length;
  const overdueMembers = users.filter(user => user.nextPaymentDue && new Date(user.nextPaymentDue) < new Date()).length;
  const packageCards = [
    { key: 'monthly', label: 'Monthly' },
    { key: 'quarterly', label: '3 Months' },
    { key: 'biannual', label: '6 Months' },
    { key: 'yearly', label: 'Yearly' },
  ];
  const panelStats = [
    { label: 'Total Members', value: totalUsers, tone: 'from-[#ff1a1a] to-[#ff7a18]' },
    { label: 'Active', value: activeUsers, tone: 'from-emerald-500 to-emerald-300' },
    { label: 'Pending', value: pendingUsers, tone: 'from-amber-500 to-yellow-300' },
    { label: 'Inactive', value: inactiveUsers, tone: 'from-slate-500 to-slate-300' },
    { label: 'Paid', value: paidMembers, tone: 'from-green-500 to-emerald-300' },
    { label: 'Overdue', value: overdueMembers, tone: 'from-red-500 to-rose-400' },
  ];

  const sidebarItems = [
    { label: 'Overview', target: 'overview' },
    { label: 'Enquiries', target: 'enquiries' },
    { label: 'Members', target: 'members' },
    { label: 'Pricing', target: 'pricing' },
    { label: 'Activity', target: 'activity' },
  ];

  const activePageLabel = sidebarItems.find(item => item.target === activePage)?.label || 'Overview';

  // Login UI
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#050505] backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-[#0b0b0b] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#111] border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <h2 className="font-bebas text-2xl tracking-wider text-white">ADMIN ACCESS</h2>
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
                Firebase is not configured yet. Add the VITE_FIREBASE_* values to a .env file to enable admin access.
              </div>
            )}

            <div className="p-3 bg-blue-500/10 border border-blue-500/30 text-blue-200 text-sm rounded">
              Only emails listed in the Firestore <span className="font-semibold">admins/allowed</span> document can access this panel.
            </div>

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
              disabled={isLoggingIn || isCheckingAccess}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#ff1a1a] text-white font-barlow font-bold tracking-widest text-sm px-5 py-3 uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoggingIn || isCheckingAccess ? 'Checking access...' : 'Login'}
            </motion.button>
          </form>

          <div className="border-t border-white/5 bg-[#111] px-6 py-4 text-center text-xs text-gray-500">
            Use a Firebase Auth account whose email is approved in the admin allowlist
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
      className="fixed inset-0 z-50 bg-[#050505] text-white overflow-hidden"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="h-full w-full bg-[#060606] border border-white/5 shadow-2xl shadow-black/50 overflow-hidden flex"
      >
        <aside className="hidden xl:flex w-72 flex-col border-r border-white/5 bg-[#080808]">
          <div className="px-6 py-6 border-b border-white/5">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#ff1a1a] to-[#ff7a18] flex items-center justify-center font-bebas text-xl text-white shadow-lg shadow-[#ff1a1a]/30">
                G
              </div>
              <div>
                <p className="font-bebas text-2xl tracking-wider leading-none text-white">GETFIT</p>
                <p className="text-[10px] tracking-[0.35em] uppercase text-gray-500">Admin Console</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Manage leads, pricing, and approvals from one clean dashboard.
            </p>
          </div>

          <div className="p-4 space-y-2 flex-1">
            {sidebarItems.map(item => (
              <button
                key={item.target}
                onClick={() => setActivePage(item.target)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  activePage === item.target
                    ? 'bg-white/10 border-white/10 text-white'
                    : 'bg-transparent border-transparent text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="font-barlow font-semibold tracking-wider text-sm uppercase">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="p-6 border-t border-white/5 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-gray-200 font-barlow font-bold tracking-widest text-sm px-4 py-3 uppercase"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 border-b border-white/5 bg-[#090909]/95 backdrop-blur-md px-5 md:px-8 py-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-2">Firebase Connected Dashboard</p>
              <h2 className="font-bebas text-3xl md:text-4xl tracking-wider text-white">{activePageLabel}</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden h-10 w-10 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center mr-2"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
              <div className="hidden md:block text-right">
                <p className="text-sm text-white font-semibold">{BOOTSTRAP_ADMIN_EMAIL}</p>
                <p className="text-xs text-gray-500">Authorized administrator</p>
              </div>
              <button
                onClick={onClose}
                className="h-11 w-11 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                aria-label="Close admin panel"
              >
                <X size={22} />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="px-5 md:px-8 py-6 md:py-8 min-h-full">
              <AnimatePresence mode="wait" initial={false}>
                {mobileSidebarOpen && (
                  <>
                    <motion.div
                      key="mobile-sidebar-backdrop"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="fixed inset-0 z-40 bg-black/60 md:hidden"
                      onClick={() => setMobileSidebarOpen(false)}
                    />
                    <motion.aside
                    key="mobile-sidebar"
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed inset-y-0 left-0 z-50 w-64 bg-[#080808] border-r border-white/5 p-4 md:hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#ff1a1a] to-[#ff7a18] flex items-center justify-center font-bebas text-lg text-white">G</div>
                        <div>
                          <p className="font-bebas text-lg text-white">GETFIT</p>
                          <p className="text-[10px] text-gray-500">Admin Console</p>
                        </div>
                      </div>
                      <button onClick={() => setMobileSidebarOpen(false)} className="text-gray-400 hover:text-white">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {sidebarItems.map(item => (
                        <button
                          key={`mobile-${item.target}`}
                          onClick={() => { setActivePage(item.target); setMobileSidebarOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-lg ${activePage === item.target ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          <span className="font-barlow text-sm uppercase tracking-wider">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.aside>
                  </>
                )}
                {activePage === 'overview' && (
                  <motion.section
                    key="overview"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="space-y-8 min-h-full"
                  >
                    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      {panelStats.map(card => (
                        <motion.div
                          key={card.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e0e] p-5"
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${card.tone} opacity-[0.08]`} />
                          <div className="relative flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs uppercase tracking-[0.28em] text-gray-500 mb-3">{card.label}</p>
                              <p className="font-bebas text-4xl tracking-wider text-white">{card.value}</p>
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                              <Users size={20} className="text-gray-300" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </section>

                    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-5 md:p-6">
                        <div className="flex items-center justify-between gap-4 mb-5">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">Snapshot</p>
                            <h3 className="font-bebas text-2xl tracking-wider text-white">Current Status</h3>
                          </div>
                          <Users size={18} className="text-gray-400" />
                        </div>
                        <div className="space-y-3 text-sm text-gray-300">
                          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            <span>Total Members</span><span className="text-white">{totalUsers}</span>
                          </div>
                          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            <span>Pending Approvals</span><span className="text-white">{pendingUsers}</span>
                          </div>
                          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            <span>Last Joined</span><span className="text-white">{recentUsers[0] ? recentUsers[0].fullName : 'No data'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-5 md:p-6">
                        <div className="mb-5">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">Live Feed</p>
                          <h3 className="font-bebas text-2xl tracking-wider text-white">Recent Activity</h3>
                        </div>
                        <div className="space-y-3">
                          {recentUsers.length === 0 ? (
                            <div className="text-sm text-gray-500">No recent activity yet.</div>
                          ) : (
                            recentUsers.slice(0, 4).map((user) => (
                              <div key={`activity-${user.id}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                <div className="flex items-center justify-between gap-3 mb-1">
                                  <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                                  <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                                    {new Date(user.joinedAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400">
                                  {user.packageDuration} • {user.trainingType} • {(user.status || 'pending').toUpperCase()}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </section>
                  </motion.section>
                )}

                {activePage === 'members' && (
                  <motion.section
                    key="members"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="rounded-3xl border border-white/10 bg-[#0b0b0b] overflow-hidden min-h-[calc(100vh-180px)]"
                  >
                    <div className="p-5 md:p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">Member Pipeline</p>
                        <h3 className="font-bebas text-2xl tracking-wider text-white">Recent Join Requests</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-[0.25em] text-gray-400">{memberUsers.length} Total</span>
                        <button
                          onClick={() => setShowNewMemberForm(true)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#ff1a1a]/30 bg-[#ff1a1a]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#ff1a1a] transition-colors hover:bg-[#ff1a1a]/20"
                        >
                          <UserPlus size={14} />
                          New Member
                        </button>
                      </div>
                    </div>

                    <div className="divide-y divide-white/5 max-h-[calc(100vh-260px)] overflow-y-auto">
                      {recentUsers.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No users joined yet.</div>
                      ) : (
                        recentUsers.map((user, idx) => (
                          <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="p-5 md:p-6 hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                  <h4 className="font-bebas text-xl tracking-wide text-white">{user.fullName}</h4>
                                  <span className={`text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-full border ${getStatusColor(user.status)}`}>
                                    {(user.status || 'pending').toUpperCase()}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Phone</p>
                                    <p className="text-white truncate">{user.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Package</p>
                                    <p className="text-white">{user.packageDuration}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Training</p>
                                    <p className="text-white">{user.trainingType}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Joined</p>
                                    <p className="text-white">{new Date(user.joinedAt).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Next Bill Date</p>
                                    <p className="text-white">{getNextBillDate(user)}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setShowUserDetail(user)}
                                  className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-blue-400 hover:bg-blue-500/10 transition-colors flex items-center justify-center"
                                  title="View details"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  onClick={() => setEditingUser(user)}
                                  className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-yellow-400 hover:bg-yellow-500/10 transition-colors flex items-center justify-center"
                                  title="Update status"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center"
                                  title="Delete user"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>

                            <AnimatePresence>
                              {editingUser?.id === user.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -8 }}
                                  className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4"
                                >
                                  <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-xs uppercase tracking-[0.3em] text-gray-400">Status</span>
                                    {['pending', 'active', 'inactive'].map(status => (
                                      <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(user.id, status)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                                          (user.status || 'pending') === status
                                            ? 'bg-[#ff1a1a] text-white'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/15'
                                        }`}
                                      >
                                        {status}
                                      </button>
                                    ))}
                                    <button
                                      onClick={() => setEditingUser(null)}
                                      className="ml-auto text-xs uppercase tracking-widest text-gray-500 hover:text-white"
                                    >
                                      Close
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.section>
                )}

                {activePage === 'enquiries' && (
                  <motion.section
                    key="enquiries"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="rounded-3xl border border-white/10 bg-[#0b0b0b] overflow-hidden min-h-[calc(100vh-180px)]"
                  >
                    <div className="p-5 md:p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">Join Now Form</p>
                        <h3 className="font-bebas text-2xl tracking-wider text-white">Enquiries</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-[0.25em] text-gray-400">{enquiryUsers.length} Total</span>
                      </div>
                    </div>

                    <div className="divide-y divide-white/5 max-h-[calc(100vh-260px)] overflow-y-auto">
                      {recentEnquiries.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No enquiries submitted yet.</div>
                      ) : (
                        recentEnquiries.map((user, idx) => (
                          <motion.div
                            key={`enquiry-${user.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="p-5 md:p-6 hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                  <h4 className="font-bebas text-xl tracking-wide text-white">{user.fullName || user.name}</h4>
                                  <span className="text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-full border bg-blue-500/10 text-blue-300 border-blue-500/30">
                                    {((user.enquiryStatus || 'new').toUpperCase())}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Phone</p>
                                    <p className="text-white truncate">{user.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Package</p>
                                    <p className="text-white">{user.packageDuration || user.package || '—'}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Training</p>
                                    <p className="text-white">{user.trainingType}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Joined</p>
                                    <p className="text-white">{formatDateValue(user.joinedAt)}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col items-stretch gap-3 min-w-[180px]">
                                <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                                  {['talked', 'visited', 'joined'].map(status => (
                                    <button
                                      key={status}
                                      onClick={() => {
                                        handleEnquiryStatusUpdate(user.id, status);
                                        if (status === 'joined') {
                                          openMemberFormFromEnquiry(user);
                                        }
                                      }}
                                      className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.28em] border transition-colors ${
                                        (user.enquiryStatus || '').toLowerCase() === status
                                          ? 'bg-[#ff1a1a] text-white border-[#ff1a1a]/50'
                                          : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                                      }`}
                                    >
                                      {status}
                                    </button>
                                  ))}
                                </div>
                                <div className="flex items-center gap-2 justify-start md:justify-end">
                                  <button
                                    onClick={() => setShowUserDetail(user)}
                                    className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-blue-400 hover:bg-blue-500/10 transition-colors flex items-center justify-center"
                                    title="View details"
                                  >
                                    <Eye size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.section>
                )}

                {activePage === 'pricing' && (
                  <motion.section
                    key="pricing"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-5 md:p-6 min-h-[calc(100vh-180px)]"
                  >
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">Billing</p>
                        <h3 className="font-bebas text-2xl tracking-wider text-white">Pricing Controls</h3>
                      </div>
                      <DollarSign size={18} className="text-gray-400" />
                    </div>

                    <div className="space-y-4">
                      {packageCards.map(pkg => (
                        <div key={pkg.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-xs uppercase tracking-[0.28em] text-gray-500">{pkg.label}</label>
                            <span className="text-sm text-gray-400">₹</span>
                          </div>
                          <input
                            type="number"
                            value={pricing[pkg.key]}
                            onChange={(e) => handlePricingChange(pkg.key, e.target.value)}
                            className="w-full rounded-xl bg-[#050505] border border-white/10 text-white font-inter text-lg px-4 py-3 focus:outline-none focus:border-[#ff1a1a]/60 transition-colors"
                          />
                        </div>
                      ))}
                    </div>

                    {priceChanged && (
                      <div className="mt-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
                        You have unsaved pricing changes.
                      </div>
                    )}

                    <motion.button
                      onClick={handleSavePricing}
                      disabled={!priceChanged || isSavingPricing}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#ff1a1a] to-[#ff5a1f] px-5 py-4 text-sm font-barlow font-bold tracking-[0.35em] uppercase text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingPricing ? 'Saving...' : 'Save Pricing'}
                    </motion.button>
                  </motion.section>
                )}

                {activePage === 'activity' && (
                  <motion.section
                    key="activity"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-5 md:p-6 min-h-[calc(100vh-180px)]"
                  >
                    <div className="mb-5">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">Live Feed</p>
                      <h3 className="font-bebas text-2xl tracking-wider text-white">Recent Activity</h3>
                    </div>

                    <div className="space-y-3">
                      {recentUsers.length === 0 ? (
                        <div className="text-sm text-gray-500">No recent activity yet.</div>
                      ) : (
                        recentUsers.slice(0, 8).map((user) => (
                          <div key={`activity-${user.id}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            <div className="flex items-center justify-between gap-3 mb-1">
                              <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                              <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                                {new Date(user.joinedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">
                              {user.packageDuration} • {user.trainingType} • {(user.status || 'pending').toUpperCase()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* New Member Modal */}
        <AnimatePresence>
          {showNewMemberForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewMemberForm(false)}
              className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={e => e.stopPropagation()}
                className="bg-[#0d0d0d] border border-white/10 max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bebas text-2xl tracking-wider text-white">ADD NEW MEMBER</h3>
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mt-1">Create a manual Firestore user record</p>
                  </div>
                  <button onClick={() => setShowNewMemberForm(false)} className="text-gray-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleCreateMember} className="space-y-4">
                  {newMemberError && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                      {newMemberError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Full Name *</span>
                      <input
                        type="text"
                        value={newMemberForm.fullName}
                        onChange={(e) => handleNewMemberChange('fullName', e.target.value)}
                        required
                        className="w-full rounded-xl bg-[#050505] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#ff1a1a]/60"
                      />
                    </label>

                    {/* Email */}
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Email *</span>
                      <input
                        type="email"
                        value={newMemberForm.email}
                        onChange={(e) => handleNewMemberChange('email', e.target.value)}
                        required
                        className="w-full rounded-xl bg-[#050505] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#ff1a1a]/60"
                      />
                    </label>

                    {/* Phone */}
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Phone *</span>
                      <input
                        type="tel"
                        value={newMemberForm.phone}
                        onChange={(e) => handleNewMemberChange('phone', e.target.value)}
                        required
                        className="w-full rounded-xl bg-[#050505] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#ff1a1a]/60"
                      />
                    </label>

                    {/* DOB */}
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Date of Birth *</span>
                      <input
                        type="date"
                        value={newMemberForm.dateOfBirth}
                        onChange={(e) => handleNewMemberChange('dateOfBirth', e.target.value)}
                        required
                        className="w-full rounded-xl bg-[#050505] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#ff1a1a]/60"
                      />
                    </label>

                    {/* Gender */}
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Gender</span>
                      <select
                        value={newMemberForm.gender}
                        onChange={(e) => handleNewMemberChange('gender', e.target.value)}
                        className="w-full rounded-xl bg-[#050505] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#ff1a1a]/60"
                      >
                        <option value="" disabled>Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    {/* Status */}
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Status</span>
                      <select
                        value={newMemberForm.status}
                        onChange={(e) => handleNewMemberChange('status', e.target.value)}
                        className="w-full rounded-xl bg-[#050505] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#ff1a1a]/60"
                      >
                        <option value="" disabled>Select</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </label>

                    {/* Category */}
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Category *</span>
                      <select
                        value={newMemberForm.category}
                        onChange={(e) => handleNewMemberChange('category', e.target.value)}
                        required
                        className="w-full rounded-xl bg-[#050505] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#ff1a1a]/60"
                      >
                        <option value="" disabled>Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Kids">Kids</option>
                        <option value="Couple">Couple</option>
                      </select>
                    </label>

                    {/* Training Type */}
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Training Type *</span>
                      <select
                        value={newMemberForm.trainingType}
                        onChange={(e) => handleNewMemberChange('trainingType', e.target.value)}
                        required
                        className="w-full rounded-xl bg-[#050505] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#ff1a1a]/60"
                      >
                        <option value="" disabled>Select</option>
                        <option value="Boxing">Boxing</option>
                        <option value="MMA">MMA</option>
                        <option value="Kickboxing">Kickboxing</option>
                        <option value="Fitness">Fitness</option>
                      </select>
                    </label>

                    {/* Package Duration */}
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Package Duration *</span>
                      <select
                        value={newMemberForm.packageDuration}
                        onChange={(e) => handleNewMemberChange('packageDuration', e.target.value)}
                        required
                        className="w-full rounded-xl bg-[#050505] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#ff1a1a]/60"
                      >
                        <option value="" disabled>Select</option>
                        <option value="Monthly">Monthly</option>
                        <option value="3 Months">3 Months</option>
                        <option value="6 Months">6 Months</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </label>

                    {/* Preferred Time */}
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Preferred Time *</span>
                      <select
                        value={newMemberForm.preferredTime}
                        onChange={(e) => handleNewMemberChange('preferredTime', e.target.value)}
                        required
                        className="w-full rounded-xl bg-[#050505] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#ff1a1a]/60"
                      >
                        <option value="" disabled>Select</option>
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                      </select>
                    </label>

                    {/* Payment Mode */}
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Payment Mode *</span>
                      <select
                        value={newMemberForm.paymentMode}
                        onChange={(e) => handleNewMemberChange('paymentMode', e.target.value)}
                        required
                        className="w-full rounded-xl bg-[#050505] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#ff1a1a]/60"
                      >
                        <option value="" disabled>Select</option>
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Card">Card</option>
                      </select>
                    </label>
                  </div>

                  {/* Payment logic fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Last Payment Date</span>
                      <input
                        type="date"
                        value={newMemberForm.lastPaymentDate || ''}
                        onChange={(e) => handleNewMemberChange('lastPaymentDate', e.target.value)}
                        className="w-full rounded-xl bg-[#050505] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#ff1a1a]/60"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Next Payment Date</span>
                      <input
                        type="text"
                        readOnly
                        value={newMemberForm.nextPaymentDate ? new Date(newMemberForm.nextPaymentDate).toISOString().slice(0,10) : ''}
                        className="w-full rounded-xl bg-[#0b0b0b] border border-white/10 text-white px-4 py-3"
                      />
                    </label>

                    <div className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Payment Status</span>
                      <div className="h-full flex items-center gap-2">
                        <span className={`px-3 py-2 rounded-full text-xs font-bold uppercase ${newMemberForm.paymentStatus === 'Overdue' ? 'bg-red-600/20 text-red-400' : newMemberForm.paymentStatus === 'Paid' ? 'bg-green-600/20 text-green-300' : 'bg-yellow-600/20 text-yellow-300'}`}>
                          {newMemberForm.paymentStatus || 'Due'}
                        </span>
                        <button type="button" onClick={handleMarkAsPaid} className="text-xs uppercase px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10">Mark as Paid</button>
                        <button type="button" onClick={handleRenewPlan} className="text-xs uppercase px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10">Renew Plan</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewMemberForm(false)}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-300 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingMember || !isNewMemberFormValid()}
                      className="rounded-xl bg-gradient-to-r from-[#ff1a1a] to-[#ff5a1f] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white disabled:opacity-50"
                    >
                      {isCreatingMember ? 'Saving...' : 'Create Member'}
                    </button>
                  </div>
                  {successMessage && (
                    <div className="mt-2 text-sm text-green-300">{successMessage}</div>
                  )}
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    <span className="text-gray-500 text-xs font-barlow">Next Bill Date</span>
                    <p className="text-white font-semibold">{getNextBillDate(showUserDetail)}</p>
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
