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
  createStock,
  deleteStock,
  fetchStock,
  updateStock,
  restockAllProducts,
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
import StockFormModal from "./StockFormModal";

interface Stock {
  id: number;
  product_id: string;
  limit: number;
  product?: {
    name: string;
    quantity_product: number;
    price: number;
  };
}

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);

export default function StockList() {
  const [stock, setStock] = useState<Stock[]>([]);
  const [loadingRestock, setLoadingRestock] = useState(false);

  useEffect(() => {
    fetchStock().then(setStock);
  }, []);

  const handleRestock = async (stockId: number) => {
    setLoadingRestock(true);
    try {
      // Panggil API restock di sini, sesuaikan
      await restockAllProducts(); // Contoh restock semua
      const updatedStock = await fetchStock();
      setStock(updatedStock);
      toast.success("Berhasil merestok semua barang");
    } catch (err) {
      toast.error("Gagal merestok");
    } finally {
      setLoadingRestock(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteStock(id, token);
      setStock((prev) => prev.filter((u) => u.id !== id));
      toast.success("Stock berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus stock");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await updateStock(data.id, data, token);
      const updatedStock = await fetchStock();
      setStock(updatedStock);
      toast.success("Stock berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate stock");
    }
  };

  const handleCreate = async (data: { product_id: string; limit: number }) => {
    const token = localStorage.getItem("token");
    try {
      await createStock(data, token);
      const updated = await fetchStock();
      setStock(updated);
      toast.success("Stock berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan stock");
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Stock</h2>
        <StockFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Id Barang</TableHead>
            <TableHead>Nama Barang</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Harga Satuan</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stock.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.product_id}</TableCell>
              <TableCell>{item.product?.name}</TableCell>
              <TableCell>{item.product?.quantity_product}</TableCell>
              <TableCell>{formatRupiah(item.product?.price || 0)}</TableCell>
              <TableCell>{item.limit}</TableCell>
              <TableCell>
                {item.product?.quantity_product < item.limit ? (
                  <span className="text-red-600 font-semibold">
                    Out of Stock
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold">In Stock</span>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <StockFormModal
                  stock={item}
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
                        Yakin ingin menghapus stock ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang
                        permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Tombol Restock hanya jika Out of Stock */}
                {item.product?.quantity_product < item.limit && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleRestock(item.id)}
                    disabled={loadingRestock}
                  >
                    {loadingRestock ? "Merestok..." : "Restock"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
