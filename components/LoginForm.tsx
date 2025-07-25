"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login } from "@/lib/api";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login(username, password);

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        toast.success("Login berhasil!");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        toast.error("Login gagal", {
          description: "Token tidak ditemukan.",
        });
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Terjadi kesalahan saat login.";
      toast.error("Login gagal", {
        description: msg,
      });
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-screen bg-[#f5f5f5] px-4",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md shadow-lg mx-auto border border-gray-200">
        <CardHeader className="flex flex-col items-center pt-8 pb-2">
          {/* Logo Lazada */}
          <img
            src="/logo.png" // Pastikan kamu punya file ini di public folder
            alt="Lazada Logo"
            className="w-28 h-auto mb-4"
          />
          <CardTitle className="text-xl font-bold text-[#161823]">
            Masuk ke akun Anda
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-1 text-center">
            Belanja mudah dan cepat bersama Lazada
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 pb-6 px-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Kata Sandi</Label>
                <a href="#" className="text-sm text-[#f57224] hover:underline">
                  Lupa?
                </a>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? (
                  // icon mata terbuka
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17.94 17.94A10 10 0 0 1 6.06 6.06" />
                    <path d="M1 1l22 22" />
                    <path d="M10.59 10.59a3 3 0 0 0 4.24 4.24" />
                    <path d="M12 5c7 0 9 7 9 7s-2 7-9 7a9.96 9.96 0 0 1-5.64-1.8" />
                  </svg>
                ) : (
                  // icon mata tertutup
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#f57224] hover:bg-[#e65c10] text-white font-semibold"
            >
              Masuk
            </Button>
          </form>

          <p className="text-center text-sm mt-6">
            Pengguna baru?{" "}
            <a href="#" className="text-[#f57224] hover:underline">
              Daftar Sekarang
            </a>
          </p>

          <div className="text-center text-xs text-gray-400 mt-6">
            <p>
              Dengan login, Anda menyetujui{" "}
              <a href="#" className="underline underline-offset-4">
                Syarat & Ketentuan
              </a>{" "}
              dan{" "}
              <a href="#" className="underline underline-offset-4">
                Kebijakan Privasi
              </a>{" "}
              Lazada.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
