import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, User, AlertCircle, CheckCircle } from "lucide-react";
import Candle from "../components/Candle";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState({});
  const fullNameRef = useRef(null);

  useEffect(() => {
    fullNameRef.current?.focus();
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        if (!/[A-Z]/.test(value)) return "Must contain at least one uppercase letter";
        if (!/[0-9]/.test(value)) return "Must contain at least one number";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setValidated((prev) => ({ ...prev, [name]: !error && value.trim().length > 0 }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setValidated((prev) => ({ ...prev, [name]: !error && value.trim().length > 0 }));
  };

  const validateForm = () => {
    const newErrors = {};
    let valid = true;
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        valid = false;
      }
    });
    setErrors(newErrors);
    setValidated((prev) => {
      const next = { ...prev };
      Object.keys(formData).forEach((key) => {
        next[key] = !newErrors[key] && formData[key].trim().length > 0;
      });
      return next;
    });
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    setIsSubmitting(false);
    navigate("/");
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
          <h1 className="font-display text-3xl text-parchment tracking-tight mb-2">Claim a Stool</h1>
          <p className="text-ash text-base font-body">New here? The Ledger has room for one more.</p>
        </div>

        <div className="surface-raised rounded-2xl p-6 sm:p-8 shadow-soot border border-ash/20">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="label-text">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-ash" aria-hidden="true" />
                </div>
                <input
                  ref={fullNameRef}
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field pl-12 pr-12 ${errors.fullName ? "border-ember focus:border-ember focus:ring-ember/20" : validated.fullName ? "border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500/20" : ""}`}
                  placeholder="Lucien Vane"
                  disabled={isSubmitting}
                  aria-invalid={errors.fullName ? "true" : "false"}
                  aria-describedby={errors.fullName ? "fullName-error" : validated.fullName ? "fullName-success" : undefined}
                />
                {validated.fullName && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                  </div>
                )}
              </div>
              {errors.fullName && (
                <p id="fullName-error" className="text-xs text-ember flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {errors.fullName}
                </p>
              )}
              {validated.fullName && !errors.fullName && (
                <p id="fullName-success" className="text-xs text-emerald-500">Name available</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="label-text">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-ash" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field pl-12 pr-12 ${errors.email ? "border-ember focus:border-ember focus:ring-ember/20" : validated.email ? "border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500/20" : ""}`}
                  placeholder="you@infernal.co"
                  disabled={isSubmitting}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : validated.email ? "email-success" : undefined}
                />
                {validated.email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p id="email-error" className="text-xs text-ember flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {errors.email}
                </p>
              )}
              {validated.email && !errors.email && (
                <p id="email-success" className="text-xs text-emerald-500">Email available</p>
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field pl-12 pr-12 ${errors.password ? "border-ember focus:border-ember focus:ring-ember/20" : validated.password ? "border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500/20" : ""}`}
                  placeholder="◦◦◦◦◦◦◦◦◦"
                  disabled={isSubmitting}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : validated.password ? "password-success" : undefined}
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
              {validated.password && !errors.password && (
                <p id="password-success" className="text-xs text-emerald-500">Password meets requirements</p>
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
                  Claiming...
                </>
              ) : (
                "Claim Your Stool"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-ash text-sm font-body">
              Already have a seat?{" "}
              <Link to="/login" className="text-ember hover:text-ember-glow font-medium transition-colors">
                Enter the Bar
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