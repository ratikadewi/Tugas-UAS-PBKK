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
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { fetchCategories } from "@/lib/api";

interface Categories {
  id?: string;
  name: string;
  description: string;
}

interface Props {
  categories?: Categories;
  trigger: React.ReactNode;
  onSubmit: (data: Categories) => void;
}

export default function CategoriesFormModal({
  categories,
  trigger,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: categories?.name ?? "",
    description: categories?.description ?? "",
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
            {categories ? "Edit Categories" : "Tambah Categories"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            name="name"
            placeholder="Nama Kategori"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            name="description"
            placeholder="description Kategori"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {categories ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
