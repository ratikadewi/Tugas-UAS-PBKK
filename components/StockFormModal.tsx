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
import { fetchProduct } from "@/lib/api";

interface Stock {
  id?: string;
  product_id: string;
  limit: number;
}

interface Props {
  stock?: Stock;
  trigger: React.ReactNode;
  onSubmit: (data: Stock) => void;
}

export default function StockFormModal({ stock, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    product_id: stock?.product_id ?? "",
    limit: stock?.limit ?? 0,
  });
  const [value, setValue] = useState("");
  const [productList, setProductList] = useState([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit({
      id: stock?.id, // <- pastikan ID ini dikirim
      product_id: form.product_id,
      limit: form.limit,
    });
    setOpen(false);
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProduct();
        setProductList(data);
      } catch (err) {
        console.error("Error fetching barang:", err);
      }
    };

    loadProduct();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{stock ? "Edit Stock" : "Tambah Stock"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Select
            value={form.product_id ?? ""}
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, product_id: val }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Barang" />
            </SelectTrigger>
            <SelectContent>
              {productList.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="product_id" value={value} />

          <Input
            name="limit"
            placeholder="Jumlah"
            value={form.limit}
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {stock ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
