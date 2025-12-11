import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Menu as MenuIcon, X, Clock, ChefHat, ArrowRight 
} from "lucide-react";

// Assets
import logo from "../assets/logo.png";
import img1 from "../assets/1.png";
import img2 from "../assets/2.png";
import img3 from "../assets/3.png";
import phone from "../assets/phone.png";
import google from "../assets/google.png";
import apple from "../assets/apple.png";
import people from "../assets/people.png";
import bz1 from "../assets/bz1.png";
import bz2 from "../assets/bz2.png";
import bz3 from "../assets/bz3.png";
import handshake from "../assets/handshake.png";

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      
      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
          <Link to="/">
            <img src={logo} alt="Quisine-IQ Logo" className="h-12 w-auto object-contain" />
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-orange-600">Features</a>
            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-orange-600">About</a>
            <Link to="/login" className="text-sm font-medium text-slate-900 hover:text-orange-600">Log In</Link>
            <div className="h-6 w-px bg-slate-200"></div>
            <Link 
              to="/signup" 
              className="rounded-full bg-orange-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-200"
            >
              Create Account
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <MenuIcon />}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
            <div className="absolute top-20 left-0 w-full bg-white border-b shadow-lg md:hidden flex flex-col p-4 gap-4">
                <Link to="/login" className="text-slate-900 font-medium">Log In</Link>
                <Link to="/signup" className="text-orange-600 font-bold">Sign Up</Link>
            </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-16 pb-24 md:pt-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={fadeIn}
              className="flex flex-col items-center gap-6"
            >
              <div className="inline-flex items-center rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-orange-600">
                The Future of Dining
              </div>
              
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-7xl">
                Create your <span className="text-orange-600">Digital Menu</span> <br/> Get QR Codes instantly.
              </h1>
              
              <p className="text-xl text-slate-600 md:text-2xl max-w-2xl">
                Streamline operations, reduce wait times, and offer a contactless ordering experience that your customers will love.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-4 justify-center">
                <button 
                    onClick={() => navigate('/signup')} 
                    className="rounded-full bg-slate-900 px-8 py-4 text-lg font-bold text-white transition-transform hover:translate-y-[-2px] hover:shadow-xl flex items-center gap-2"
                >
                  Get Started Free <ArrowRight className="h-5 w-5" />
                </button>
                
                <button 
                    disabled
                    className="flex cursor-not-allowed items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-400 opacity-80 shadow-sm"
                >
                  <Clock className="h-5 w-5" /> App Coming Soon
                </button>
              </div>
            </motion.div>

            {/* Hero Image / Graphic */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-16 relative w-full"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
                <div className="grid grid-cols-3 gap-4 md:gap-8 opacity-90">
                     <img src={img1} className="rounded-2xl shadow-2xl translate-y-12" alt="App Screen" />
                     <img src={img2} className="rounded-2xl shadow-2xl -translate-y-4 scale-110 z-10" alt="App Screen" />
                     <img src={img3} className="rounded-2xl shadow-2xl translate-y-12" alt="App Screen" />
                </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Value Prop Section --- */}
      <section className="py-24" id="features">
        <div className="container mx-auto px-4 text-center md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mb-16"
          >
            <h2 className="mb-4 text-3xl font-bold text-slate-900">Tunisia's Best Digital Dining Experience</h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-600">
              Scan, discover, devour! The app that puts the entire menu in the blink of an eye.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
             {[
               { img: bz1, title: "Zero Hardware", desc: "No expensive tablets needed. Just your phone." },
               { img: bz2, title: "Instant Updates", desc: "Change prices or disable sold-out items in seconds." },
               { img: bz3, title: "Contactless", desc: "Safer for staff and customers. No dirty physical menus." }
             ].map((item, index) => (
                <motion.div key={index} variants={fadeIn} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="h-20 w-20 rounded-full bg-white shadow-md flex items-center justify-center mb-4">
                     <img src={item.img} alt={item.title} className="h-10 w-10 object-contain" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </motion.div>
             ))}
          </motion.div>
        </div>
      </section>

      {/* --- App Download --- */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center gap-12 md:flex-row md:justify-between">
            <div className="flex-1 space-y-8 text-center md:text-left">
              <h2 className="text-4xl font-bold text-slate-900">Download the App</h2>
              <p className="text-lg leading-relaxed text-slate-600">
                Order what makes you happy and track your meal in real-time with the 
                <span className="font-bold text-orange-600"> Quisine-IQ</span> app.
                Available soon on iOS and Android.
              </p>
              <div className="flex gap-4 justify-center md:justify-start opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                <img src={google} alt="Play Store" className="h-14 cursor-pointer" />
                <img src={apple} alt="App Store" className="h-14 cursor-pointer" />
              </div>
              <div className="text-sm font-medium text-orange-600">* Mobile App Currently In Development</div>
            </div>
            <div className="flex-1 flex justify-center">
              <img src={phone} alt="App Preview" className="max-h-[500px] object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* --- About Section --- */}
      <section className="py-24" id="about">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-20 text-center">
             <div className="mb-4 inline-flex items-center justify-center rounded-full bg-orange-100 p-3 text-orange-600">
                <ChefHat className="h-8 w-8" />
             </div>
             <h2 className="text-3xl font-bold text-slate-900">About Quisine-IQ</h2>
             <p className="mt-4 text-slate-600 max-w-2xl mx-auto">We are committed to improving the dining experience through innovative technology that bridges the gap between chefs and customers.</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
             <div className="w-full lg:w-1/2">
                <img src={people} alt="Team" />
             </div>
             <div className="w-full lg:w-1/2 space-y-6">
                 <h3 className="text-2xl font-bold text-slate-900">Why choose us?</h3>
                 <p className="text-slate-600 text-lg">
                    Quisine-IQ isn't just a menu; it's an operating system for modern restaurants. We help you understand what your customers love, speed up service, and look good doing it.
                 </p>
                 <ul className="space-y-4">
                    {["Real-time analytics", "Multi-language support", "Custom branding"].map((feat, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                            <span className="font-medium text-slate-800">{feat}</span>
                        </li>
                    ))}
                 </ul>
             </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
               <img src={logo} alt="Logo" className="h-10 w-auto" />
               <p className="text-sm text-slate-500">© 2025 Quisine-IQ.<br/>All rights reserved.</p>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-slate-900">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>10 Rue Souhaib Eroumi</li>
                <li>Manouba, Tunis</li>
                <li>+216 20 611 213</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-slate-900">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link to="/login" className="hover:text-orange-600">Login</Link></li>
                <li><Link to="/signup" className="hover:text-orange-600">Sign Up</Link></li>
                <li><Link to="/pricing" className="hover:text-orange-600">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-slate-900">Social</h4>
              <div className="flex gap-4">
                {/* Social Icons would go here */}
                <div className="h-8 w-8 bg-slate-100 rounded-full"></div>
                <div className="h-8 w-8 bg-slate-100 rounded-full"></div>
                <div className="h-8 w-8 bg-slate-100 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;