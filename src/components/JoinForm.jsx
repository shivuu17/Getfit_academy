import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, X } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function JoinForm({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // Basic Info
    fullName: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    
    // Plan Selection
    packageDuration: 'Monthly',
    category: 'Male',
    
    // Training + Timing
    trainingType: 'Boxing',
    preferredTime: 'Morning',
    preferredDate: '',
    preferredSessionTime: '',
    
    // Payment
    paymentMode: 'Cash',
    
    // Agreement
    agreeTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      setError('Full Name is required');
      return false;
    }
    if (!form.phone.trim()) {
      setError('Phone Number is required');
      return false;
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!form.gender) {
      setError('Please select your gender');
      return false;
    }
    if (!form.dateOfBirth) {
      setError('Date of Birth is required');
      return false;
    }
    if (!form.agreeTerms) {
      setError('You must agree to the academy rules');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Save to Firebase Firestore
      const newUser = {
        ...form,
        joinedAt: new Date().toISOString(),
        status: 'pending'
      };
      await addDoc(collection(db, 'users'), newUser);

      // Send WhatsApp message
      const dob = new Date(form.dateOfBirth);
      const sessionDate = form.preferredDate ? new Date(form.preferredDate).toLocaleDateString() : 'Not specified';
      const msg = encodeURIComponent(
        `Hi! I'm ${form.fullName}. I want to join Getfit Academy!\n\n` +
        `📋 Details:\n` +
        `Name: ${form.fullName}\n` +
        `Phone: ${form.phone}\n` +
        `Gender: ${form.gender}\n` +
        `DOB: ${dob.toLocaleDateString()}\n` +
        `Package: ${form.packageDuration}\n` +
        `Category: ${form.category}\n` +
        `Training: ${form.trainingType}\n` +
        `Preferred Time: ${form.preferredTime}\n` +
        `Preferred Date: ${sessionDate}\n` +
        `Preferred Session Time: ${form.preferredSessionTime || 'Not specified'}\n` +
        `Payment: ${form.paymentMode}`
      );
      window.open(`https://wa.me/918506889718?text=${msg}`, '_blank');

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setForm({
          fullName: '',
          phone: '',
          gender: '',
          dateOfBirth: '',
          packageDuration: 'Monthly',
          category: 'Male',
          trainingType: 'Boxing',
          preferredTime: 'Morning',
          preferredDate: '',
          preferredSessionTime: '',
          paymentMode: 'Cash',
          agreeTerms: false,
        });
      }, 4000);
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#0d0d0d] border border-white/10 w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg"
          >
            {/* Close Button */}
            <div className="sticky top-0 bg-[#111] border-b border-white/5 px-4 md:px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-bebas text-xl md:text-2xl tracking-wider text-white">JOIN OUR ACADEMY</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 md:py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
                    className="mb-6"
                  >
                    <Check className="w-16 h-16 md:w-20 md:h-20 text-[#ff1a1a] mx-auto" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-bebas text-2xl md:text-4xl text-white tracking-wider mb-4"
                  >
                    THANK YOU!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-300 text-sm md:text-base font-inter max-w-sm mx-auto leading-relaxed"
                  >
                    We have received your registration. Our team will contact you shortly with more details about your first session.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-[#ff1a1a] text-sm font-barlow tracking-wider"
                  >
                    ✓ Check your WhatsApp for confirmation
                  </motion.div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3 md:p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded text-sm"
                    >
                      <AlertCircle size={18} className="flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* 1. BASIC INFO */}
                  <div>
                    <h3 className="font-bebas text-lg md:text-xl tracking-wider text-white mb-3 md:mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#ff1a1a] text-white text-xs flex items-center justify-center font-bold rounded">1</span>
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase block mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          placeholder="Enter your full name"
                          value={form.fullName}
                          onChange={handleInputChange}
                          className="w-full bg-[#111] border border-white/10 text-white font-inter text-sm px-3 md:px-4 py-2.5 md:py-3.5
                                     placeholder:text-gray-600 focus:outline-none focus:border-[#ff1a1a]/60
                                     transition-colors"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase block mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+91 XXXXXXXXXX"
                          value={form.phone}
                          onChange={handleInputChange}
                          className="w-full bg-[#111] border border-white/10 text-white font-inter text-sm px-3 md:px-4 py-2.5 md:py-3.5
                                     placeholder:text-gray-600 focus:outline-none focus:border-[#ff1a1a]/60
                                     transition-colors"
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase block mb-3">
                          Gender
                        </label>
                        <div className="flex gap-3 md:gap-4">
                          {['Male', 'Female', 'Other'].map(option => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="gender"
                                value={option}
                                checked={form.gender === option}
                                onChange={handleInputChange}
                                className="w-4 h-4 accent-[#ff1a1a] cursor-pointer"
                              />
                              <span className="text-sm text-gray-300">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase block mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          required
                          value={form.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full bg-[#111] border border-white/10 text-white font-inter text-sm px-3 md:px-4 py-2.5 md:py-3.5
                                     focus:outline-none focus:border-[#ff1a1a]/60 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. PLAN SELECTION */}
                  <div>
                    <h3 className="font-bebas text-lg md:text-xl tracking-wider text-white mb-3 md:mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#ff1a1a] text-white text-xs flex items-center justify-center font-bold rounded">2</span>
                      Plan Selection
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {/* Package Duration */}
                      <div>
                        <label className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase block mb-2">
                          Package Duration
                        </label>
                        <select
                          name="packageDuration"
                          value={form.packageDuration}
                          onChange={handleInputChange}
                          className="w-full bg-[#111] border border-white/10 text-white font-inter text-sm px-3 md:px-4 py-2.5 md:py-3.5
                                     focus:outline-none focus:border-[#ff1a1a]/60 transition-colors appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ff1a1a' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            paddingRight: '2rem'
                          }}
                        >
                          <option value="Monthly">Monthly</option>
                          <option value="3 Months">3 Months</option>
                          <option value="6 Months">6 Months</option>
                          <option value="Yearly">Yearly</option>
                        </select>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase block mb-2">
                          Category
                        </label>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleInputChange}
                          className="w-full bg-[#111] border border-white/10 text-white font-inter text-sm px-3 md:px-4 py-2.5 md:py-3.5
                                     focus:outline-none focus:border-[#ff1a1a]/60 transition-colors appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ff1a1a' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            paddingRight: '2rem'
                          }}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Kids">Kids</option>
                          <option value="Couple">Couple</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 3. TRAINING + TIMING */}
                  <div>
                    <h3 className="font-bebas text-lg md:text-xl tracking-wider text-white mb-3 md:mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#ff1a1a] text-white text-xs flex items-center justify-center font-bold rounded">3</span>
                      Training & Timing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {/* Training Type */}
                      <div>
                        <label className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase block mb-2">
                          Training Type
                        </label>
                        <select
                          name="trainingType"
                          value={form.trainingType}
                          onChange={handleInputChange}
                          className="w-full bg-[#111] border border-white/10 text-white font-inter text-sm px-3 md:px-4 py-2.5 md:py-3.5
                                     focus:outline-none focus:border-[#ff1a1a]/60 transition-colors appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ff1a1a' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            paddingRight: '2rem'
                          }}
                        >
                          <option value="Boxing">Boxing</option>
                          <option value="MMA">MMA</option>
                          <option value="Kickboxing">Kickboxing</option>
                          <option value="Fitness">Fitness</option>
                        </select>
                      </div>

                  {/* Preferred Time */}
                      <div>
                        <label className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase block mb-3">
                          Preferred Time
                        </label>
                        <div className="flex gap-4 md:gap-6">
                          {['Morning', 'Evening'].map(option => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="preferredTime"
                                value={option}
                                checked={form.preferredTime === option}
                                onChange={handleInputChange}
                                className="w-4 h-4 accent-[#ff1a1a] cursor-pointer"
                              />
                              <span className="text-sm text-gray-300">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Preferred Date */}
                      <div>
                        <label className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase block mb-2">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          name="preferredDate"
                          value={form.preferredDate}
                          onChange={handleInputChange}
                          className="w-full bg-[#111] border border-white/10 text-white font-inter text-sm px-3 md:px-4 py-2.5 md:py-3.5
                                     focus:outline-none focus:border-[#ff1a1a]/60 transition-colors"
                        />
                      </div>

                      {/* Preferred Session Time */}
                      <div>
                        <label className="font-barlow font-semibold text-[10px] tracking-[0.25em] text-gray-500 uppercase block mb-2">
                          Preferred Session Time
                        </label>
                        <input
                          type="time"
                          name="preferredSessionTime"
                          value={form.preferredSessionTime}
                          onChange={handleInputChange}
                          className="w-full bg-[#111] border border-white/10 text-white font-inter text-sm px-3 md:px-4 py-2.5 md:py-3.5
                                     focus:outline-none focus:border-[#ff1a1a]/60 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. PAYMENT */}
                  <div>
                    <h3 className="font-bebas text-lg md:text-xl tracking-wider text-white mb-3 md:mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#ff1a1a] text-white text-xs flex items-center justify-center font-bold rounded">4</span>
                      Payment Method
                    </h3>
                    <div className="flex flex-wrap gap-4 md:gap-6">
                      {['Cash', 'UPI', 'Card'].map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMode"
                            value={option}
                            checked={form.paymentMode === option}
                            onChange={handleInputChange}
                            className="w-4 h-4 accent-[#ff1a1a] cursor-pointer"
                          />
                          <span className="text-sm text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 5. AGREEMENT */}
                  <div>
                    <h3 className="font-bebas text-lg md:text-xl tracking-wider text-white mb-3 md:mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#ff1a1a] text-white text-xs flex items-center justify-center font-bold rounded">5</span>
                      Agreement
                    </h3>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={form.agreeTerms}
                        onChange={handleInputChange}
                        className="w-5 h-5 accent-[#ff1a1a] cursor-pointer mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-300">
                        I agree to Getfit Academy rules and terms & conditions
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-red-glow bg-[#ff1a1a] text-white font-barlow font-bold tracking-widest text-sm px-4 md:px-5 py-3 md:py-4 uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6 md:mt-8"
                  >
                    {loading ? 'Submitting...' : 'Join Now - Get Free Trial'}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
