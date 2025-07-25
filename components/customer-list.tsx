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
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  updateCustomer,
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
import CustomerFormModal from "./CustomerFormModal";

interface Customer {
  id: number;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
}

export default function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetchCustomers().then(setCustomers);
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteCustomer(id, token);
      setCustomers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Customers berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus Customers");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await updateCustomer(data.id, data, token);
      const updatedCustomers = await fetchCustomers();
      setCustomers(updatedCustomers);
      toast.success("Customer berhasil diupdate");
    } catch (err: any) {
      try {
        const errorData = await err.response.json(); // jika pakai fetch biasa
        const noHpError = errorData?.errors?.phone?.[0];

        if (noHpError?.includes("has already been taken")) {
          toast.info("Nomor handphone sudah terdaftar.");
        } else {
          toast.error("Gagal mengupdate Customers");
        }
      } catch (e) {
        toast.error("Gagal mengupdate Customers");
      }
    }
  };

  const handleCreate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await createCustomer(data);
      const updated = await fetchCustomers();
      setCustomers(updated);
      toast.success("Customers berhasil ditambahkan");
    } catch (err: any) {
      try {
        // Ambil error detail dari response JSON
        const errorData = await err.response.json();
        console.log("Error detail dari API:", errorData); // <-- ini lognya

        const noHpError = errorData?.errors?.phone?.[0];

        if (noHpError?.includes("has already been taken")) {
          toast.info("Nomor handphone sudah terdaftar.");
        } else {
          toast.error("Gagal menambahkan Customers");
        }
      } catch {
        toast.error("Gagal menambahkan Customers");
      }
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Customer</h2>
        <CustomerFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nama Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>No hp</TableHead>
            <TableHead>Password</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer, index) => (
            <TableRow key={customer.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>........</TableCell>
              <TableCell className="text-right space-x-2">
                <CustomerFormModal
                  customer={customer}
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
                        Yakin ingin menghapus Customers ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang
                        permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(customer.id)}
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
