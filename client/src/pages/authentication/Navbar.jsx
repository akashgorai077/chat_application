import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import chat from "../../assets/chat.png";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleShowLogin = () => {
    navigate("/login");
  };

  const handleShowSignup = () => {
    navigate("/signup");
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-base-300/80 bg-base-100/75 text-base-content shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            className="flex min-w-0 items-center gap-2 rounded-lg pr-2 text-left focus-ring"
            onClick={() => navigate("/")}
          >
            <img src={chat} alt="App Logo" className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11" />
            <span className="truncate text-xl font-bold text-base-content sm:text-2xl">WeChat</span>
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href="/#about"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-base-content/70 transition-colors hover:bg-base-200 hover:text-primary"
            >
              About
            </a>
            <a
              href="/#features"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-base-content/70 transition-colors hover:bg-base-200 hover:text-primary"
            >
              Features
            </a>
            <button
              onClick={handleShowLogin}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-base-content/70 transition-colors hover:bg-base-200 hover:text-primary"
            >
              Login
            </button>
            <button
              onClick={handleShowSignup}
              className="btn btn-primary btn-sm rounded-lg px-5"
            >
              Sign Up
            </button>
          </div>

          <button
            className="btn btn-ghost btn-sm rounded-lg md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-base-300 bg-base-100/95 backdrop-blur-xl md:hidden">
          <div className="space-y-2 px-3 py-4">
            <a
              href="/#about"
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-base-content/75 hover:bg-base-200 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              href="/#features"
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-base-content/75 hover:bg-base-200 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <button
              onClick={() => {
                handleShowLogin();
                setIsMenuOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-base-content/75 hover:bg-base-200 hover:text-primary"
            >
              Login
            </button>
            <button
              onClick={() => {
                handleShowSignup();
                setIsMenuOpen(false);
              }}
              className="btn btn-primary btn-sm w-full rounded-lg"
            >
              Sign Up
            </button>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

export default Navbar;
