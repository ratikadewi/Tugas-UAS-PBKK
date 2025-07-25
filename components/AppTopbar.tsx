"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/lib/api";

export default function AppTopbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Anda belum login");
        router.push("/login");
        return;
      }

      await logout(token);
      toast.success("Logout berhasil");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      toast.error("Gagal logout");
    }
  };

  return (
    <header className="flex justify-between items-center bg-gradient-to-r from-[#f57224] to-[#92278f] shadow px-6 py-3 sticky top-0 z-30">
      {/* Logo + Brand */}
      <div className="flex items-center space-x-3">
        <span className="font-bold text-xl text-white select-none">
        </span>
      </div>

      {/* User Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="focus:outline-none rounded-full hover:bg-white/10 p-2 transition border-2 border-white"
          aria-label="User menu"
        >
          {/* User Icon */}
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 9a7 7 0 0114 0H5z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-40">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
