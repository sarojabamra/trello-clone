import { useState } from "react";
import { UserPlus } from "lucide-react";
import trelloIcon from "../assets/trello-icon.png";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M21.6 12.23c0-.7-.06-1.37-.18-2.01H12v3.8h5.39a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.97-4.33 2.97-7.31Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.24-2.5c-.9.6-2.06.96-3.37.96-2.6 0-4.8-1.76-5.58-4.12L.97 12.4A9.98 9.98 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.42 18.8A6 6 0 0 1 5.9 15.5V12.4l-3.2-2.5A9.98 9.98 0 0 0 .96 12c0 1.6.38 3.12 1.05 4.47l4.41 2.33Z"
        fill="#FBBC05"
      />
      <path
        d="M12 3.98c1.47 0 2.79.5 3.83 1.48l2.87-2.87A9.97 9.97 0 0 0 12 0a9.98 9.98 0 0 0-9.04 5.6l3.2 2.5c.77-2.36 2.97-4.12 5.84-4.12Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function Signup() {
  const { handleGoogleLogin, handleEmailSignup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await handleEmailSignup(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleClick = async () => {
    try {
      await handleGoogleLogin();
      navigate("/");
    } catch (err) {
      setError(err.message || "Google signup failed.");
    }
  };

  return (
    <div className="ui-auth-shell">
      <div className="ui-auth-card">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <img
              src={trelloIcon}
              alt="Trello"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="ui-brand-title">Trello Clone</span>
        </div>

        <div className="mb-6 text-center">
          <h2 className="ui-section-title">Create your account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="signup-name"
            name="name"
            type="text"
            label="Full name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          <Input
            id="signup-email"
            name="email"
            type="email"
            label="Email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <Input
            id="signup-password"
            name="password"
            type="password"
            label="Password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <UserPlus size={16} className="mr-2" />
            {isSubmitting ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-slate-500">
              Or sign up with:
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleClick}
          className="w-full gap-2"
        >
          <GoogleIcon />
          Google
        </Button>

        <p className="ui-muted mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="ui-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
