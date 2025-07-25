"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  fetchProduct,
  updateProduct,
} from "@/lib/api";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import BarangFormModal from "./BarangFormModal";

interface Barang {
  id?: string;
  name: string;
  description: string;
  price: number;
  quantity_product: number;
  categories?: { name: string };
}

export default function BarangList() {
  const [barang, setBarang] = useState<Barang[]>([]);

  useEffect(() => {
    console.log("useEffect BarangList jalan, mulai fetchProduct");
    fetchProduct()
      .then((data) => {
        console.log("Fetched Barang (useEffect):", data);
        const normalizedData = data.map((item: any) => ({
          ...item,
          price: Number(item.price),
          quantity_product: Number(item.quantity_product),
        }));
        setBarang(normalizedData);
      })
      .catch((err) => {
        console.error("Error fetchProduct:", err);
        toast.error("Gagal mengambil data barang");
      });
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await deleteProduct(id, token);
      toast.success("Barang berhasil dihapus");
      setBarang((prev) => prev.filter((item) => item.id !== id));
      console.log(`Deleted Barang id: ${id}`);
    } catch (err) {
      toast.error("Gagal menghapus Barang");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      console.log("Updating Barang data:", data);
      await updateProduct(data.id, data, token);
      const updatedBarang = await fetchProduct();
      const normalizedData = updatedBarang.map((item: any) => ({
        ...item,
        price: Number(item.price),
        quantity_product: Number(item.quantity_product),
      }));
      setBarang(normalizedData);
      toast.success("Barang berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate Barang");
    }
  };

  const handleCreate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      console.log("Creating Barang data:", data);
      await createProduct(data, token);
      const updated = await fetchProduct();
      const normalizedData = updated.map((item: any) => ({
        ...item,
        price: Number(item.price),
        quantity_product: Number(item.quantity_product),
      }));
      setBarang(normalizedData);
      toast.success("Barang berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan Barang");
    }
  };

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Barang</h2>
        <BarangFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nama Barang</TableHead>
            <TableHead>Desc Barang</TableHead>
            <TableHead>Harga Barang</TableHead>
            <TableHead>Jumlah Barang</TableHead>
            <TableHead>Kategory</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {barang.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{formatRupiah(item.price)}</TableCell>
              <TableCell>{item.quantity_product}</TableCell>
              <TableCell>{item.categories?.name}</TableCell>
              <TableCell className="text-right space-x-2">
                <BarangFormModal
                  barang={item}
                  onSubmit={handleUpdate}
                  trigger={
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  }
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Hapus
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Yakin ingin menghapus Barang ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang
                        permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id!)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
