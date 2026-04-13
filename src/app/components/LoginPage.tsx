import { useState } from "react";
import { useNavigate } from "react-router";
import { 
  Shield, 
  Check, 
  Zap, 
  User, 
  IdCard, 
  Building, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  ArrowRight,
  GraduationCap,
  Mail,
  UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    rollNumber: '',
    fullName: '',
    email: '',
    department: 'CSE',
    year: '1st',
    employeeId: '',
    password: '',
    confirmPassword: '',
    campus: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (mode === 'signup') {
      if (!formData.fullName) newErrors.fullName = "Full Name is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
      
      if (activeTab === 'student') {
        if (!formData.rollNumber) newErrors.rollNumber = "Roll Number is required";
      } else {
        if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
      }
      
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6) newErrors.password = "Min 6 characters";
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      
      if (!formData.campus) newErrors.campus = "Campus name is required";
    } else {
      if (activeTab === 'student') {
        if (!formData.rollNumber) newErrors.rollNumber = "Roll Number is required";
      } else {
        if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
        if (!formData.password) newErrors.password = "Password is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        localStorage.setItem('userRole', activeTab);
        setTimeout(() => {
          navigate(activeTab === 'student' ? '/app' : '/app/admin');
        }, 1500);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      {/* Left Column - Branding Panel (Fixed) */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden md:flex flex-col justify-between w-[45%] lg:w-[55%] bg-[#2D5016] p-12 h-full text-white"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="text-[#2D5016] w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-white text-lg leading-tight uppercase tracking-tight">Campus Reporter</div>
            <div className="text-[11px] text-[#a8d5a2] font-medium uppercase tracking-widest leading-none">Smart Issue Tracking</div>
          </div>
        </div>

        <div>
          <h1 className="text-[36px] lg:text-[40px] leading-[1.1] font-semibold mb-6">
            Your campus.<br />
            Your voice.<br />
            Your issues — resolved.
          </h1>
          <p className="text-[15px] text-[#a8d5a2] mb-10 max-w-sm leading-relaxed">
            Report infrastructure problems, track their status in real time,
            and get notified the moment they are fixed.
          </p>
          <div className="space-y-4">
            {[
              "Report any issue in under 60 seconds",
              "Track your issue status live",
              "Get notified when resolved"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-[#4a7c2f] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-[#3a6b20]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-5 mb-4 shadow-xl max-w-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-sm">Power outage in Lab 3</span>
              </div>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-100 text-[10px] font-bold rounded-full border border-blue-500/30">
                IN PROGRESS
              </span>
            </div>
            <div className="text-xs text-[#a8d5a2] mb-3">
              Block B – Labs · 35 min ago
            </div>
          </div>
          <p className="text-[11px] text-[#a8d5a2]/60">Join 500+ users already reporting issues</p>
        </div>
      </motion.div>

      {/* Right Column - Form Panel */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex-1 h-full bg-white flex flex-col justify-center px-8 md:px-12 lg:px-20 overflow-y-auto py-12"
      >
        <div className="max-w-md w-full mx-auto">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#2D5016] rounded-xl flex items-center justify-center">
              <Shield className="text-white w-6 h-6" />
            </div>
            <div className="font-bold text-[#2D5016] uppercase text-lg">Campus Reporter</div>
          </div>

          <div className="mb-6">
            <h2 className="text-[28px] font-bold text-[#2D5016] mb-1">
              {mode === 'login' ? (activeTab === 'student' ? 'Welcome back' : 'Admin Portal') : 'Join Campus Reporter'}
            </h2>
            <p className="text-sm text-neutral-500">
              {mode === 'login' 
                ? (activeTab === 'student' ? 'Login to your student account' : 'Access restricted to administrators') 
                : 'Create your account to start reporting issues'}
            </p>
          </div>

          {/* User Type Tabs */}
          <div className="flex p-1 bg-[#f0f7ec] rounded-xl mb-6 shadow-inner">
            <button 
              onClick={() => { setActiveTab('student'); setErrors({}); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'student' 
                  ? 'bg-[#2D5016] text-white shadow-md' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Student
            </button>
            <button 
              onClick={() => { setActiveTab('admin'); setErrors({}); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'admin' 
                  ? 'bg-[#2D5016] text-white shadow-md' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Common Fields for Sign Up */}
                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1.5 ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7c2f] group-focus-within:text-[#2D5016]" />
                        <input 
                          type="text" 
                          placeholder="Arjun Selvam"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className={`w-full h-[42px] pl-10 pr-4 bg-white border ${errors.fullName ? 'border-red-500' : 'border-[#e0eed8]'} rounded-lg text-[13px] outline-none transition-all focus:border-[#4a7c2f] focus:ring-4 focus:ring-[#4a7c2f]/10`}
                        />
                      </div>
                      {errors.fullName && <p className="text-[10px] text-red-600 mt-1 ml-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1.5 ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7c2f]" />
                        <input 
                          type="email" 
                          placeholder="student@college.edu"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full h-[42px] pl-10 pr-4 bg-white border ${errors.email ? 'border-red-500' : 'border-[#e0eed8]'} rounded-lg text-[13px] outline-none transition-all focus:border-[#4a7c2f] focus:ring-4 focus:ring-[#4a7c2f]/10`}
                        />
                      </div>
                      {errors.email && <p className="text-[10px] text-red-600 mt-1 ml-1">{errors.email}</p>}
                    </div>
                  </>
                )}

                {/* ID Field (Roll or Email depends on type and mode) */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1.5 ml-1">
                    {activeTab === 'student' ? 'Roll Number' : 'Employee ID'}
                  </label>
                  <div className="relative group">
                    {activeTab === 'student' ? <IdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7c2f]" /> : <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7c2f]" />}
                    <input 
                      type="text" 
                      placeholder={activeTab === 'student' ? 'e.g. 22CSE045' : 'e.g. PSG-ADM-042'}
                      value={activeTab === 'student' ? formData.rollNumber : formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, [activeTab === 'student' ? 'rollNumber' : 'employeeId']: e.target.value })}
                      className={`w-full h-[42px] pl-10 pr-4 bg-white border ${(activeTab === 'student' ? errors.rollNumber : errors.employeeId) ? 'border-red-500' : 'border-[#e0eed8]'} rounded-lg text-[13px] outline-none transition-all focus:border-[#4a7c2f] focus:ring-4 focus:ring-[#4a7c2f]/10`}
                    />
                  </div>
                  {(activeTab === 'student' ? errors.rollNumber : errors.employeeId) && <p className="text-[10px] text-red-600 mt-1 ml-1">{activeTab === 'student' ? errors.rollNumber : errors.employeeId}</p>}
                </div>

                {/* Student specific Study Details */}
                {activeTab === 'student' && mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1.5 ml-1">Dept</label>
                      <select 
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full h-[42px] px-4 bg-white border border-[#e0eed8] rounded-lg text-[13px] outline-none"
                      >
                        {['CSE', 'ECE', 'EEE', 'IT', 'MECH'].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1.5 ml-1">Year</label>
                      <div className="flex bg-[#f0f7ec] p-1 rounded-lg">
                        {['1', '2', '3', '4'].map(y => (
                          <button 
                            key={y}
                            type="button"
                            onClick={() => setFormData({ ...formData, year: `${y}st` })}
                            className={`flex-1 py-1 text-[11px] font-bold rounded ${formData.year === `${y}st` ? 'bg-[#2D5016] text-white' : 'text-neutral-500'}`}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Password Fields */}
                {(mode === 'signup' || activeTab === 'admin') && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1.5 ml-1">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7c2f]" />
                        <input 
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 6 characters"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className={`w-full h-[42px] pl-10 pr-10 bg-white border ${errors.password ? 'border-red-500' : 'border-[#e0eed8]'} rounded-lg text-[13px] outline-none transition-all focus:border-[#4a7c2f] focus:ring-4 focus:ring-[#4a7c2f]/10`}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-[10px] text-red-600 mt-1 ml-1">{errors.password}</p>}
                    </div>

                    {mode === 'signup' && (
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1.5 ml-1">Confirm Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7c2f]" />
                          <input 
                            type="password"
                            placeholder="Repeat password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className={`w-full h-[42px] pl-10 pr-4 bg-white border ${errors.confirmPassword ? 'border-red-500' : 'border-[#e0eed8]'} rounded-lg text-[13px] outline-none transition-all focus:border-[#4a7c2f] focus:ring-4 focus:ring-[#4a7c2f]/10`}
                          />
                        </div>
                        {errors.confirmPassword && <p className="text-[10px] text-red-600 mt-1 ml-1">{errors.confirmPassword}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* Campus Field (Dynamic now) */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase mb-1.5 ml-1">College / Campus</label>
                  <div className="relative group">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7c2f]" />
                    <input 
                      type="text" 
                      placeholder="Enter college name"
                      value={formData.campus}
                      onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                      className={`w-full h-[42px] pl-10 pr-4 bg-white border ${mode === 'signup' && errors.campus ? 'border-red-500' : 'border-[#e0eed8]'} rounded-lg text-[13px] outline-none transition-all focus:border-[#4a7c2f] focus:ring-4 focus:ring-[#4a7c2f]/10`}
                    />
                  </div>
                  {mode === 'signup' && errors.campus && <p className="text-[10px] text-red-600 mt-1 ml-1">{errors.campus}</p>}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full h-[48px] rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm relative overflow-hidden ${
                success 
                  ? 'bg-green-600 text-white' 
                  : 'bg-[#2D5016] text-white hover:bg-[#1D3A10] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : success ? (
                <>
                  <Check className="w-5 h-5 animate-bounce" />
                  {mode === 'login' ? 'Welcome back!' : 'Account Created!'}
                </>
              ) : (
                <>
                  {mode === 'login' ? (activeTab === 'student' ? 'Continue as Student' : 'Login as Admin') : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switch & Alternatives */}
          <div className="mt-8 space-y-4 text-center">
            <button 
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrors({}); }}
              className="text-[13px] font-semibold text-neutral-500"
            >
              {mode === 'login' ? (
                <>Don't have an account? <span className="text-[#2D5016] underline decoration-2 underline-offset-4">Create one now</span></>
              ) : (
                <>Already have an account? <span className="text-[#2D5016] underline decoration-2 underline-offset-4">Sign in here</span></>
              )}
            </button>
            
            <div className="pt-6 border-t border-neutral-100 flex flex-col gap-3">
              <p className="text-[11px] text-neutral-400 px-6 leading-relaxed">
                By {mode === 'login' ? 'signing in' : 'registering'}, you agree to our terms of service and campus safety policies.
              </p>
              <div className="flex justify-center gap-4 text-[10px] font-bold text-[#4a7c2f]/60 uppercase tracking-widest">
                <span>Privacy</span>
                <span>Terms</span>
                <span>Support</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
