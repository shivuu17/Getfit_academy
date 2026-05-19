import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Programs from './components/Programs';
import WhyUs from './components/WhyUs';
import Trainers from './components/Trainers';
import Membership from './components/Membership';
import Impact from './components/Impact';
import Contact from './components/Contact';
import JoinForm from './components/JoinForm';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import FirebaseAdminPanel from './components/FirebaseAdminPanel';

function App() {
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  useEffect(() => {
    // Show loading screen for 1.8 seconds to build anticipation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Admin panel access with keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdmin(!showAdmin);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showAdmin]);

  // Global listener so any component can open the Join modal by dispatching 'openJoinModal'
  useEffect(() => {
    const handler = () => setShowJoinForm(true);
    window.addEventListener('openJoinModal', handler);
    return () => window.removeEventListener('openJoinModal', handler);
  }, []);

  return (
    <div className="grain-overlay bg-black min-h-screen">
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loader" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Navbar 
              onAdminClick={() => setShowAdmin(true)}
              onJoinClick={() => setShowJoinForm(true)}
            />
            <main>
              <Hero />
              <Programs />
              <WhyUs />
              <Trainers />
              <Membership />
              <Impact />
              <Contact />
            </main>
            <Footer />
            <FloatingButtons />
            
            {/* Join Form Modal */}
            <JoinForm 
              isOpen={showJoinForm}
              onClose={() => setShowJoinForm(false)}
            />
            
            {/* Admin Panel */}
            <AnimatePresence>
              {showAdmin && (
                <FirebaseAdminPanel onClose={() => setShowAdmin(false)} />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
