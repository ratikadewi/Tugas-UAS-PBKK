"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // pastikan sudah install lucide-react

interface Customer {
  id: number;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
}

interface Props {
  customer?: Customer;
  trigger: React.ReactNode;
  onSubmit: (data: Customer) => void;
}

export default function CustomerFormModal({
  customer,
  trigger,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<Customer>({
    name: customer?.name || "",
    email: customer?.email || "",
    password: customer?.password || "",
    address: customer?.address || "",
    phone: customer?.phone || "",
    id: customer?.id || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {customer ? "Edit Customer" : "Tambah Customer"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            name="name"
            placeholder="Nama"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            name="address"
            placeholder="Alamat"
            value={form.address}
            onChange={handleChange}
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Input
            name="phone"
            placeholder="No Handphone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {customer ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
