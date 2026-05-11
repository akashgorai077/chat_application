import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Lock,
  MessageCircle,
  Paperclip,
  PhoneCall,
  Shield,
  Sparkles,
  UserPlus,
  Users,
  Video,
  Zap,
} from "lucide-react";

import Navbar from "./Navbar";
import chatLogo from "../../assets/chat.png";

const highlights = [
  {
    title: "Live conversations",
    desc: "Messages arrive instantly in focused one-to-one threads.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Voice and video",
    desc: "Move from text to calls with clear controls and lightweight call panels.",
    icon: <PhoneCall className="h-5 w-5" />,
  },
  {
    title: "Friend-first access",
    desc: "Direct chat and calls unlock after friend requests are accepted.",
    icon: <Shield className="h-5 w-5" />,
  },
];

const features = [
  {
    title: "Online status",
    desc: "Know when a selected friend is available to talk.",
    icon: <Users className="h-5 w-5 text-warning" />,
  },
  {
    title: "Media sharing",
    desc: "Send images, videos, and documents from the composer.",
    icon: <MessageCircle className="h-5 w-5 text-warning" />,
  },
  {
    title: "Profile control",
    desc: "Review individual profiles, manage friends, and switch themes.",
    icon: <Lock className="h-5 w-5 text-warning" />,
  },
  {
    title: "Clean calling",
    desc: "Audio and video controls stay visible without crowding chat.",
    icon: <Video className="h-5 w-5 text-warning" />,
  },
];

const steps = [
  {
    title: "Create your profile",
    desc: "Sign up with your name, username, email, and avatar-ready profile details.",
    icon: <UserPlus className="h-5 w-5 text-warning" />,
  },
  {
    title: "Send a friend request",
    desc: "Start direct access only after the other person accepts your request.",
    icon: <Users className="h-5 w-5 text-warning" />,
  },
  {
    title: "Chat one-to-one",
    desc: "Message privately, share media, and begin audio or video calls from the same header.",
    icon: <MessageCircle className="h-5 w-5 text-warning" />,
  },
];

