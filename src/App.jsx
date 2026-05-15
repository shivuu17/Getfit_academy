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
  return (
    <div className="grain-overlay bg-black min-h-screen">
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
    </div>
  );
}

export default App;
