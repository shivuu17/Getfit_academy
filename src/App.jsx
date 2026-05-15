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
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loading screen for 1.8 seconds to build anticipation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
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
            <Navbar />
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
