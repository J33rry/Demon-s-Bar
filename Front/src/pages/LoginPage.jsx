import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, AlertCircle } from "lucide-react";
import Candle from "../components/Candle";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    setIsSubmitting(false);
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="min-h-screen bg-abyss flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-ember/5 rounded-full blur-[250px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-ember/3 rounded-full blur-[200px]" />
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6" aria-label="Demon&apos;s Bar - Home">
            <Candle className="w-8 h-8 animate-candle-breathe" />
            <span className="font-display text-3xl text-parchment tracking-tight">Demon&apos;s Bar</span>
          </Link>
          <h1 className="font-display text-3xl text-parchment tracking-tight mb-2">Enter the Bar</h1>
          <p className="text-ash text-base font-body">Welcome back. The candle&apos;s been waiting.</p>
        </div>

        <div className="surface-raised rounded-2xl p-6 sm:p-8 shadow-soot border border-ash/20">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="label-text">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-ash" aria-hidden="true" />
                </div>
                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={(e) => {
                    if (e.target.value && !/\S+@\S+\.\S+/.test(e.target.value)) {
                      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
                    }
                  }}
                  className={`input-field pl-12 ${errors.email ? "border-ember focus:border-ember focus:ring-ember/20" : ""}`}
                  placeholder="you@infernal.co"
                  disabled={isSubmitting}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-xs text-ember flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="label-text">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-ash" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pl-12 pr-12 ${errors.password ? "border-ember focus:border-ember focus:ring-ember/20" : ""}`}
                  placeholder="◦◦◦◦◦◦◦◦◦"
                  disabled={isSubmitting}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-ash hover:text-parchment transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-ember flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  Entering...
                </>
              ) : (
                "Enter the Bar"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-ash text-sm font-body">
              Don&apos;t have a stool yet?{" "}
              <Link to="/signup" className="text-ember hover:text-ember-glow font-medium transition-colors">
                Claim one
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-ash/50 mt-6 font-mono tracking-wider">
          Demon&apos;s Bar — Est. MMXXIII
        </p>
      </div>
    </div>
  );
}