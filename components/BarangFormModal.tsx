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
} from "@/components/ui/select";
import { fetchCategories } from "@/lib/api"; // Ganti sesuai path function fetch kamu

interface Barang {
  id?: string;
  name: string;
  description: string;
  price: number;
  quantity_product: number;
  categories_id: string;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  barang?: Barang;
  trigger: React.ReactNode;
  onSubmit: (data: Barang) => void;
}

export default function BarangFormModal({ barang, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Barang>({
    id: barang?.id ?? "",
    name: barang?.name ?? "",
    description: barang?.description ?? "",
    price: barang?.price ?? "",
    quantity_product: barang?.quantity_product ?? "",
    categories_id: barang?.categories_id ?? "",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories(); // Ambil data kategori dari backend
        setCategories(data);
      } catch (error) {
        console.error("Gagal memuat kategori:", error);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit({
      id: barang?.id,
      name: form.name,
      description: form.description,
      price: Number(form.price),
      quantity_product: Number(form.quantity_product),
      categories_id: form.categories_id,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{barang ? "Edit Barang" : "Tambah Barang"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            name="name"
            placeholder="Nama Barang"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            name="description"
            placeholder="Deskripsi"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            name="price"
            placeholder="Harga"
            type="number"
            value={form.price}
            onChange={handleChange}
          />
          <Input
            name="quantity_product"
            placeholder="Jumlah Barang"
            type="number"
            value={form.quantity_product}
            onChange={handleChange}
          />

          <Select
            value={form.categories_id}
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, categories_id: val }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {barang ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
