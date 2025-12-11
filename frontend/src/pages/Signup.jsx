import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "../lib/api"; // Uses your axios interceptor
import { 
  User, Mail, Lock, Phone, ArrowRight, Loader2, Eye, EyeOff, ChefHat 
} from "lucide-react";

// Assets
import logo from "../assets/logo.png";
import group from "../assets/Group.png"; 

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    cpassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 1. Signup Mutation
  const signupMutation = useMutation({
    mutationFn: async (newData) => {
      // Ensure this endpoint matches your backend route exactly (e.g. /auth/register vs /auth/signup)
      const response = await api.post("/auth/register", newData); 
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account Created! 🎉", {
        description: "Redirecting you to login..."
      });
      setTimeout(() => navigate("/login"), 1500);
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error("Signup Failed", { description: msg });
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.cpassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }

    // Submit
    signupMutation.mutate({
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      
      {/* --- Left Side: Form Section --- */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20 xl:px-24">
        
        {/* Top Header */}
        <div className="mb-10 flex items-center justify-between">
           <Link to="/">
              <img src={logo} alt="Logo" className="h-10 w-auto hover:opacity-80 transition-opacity" />
           </Link>
           <Link to="/" className="text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors">
             Back to Home
           </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm lg:w-96"
        >
          <div className="text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Get Started
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Create your account to start managing your digital menu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            
            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Restaurant / Owner Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  name="username"
                  type="text"
                  required
                  placeholder="The Burger Lab"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="20 123 456"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="chef@restaurant.com"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••"
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                          onChange={handleChange}
                      />
                      <button
                          type="button"
                          tabIndex="-1"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                  </div>
              </div>
              <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Confirm</label>
                  <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input
                          name="cpassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          placeholder="••••••"
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                          onChange={handleChange}
                      />
                      <button
                          type="button"
                          tabIndex="-1"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                  </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-3 font-bold text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-700 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {signupMutation.isPending ? (
                  <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Creating Account...
                  </>
              ) : (
                  <>
                      Create Account <ArrowRight className="h-4 w-4" />
                  </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
             <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-orange-600 hover:text-orange-500 hover:underline">
                    Log in here
                </Link>
             </p>
          </div>
        </motion.div>
      </div>

      {/* --- Right Side: Visual Section --- */}
      <div className="hidden lg:relative lg:flex lg:w-1/2 items-center justify-center bg-amber-50 overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-orange-200/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[500px] w-[500px] rounded-full bg-orange-300/20 blur-3xl"></div>

        <div className="relative z-10 text-center px-12">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
            >
                <img
                    className="mx-auto max-h-[500px] w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    src={group}
                    alt="Restaurant Management Dashboard"
                />
            </motion.div>
            
            <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5, duration: 0.6 }}
                 className="mt-12"
            >
                <div className="inline-flex items-center justify-center rounded-full bg-white p-3 shadow-md mb-4">
                    <ChefHat className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                    Manage your restaurant like a Pro
                </h3>
                <p className="mt-3 text-slate-600 max-w-md mx-auto">
                    Join thousands of restaurant owners in Tunisia who have modernized their workflow with Quisine-IQ.
                </p>
            </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Signup;