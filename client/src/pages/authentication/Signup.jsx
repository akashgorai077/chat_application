import React, { useEffect, useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaKey, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk } from "../../store/slice/user/userthunk";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import toast from "react-hot-toast";
import Navbar from "./Navbar";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.userReducer);

  const [signupData, setSignupData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setSignupData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async () => {
    if (
      !signupData.fullName ||
      !signupData.username ||
      !signupData.email ||
      !signupData.password ||
      !signupData.confirmPassword ||
      !signupData.gender
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await dispatch(registerUserThunk(signupData)).unwrap();
      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch {
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSignup();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignup();
  };

  const genderOptionClass = (gender) =>
    `flex h-11 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
      signupData.gender === gender
        ? "border-warning bg-warning/10 text-warning"
        : "border-base-300 bg-base-100/70 dark:border-white/20 text-base-content/65 hover:bg-base-200"
    }`;

  return (
    <div className="min-h-screen app-surface text-base-content">
      <Navbar />

      <main className="flex min-h-screen items-center px-3 pb-8 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="hidden lg:block">
            <div className="max-w-xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-warning">
                Start in minutes
              </p>
              <h1 className="text-3xl font-extrabold leading-tight text-base-content sm:text-4xl xl:text-5xl">
                Create your space for everyday conversations.
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-base-content/70">
                Build your profile, add friends, and move naturally from messages to voice or video calls.
              </p>
            </div>

            <div className="chat-surface mt-8 rounded-lg border border-base-300 p-4 shadow-soft">
              <DotLottieReact
                src="/animation/signup.lottie"
                loop
                autoplay
                className="mx-auto h-[260px] w-full max-w-[420px] xl:h-[300px]"
              />
            </div>
          </section>

          <section>
            <div className="glass-card mx-auto w-full max-w-2xl overflow-hidden rounded-lg shadow-soft">
              <div className="border-b border-base-300 bg-base-100/45 px-5 py-5 sm:px-8 sm:py-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="relative grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-content">
                    <FaUser />
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400  ring-2 ring-base-100"></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warning">Create account</p>
                    <p className="text-xs text-base-content/55">Direct chat profile</p>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-base-content sm:text-3xl">Sign up</h2>
                <p className="mt-2 text-sm leading-6 text-base-content/65">
                  Set up your profile for one-to-one messages, media sharing, and calls.
                </p>
              </div>

              <form className="grid grid-cols-1 gap-4 px-5 py-6 sm:grid-cols-2 sm:px-8" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="signup-full-name" className="mb-2 block text-sm font-semibold text-base-content/75">
                    Full name
                  </label>
                  <div className="flex h-12 items-center rounded-lg border border-base-300 dark:border-amber-400 bg-base-100/85 px-3 shadow-sm transition-all focus-within:border-primary focus-within:bg-base-100 focus-within:ring-2 focus-within:ring-primary/15">
                    <FaUser className="mr-3 shrink-0 text-base-content/40" />
                    <input
                      id="signup-full-name"
                      type="text"
                      name="fullName"
                      value={signupData.fullName}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      autoComplete="name"
                      className="w-full bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/40"
                      placeholder="Akash Gorai"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-username" className="mb-2 block text-sm font-semibold text-base-content/75">
                    Username
                  </label>
                  <div className="flex h-12 items-center rounded-lg border border-base-300 dark:border-amber-400 bg-base-100/85 px-3 shadow-sm transition-all focus-within:border-primary focus-within:bg-base-100 focus-within:ring-2 focus-within:ring-primary/15">
                    <FaUser className="mr-3 shrink-0 text-base-content/40" />
                    <input
                      id="signup-username"
                      type="text"
                      name="username"
                      value={signupData.username}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      autoComplete="username"
                      className="w-full bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/40"
                      placeholder="akash"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="signup-email" className="mb-2 block text-sm font-semibold text-base-content/75">
                    Email
                  </label>
                  <div className="flex h-12 items-center rounded-lg border border-base-300 dark:border-amber-400 bg-base-100/85 px-3 shadow-sm transition-all focus-within:border-primary focus-within:bg-base-100 focus-within:ring-2 focus-within:ring-primary/15">
                    <FaEnvelope className="mr-3 shrink-0 text-base-content/40" />
                    <input
                      id="signup-email"
                      type="email"
                      name="email"
                      value={signupData.email}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      autoComplete="email"
                      className="w-full bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/40"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-password" className="mb-2 block text-sm font-semibold text-base-content/75">
                    Password
                  </label>
                  <div className="flex h-12 items-center rounded-lg border border-base-300 dark:border-amber-400 bg-base-100/85 px-3 shadow-sm transition-all focus-within:border-primary focus-within:bg-base-100 focus-within:ring-2 focus-within:ring-primary/15">
                    <FaKey className="mr-3 shrink-0 text-base-content/40" />
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={signupData.password}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      autoComplete="new-password"
                      className="w-full bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/40"
                      placeholder="Password"
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

                <div>
                  <label htmlFor="signup-confirm-password" className="mb-2 block text-sm font-semibold text-base-content/75">
                    Confirm password
                  </label>
                  <div className="flex h-12 items-center rounded-lg border border-base-300 dark:border-amber-400 bg-base-100/85 px-3 shadow-sm transition-all focus-within:border-primary focus-within:bg-base-100 focus-within:ring-2 focus-within:ring-primary/15">
                    <FaKey className="mr-3 shrink-0 text-base-content/40" />
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={signupData.confirmPassword}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      autoComplete="new-password"
                      className="w-full bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/40"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="ml-2 rounded-lg p-1 text-base-content/50 transition-colors hover:bg-base-200 hover:text-primary"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2 ">
                  <p className="mb-2 text-sm font-semibold text-base-content/75">Gender</p>
                  <div className="grid grid-cols-2 gap-3 ">
                    <label className={genderOptionClass("male")}>
                      <input
                        type="radio"
                        value="male"
                        name="gender"
                        checked={signupData.gender === "male"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      Male
                    </label>
                    <label className={genderOptionClass("female")}>
                      <input
                        type="radio"
                        value="female"
                        name="gender"
                        checked={signupData.gender === "female"}
                        onChange={handleInputChange}
                        className="sr-only "
                      />
                      Female
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary h-12 w-full rounded-lg shadow-md sm:col-span-2"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : null}
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <div className="border-t border-base-300 bg-base-100/35 px-5 py-4 text-center text-sm text-base-content/65 sm:px-8">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:text-primary/80"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Signup;