const details = [
  "Friend requests before chat access",
  "Audio and video call buttons inside every direct chat",
  "Image, video, and PDF sharing from the composer",
  "Light and dark themes from your profile",
];

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen app-surface text-base-content">
      <Navbar />

      <main>

        {/* HERO SECTION */}
        <section className="px-3 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">

            {/* LEFT */}
            <div>
              <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-warning/25 bg-warning/10 px-3 py-1 text-xs font-semibold text-warning sm:text-sm">
                <Sparkles className="h-4 w-4" />
                Built for everyday messaging
              </div>

              <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-base-content sm:text-5xl lg:text-6xl">
                WeChat keeps every direct conversation close, clear, and easy to continue.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-base-content/70 sm:text-lg">
                A modern chat app for private one-to-one messages, friend requests,
                media sharing, and smooth voice or video calls.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                <button
                  onClick={() => navigate("/signup")}
                  className="btn btn-primary h-12 rounded-lg px-7"
                >
                  Get Started
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-outline h-12 rounded-lg px-7"
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* RIGHT CHAT PREVIEW */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] p-2 shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:rounded-[2rem] sm:p-4">

  {/* Background Glow */}
  <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"></div>
  <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"></div>

  {/* Chat Card */}
  <div className="relative overflow-hidden rounded-xl border border-slate-700/70 bg-[#111827] sm:rounded-[1.7rem]">

    {/* Header */}
    <div className="flex items-center justify-between gap-3 border-b border-slate-700/70 bg-[#0f172a]/80 px-3 py-3 backdrop-blur-xl sm:px-5 sm:py-4">

      {/* User Info */}
      <div className="flex items-center gap-3">

        {/* Avatar */}
        <div className="relative">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg sm:h-12 sm:w-12">
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          {/* Online Dot */}
         <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#111827] bg-emerald-400"></span>
        </div>

        {/* Name */}
        <div>
          <p className="text-sm font-semibold tracking-wide text-white">
            User
          </p>

          <div className="mt-0.5 flex items-center gap-1.5">

            <p className="text-xs font-medium ">
              @username
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">

        <button
          className="
            grid h-10 w-10 place-items-center sm:h-11 sm:w-11
            rounded-full
            bg-slate-800
            text-cyan-400
            transition-all duration-300
            hover:scale-105
            hover:bg-slate-700
          "
        >
          <PhoneCall className="h-5 w-5" />
        </button>

        <button
          className="
            grid h-10 w-10 place-items-center sm:h-11 sm:w-11
            rounded-full
            bg-slate-800
            text-violet-400
            transition-all duration-300
            hover:scale-105
            hover:bg-slate-700
          "
        >
          <Video className="h-5 w-5" />
        </button>
      </div>
    </div>

    {/* Messages */}
    <div className="space-y-4 bg-[#0b1120] px-3 py-4 sm:space-y-5 sm:px-5 sm:py-6">

      {/* Incoming */}
      <div className="flex items-end gap-2">

        <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 sm:h-8 sm:w-8"></div>

        <div className="max-w-[82%] rounded-2xl rounded-bl-md bg-slate-800 px-3 py-2.5 shadow-md sm:max-w-[75%] sm:px-4 sm:py-3">
          <p className="text-sm leading-6 text-slate-200">
            Hey, are you available tonight for the final UI discussion?
          </p>

          <span className="mt-1 block text-[11px] text-slate-400">
            8:42 PM
          </span>
        </div>
      </div>

      {/* Outgoing */}
      <div className="flex justify-end">

        <div className="max-w-[82%] rounded-2xl rounded-br-md bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-2.5 shadow-lg sm:max-w-[75%] sm:px-4 sm:py-3">
          <p className="text-sm leading-6 text-white">
            Yes, send me the latest dashboard screens first.
          </p>

          <span className="mt-1 block text-[11px] text-cyan-100/80">
            8:44 PM
          </span>
        </div>
      </div>

      {/* Attachment */}
      <div className="flex justify-end">

        <div className="w-full max-w-[240px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-lg">

          <div className="h-24 bg-gradient-to-br from-slate-700 to-slate-800 sm:h-32"></div>

          <div className="p-3">
            <p className="text-sm font-medium text-slate-200">
              dashboard-preview.png
            </p>

            <p className="mt-1 text-xs text-slate-400">
              4.8 MB • Design File
            </p>
          </div>
        </div>
      </div>

      {/* Call Status */}
      <div className="flex justify-center">

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-400">
          Video call connected
        </div>
      </div>

      {/* Outgoing */}
      <div className="flex justify-end">

        <div className="max-w-[82%] rounded-2xl rounded-br-md bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-2.5 shadow-lg sm:max-w-[75%] sm:px-4 sm:py-3">
          <p className="text-sm leading-6 text-white">
            Perfect. I’ll review the animations before tomorrow’s meeting.
          </p>

          <span className="mt-1 block text-[11px] text-violet-100/80">
            8:47 PM
          </span>
        </div>
      </div>
    </div>

    {/* Input Area */}
    <div className="border-t border-slate-700 bg-[#0f172a] px-3 py-3 sm:px-4">

      <div className="flex items-center gap-2 sm:gap-3">


        {/* Input */}
        <div
          className="
            flex h-11 flex-1 items-center
            rounded-full
            bg-slate-800
            px-4 sm:px-5
            text-sm text-slate-400
          "
        >
          Type your message...
        </div>

        {/* Send */}
        <button
          className="
            grid h-11 w-11 shrink-0 place-items-center
            rounded-full
            bg-gradient-to-r from-cyan-500 to-blue-500
            text-white
            shadow-lg
            transition-all duration-300
            hover:scale-105
          "
        >
          <MessageCircle className="h-5 w-5" />
        </button>
         {/* Attach */}
        <button
          className="
            grid h-11 w-11 shrink-0 place-items-center
            rounded-full
            bg-slate-800
            text-slate-300
            transition-all duration-300
            hover:bg-slate-700
          "
        >
          <Paperclip className="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</div>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="px-3 pb-12 sm:px-6 sm:pb-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">

            {highlights.map((item) => (
              <div
                key={item.title}
                className="glass-card rounded-lg p-5 shadow-soft"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-warning/10 text-warning">
                  {item.icon}
                </div>

                <h3 className="font-semibold text-base-content">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-base-content/65">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section
          id="about"
          className="border-y border-base-300/80 bg-base-100/45 px-3 py-14 backdrop-blur sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.95fr]">

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                About WeChat
              </p>

              <h2 className="text-2xl font-extrabold leading-tight text-base-content sm:text-4xl lg:text-5xl">
                Built for private conversations that feel natural, fast, and personal.
              </h2>

              <p className="mt-6 text-base leading-8 text-base-content/70 sm:text-lg">
                WeChat is designed around one simple idea — modern communication
                should feel effortless. Instead of crowded group spaces and
                overwhelming layouts, WeChat focuses on meaningful one-to-one
                conversations with a clean and elegant interface.
              </p>

              <p className="mt-5 text-base leading-8 text-base-content/70 sm:text-lg">
                From real-time messaging and friend requests to smooth audio/video
                calls, every interaction is designed to feel lightweight,
                responsive, and easy to continue across devices.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-base-300 bg-base-100/70 p-5 shadow-sm">
                  <h3 className="font-semibold text-base-content">
                    Modern Messaging
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-base-content/60">
                    Real-time chat experience with clean layouts and fast updates.
                  </p>
                </div>

                <div className="rounded-2xl border border-base-300 bg-base-100/70 p-5 shadow-sm">
                  <h3 className="font-semibold text-base-content">
                    Private Connections
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-base-content/60">
                    Friend-request based communication keeps chats secure.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT STATS */}
            <div className="glass-card rounded-2xl p-4 shadow-soft sm:rounded-[2rem] sm:p-7">

              <div className="grid grid-cols-2 gap-3 sm:gap-4">

                {[
                  ["10K+", "Messages sent"],
                  ["1:1", "Private chats"],
                  ["99.9%", "Realtime uptime"],
                  ["24/7", "Fast communication"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-base-300 bg-base-100/65 p-4 text-center sm:rounded-2xl sm:p-6"
                  >
                    <p className="text-2xl font-extrabold text-primary sm:text-3xl">
                      {value}
                    </p>

                    <p className="mt-2 text-sm text-base-content/55">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="px-3 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">

            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Features
              </p>

              <h2 className="text-2xl font-extrabold leading-tight text-base-content sm:text-4xl lg:text-5xl">
                Everything needed for a modern real-time chat experience.
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-base-300 bg-base-100/70 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[1.7rem] sm:p-6"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10 text-warning transition-all duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>

                  <h3 className="text-lg font-bold text-base-content">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-base-content/60">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="border-y border-base-300/80 bg-base-100/35 px-3 py-14 backdrop-blur sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">

            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                How it works
              </p>

              <h2 className="text-2xl font-extrabold leading-tight text-base-content sm:text-4xl lg:text-5xl">
                Start chatting in a few simple and secure steps.
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-6 md:grid-cols-3">

              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="group glass-card rounded-2xl p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-[2rem] sm:p-7"
                >
                  <div className="mb-6 flex items-center justify-between">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10 text-warning transition-all duration-300 group-hover:scale-110">
                      {step.icon}
                    </div>

                    <span className="text-5xl font-extrabold text-base-content/10">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-base-content">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-base-content/65">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
<footer className="border-t border-base-300 bg-base-100/75 px-4 py-3 text-base-content backdrop-blur sm:px-6 lg:px-8">
  <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-1 text-center">

    {/* Brand + Credits */}
    <div className="flex items-center gap-1 text-[11px] font-medium text-base-content sm:text-sm">
      <img
        src={chatLogo}
        alt="WeChat Logo"
        className="h-3.5 w-3.5 object-contain sm:h-4 sm:w-4"
      />

      <span>
        WeChat |
      </span>

      <span className="text-base-content/70">
        Made With ❤️ By Akash Gorai
      </span>
    </div>

    {/* Copyright */}
    <p className="text-[10px] text-base-content/55 sm:text-[11px]">
      &copy; 2026 WeChat. All rights reserved.
    </p>
  </div>
</footer>
    </div>
  );
}

export default Landing;
