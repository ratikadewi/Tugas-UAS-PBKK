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
  createCategories,
  deleteCategories,
  fetchCategories,
  updateCategories,
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
import CategoryFromModal from "./CategoriesFormModal";

interface Categories {
  id: number;
  name: string;
  description: string;
}

export default function CategoriesList() {
  const [categories, setCategories] = useState<Categories[]>([]);

  useEffect(() => {
    fetchCategories().then((data) => {
      console.log("Fetched Kategori:", data);
      setCategories(data);
    });
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteCategories(id, token);
      toast.success("Kategori berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus Kategori");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      console.log(data);
      await updateCategories(data.id, data, token);
      const updateCategory = await fetchCategories();
      setCategories(updateCategory);

      toast.success("Kategori berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate Kategori");
    }
  };

  const handleCreate = async (data: { id_barang: string; limit: number }) => {
    const token = localStorage.getItem("token");
    try {
      await createCategories(data, token);
      const updated = await fetchCategories();
      setCategories(updated);
      toast.success("Kategori berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan Kategori");
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Kategori</h2>
        <CategoryFromModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nama Kategori</TableHead>
            <TableHead>Desc</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((categories, index) => (
            <TableRow key={categories.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{categories.name}</TableCell>
              <TableCell>{categories.description}</TableCell>
              <TableCell className="text-right space-x-2">
                <CategoryFromModal
                  categories={categories}
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
                        Yakin ingin menghapus categories ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang
                        permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(categories.id)}
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
