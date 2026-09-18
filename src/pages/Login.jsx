import { useState } from "react";
import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import trelloIcon from "../assets/trello-icon.png";
import Button from "../components/common/Button";

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

function Login({ onLogin, onEmailLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onEmailLogin(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleClick = async () => {
    try {
      await onLogin();
      navigate("/");
    } catch (err) {
      setError(err.message || "Google login failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg">
            <img
              src={trelloIcon}
              alt="Trello"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-3xl font-bold tracking-tight text-slate-800">
            Trello
          </span>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            Log in to continue
          </h2>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Email <span className="text-red-700">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Password <span className="text-red-700">*</span>
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember me</span>
            </label>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
              i
            </span>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60"
            disabled={isSubmitting}
          >
            <LogIn size={16} className="mr-2" />
            {isSubmitting ? "Signing in..." : "Continue"}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-slate-500">Or login with:</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleClick}
          className="w-full gap-2 border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50"
        >
          <GoogleIcon />
          Google
        </Button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Can&apos;t log in?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
