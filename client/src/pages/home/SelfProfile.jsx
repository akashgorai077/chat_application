import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import { FiMenu } from "react-icons/fi";

const THEME_STORAGE_KEY = "wechat-theme";

const formatDate = (dateValue) => {
  if (!dateValue) return "Not available";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const SelfProfile = () => {
  const navigate = useNavigate();
  const { userProfile } = useSelector((state) => state.userReducer);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || "dark";
  });

  const handleThemeToggle = () => {
    const nextTheme = selectedTheme === "dark" ? "light" : "dark";
    setSelectedTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  return (
    <div className="h-[100dvh] overflow-hidden app-surface text-base-content md:flex">
      {isSidebarOpen ? (
        <button
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          aria-label="Close sidebar overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}
      <UserSidebar
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      <div className="h-full min-h-0 w-full overflow-y-auto p-3 sm:p-4 md:p-10">
        <button
          className="btn btn-ghost btn-sm mb-4 md:hidden"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <FiMenu className="text-lg" />
        </button>
        {!userProfile ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-xl font-semibold">Profile not found</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/home")}>
              Back to chat
            </button>
          </div>
        ) : (
          <div className="mx-auto max-w-xl glass-card rounded-lg p-5 shadow-soft sm:p-6 md:p-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="avatar">
                <div className="w-24 rounded-full ring-2 ring-[#7480FF] sm:w-28">
                  <img src={userProfile?.avatar} alt={userProfile?.username} />
                </div>
              </div>

              <h1 className="break-words text-xl font-semibold sm:text-2xl">{userProfile?.fullName}</h1>
              <p className="text-sm text-base-content/60">@{userProfile?.username}</p>
            </div>

            <div className="mt-7 space-y-3 text-sm">
              <p>
                <span className="text-base-content/50">Username:</span> @{userProfile?.username}
              </p>
              <p>
                <span className="text-base-content/50">Gender:</span>{" "}
                {userProfile?.gender || "Not available"}
              </p>
              <p>
                <span className="text-base-content/50">Joined:</span>{" "}
                {formatDate(userProfile?.createdAt)}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 rounded-lg border border-base-300 bg-base-100/60 p-4">
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-base-content/55">
                  Switch between light and dark mode
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={selectedTheme === "dark"}
                onChange={handleThemeToggle}
                aria-label="Toggle dark mode"
              />
            </div>

            <div className="mt-8">
              <button
                className="btn btn-primary rounded-lg btn-sm"
                onClick={() => navigate("/home")}
              >
                Back to chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfProfile;
