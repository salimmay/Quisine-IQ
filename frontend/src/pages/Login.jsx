import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Updated hook import path
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import logo from "../assets/logo.png"; // Ensure path is correct

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.warning("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back!", {
        description: "Redirecting to dashboard..."
      });
      navigate("/manage");
    } catch (error) {
      toast.error("Login Failed", {
        description: error.response?.data?.message || "Please check your credentials."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      {/* Logo Header */}
      <div className="mb-8">
        <Link to="/">
            <img src={logo} alt="Quisine-IQ" className="h-16 w-auto object-contain hover:scale-105 transition-transform" />
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Restaurant Login</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your menu, orders, and shop details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input 
                        type="email" 
                        name="email"
                        required
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                        placeholder="chef@restaurant.com"
                        onChange={handleChange}
                        value={formData.email}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <Link to="/forgot-password" className="text-xs font-medium text-orange-600 hover:underline">
                        Forgot Password?
                    </Link>
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password"
                        required
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                        placeholder="••••••••"
                        onChange={handleChange}
                        value={formData.password}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            <button 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-600 py-3 font-bold text-white transition-all hover:bg-orange-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? "Signing in..." : "Access Dashboard"}
                {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
        </form>

        <div className="mt-8 text-center border-t pt-6">
            <p className="text-sm text-slate-500">
                Don't have an account? 
                <Link to="/signup" className="ml-1 font-bold text-slate-900 hover:text-orange-600 hover:underline">
                    Sign up free
                </Link>
            </p>
        </div>
      </div>
      
      {/* Footer Link */}
      <div className="mt-8 text-slate-400 text-xs">
        <Link to="/" className="hover:text-slate-600">← Back to Home</Link>
      </div>
    </div>
  );
}