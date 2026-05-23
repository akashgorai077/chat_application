import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaKey, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk } from "../../store/slice/user/userthunk";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import toast from "react-hot-toast";
import Navbar from "./Navbar";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.userReducer);

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/home");
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    if (!loginData.username || !loginData.password) {
      toast.error("Please enter both username and password");
      return;
    }

    setLoading(true);
    const response = await dispatch(loginUserThunk(loginData));
    setLoading(false);

    if (response?.payload?.success) {
      navigate("/home");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen app-surface text-base-content">
      <Navbar />

      <main className="flex min-h-screen items-center px-3 pb-8 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="order-2 hidden lg:order-1 lg:block">
            <div className="max-w-xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-warning">
                Secure messaging
              </p>
              <h1 className="text-3xl font-extrabold leading-tight text-base-content sm:text-5xl">
                Welcome back to your conversations.
              </h1>
              <p className="mt-4 max-w-lg text-base leading-7 text-base-content/70 sm:mt-5 sm:text-lg">
                Sign in to continue messaging, calling, and staying close to the people who matter.
              </p>
            </div>

            <div className="chat-surface mt-8 hidden rounded-lg border border-base-300 p-4 shadow-soft lg:block">
              <DotLottieReact
                src="/animation/login.lottie"
                loop
                autoplay
                className="mx-auto h-[260px] w-full max-w-[420px] xl:h-[300px]"
              />
            </div>
          </section>

          <section className="order-1 lg:order-2">
            <div className="glass-card mx-auto w-full max-w-md overflow-hidden rounded-lg shadow-soft">
              <div className="border-b border-base-300 bg-base-100/45 px-5 py-5 sm:px-8 sm:py-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="relative grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-content">
                    <FaUser />
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-base-100"></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warning">Welcome back</p>
                    <p className="text-xs text-base-content/55">Secure account access</p>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-base-content sm:text-3xl">Sign in</h2>
                <p className="mt-2 text-sm leading-6 text-base-content/65">
                  Enter your credentials to continue your direct chats and calls.
                </p>
              </div>

              <form className="space-y-5 px-5 py-6 sm:px-8" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="login-username" className="mb-2 block text-sm font-semibold text-base-content/75">
                    Username
                  </label>
                  <div className="flex h-12 items-center rounded-lg border border-y-amber-400 bg-base-100/85 px-3 shadow-sm transition-all focus-within:border-primary focus-within:bg-base-100 focus-within:ring-2 focus-within:ring-primary/15">
                    <FaUser className="mr-3 shrink-0 text-base-content/40" />
                    <input
                      id="login-username"
                      type="text"
                      name="username"
                      value={loginData.username}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      autoComplete="username"
                      className="w-full bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/40 sm:text-base"
                      placeholder="Enter Username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-base-content/75">
                    Password
                  </label>
                  <div className="flex h-12 items-center rounded-lg border border-y-amber-400 bg-base-100/85 px-3 shadow-sm transition-all focus-within:border-primary focus-within:bg-base-100 focus-within:ring-2 focus-within:ring-primary/15">
                    <FaKey className="mr-3 shrink-0 text-base-content/40" />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginData.password}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      autoComplete="current-password"
                      className="w-full bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/40 sm:text-base"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="ml-2 rounded-lg p-1 text-base-content/50 transition-colors hover:bg-base-200 hover:text-primary"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary h-12 w-full rounded-lg shadow-md"
                >
                  {loading ? <span className="loading loading-spinner loading-sm"></span> : null}
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="border-t border-base-300 bg-base-100/35 px-5 py-4 text-center text-sm text-base-content/65 sm:px-8">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-primary hover:text-primary/80"
                >
                  Create one
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Login;
