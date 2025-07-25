"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  createOrders,
  fetchCustomers,
  fetchProduct,
  saveOrderItems,
  updateOrderTotal,
} from "@/lib/api";
import OrderItemsModal from "@/components/OrderItemsModal";

export default function OrderWithProductModal({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orderDate, setOrderDate] = useState("");
  const [productList, setProductList] = useState<
    { id: string; name: string; quantity: number }[]
  >([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | undefined>(
    undefined
  );
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setOrderDate(today);

    const fetchData = async () => {
      try {
        const [custRes, productRes] = await Promise.all([
          fetchCustomers(),
          fetchProduct(),
        ]);

        setCustomers(custRes);
        setProducts(productRes);

        if (custRes.length > 0) {
          setSelectedCustomer(custRes[0].id);
        }

        const initialProductList = productRes.map((b: any) => ({
          id: b.id,
          name: b.name,
          quantity: 0, // jumlah yang dibeli
        }));

        setProductList(initialProductList);
      } catch (err) {
        toast.error("Gagal mengambil data");
      }
    };

    fetchData();
  }, []);

  const handleCreateOrder = async () => {
    if (!selectedCustomer) {
      toast.error("Pilih customer terlebih dahulu");
      return;
    }

    try {
      const payload = {
        customer_id: selectedCustomer,
        order_date: orderDate,
        total_amount: 0,
        status: "pending",
      };

      const res = await createOrders(payload);
      const createdOrderId = res?.data?.id;
      if (!createdOrderId) {
        toast.error("Gagal mendapatkan ID order dari server.");
        return;
      }

      setOrderId(createdOrderId);
      setOrderCreated(true);
      toast.success("Order berhasil dibuat");
    } catch (error) {
      toast.error("Gagal membuat order");
      console.error("Gagal membuat order:", error);
    }
  };

  const handleSaveOrderDetails = async () => {
    if (!orderId) {
      toast.error("Order belum dibuat. Klik 'Buat Order' terlebih dahulu.");
      return;
    }

    // Validasi jumlah tidak melebihi stok
    const invalidItems = productList.filter((item) => {
      const productData = products.find((p) => p.id === item.id);
      return item.quantity > (productData?.quantity_product ?? 0);
    });

    if (invalidItems.length > 0) {
      const names = invalidItems
        .map((item) => {
          const product = products.find((p) => p.id === item.id);
          return product?.name || "Barang tidak dikenal";
        })
        .join(", ");
      toast.info(`Jumlah pesanan melebihi stok untuk: ${names}`);
      return;
    }

    const itemsToSave = productList
      .filter((b) => b.quantity > 0)
      .map((b) => ({
        product_id: b.id,
        quantity: b.quantity,
      }));

    if (itemsToSave.length === 0) {
      toast.error("Minimal satu barang harus memiliki jumlah > 0");
      return;
    }

    try {
      await saveOrderItems(orderId, itemsToSave);

      const totalHarga = productList.reduce((sum, item) => {
        const harga = products.find((b) => b.id === item.id)?.price ?? 0;
        return sum + harga * item.quantity;
      }, 0);

      await updateOrderTotal(orderId, totalHarga);

      toast.success("Order details dan total berhasil disimpan");
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Gagal simpan order detail:", err);
      toast.error(err?.message || "Gagal menyimpan order detail");
    }
  };

  const total = productList.reduce((sum, item) => {
    const harga = products.find((b) => b.id === item.id)?.price ?? 0;
    return sum + harga * item.quantity;
  }, 0);

  const handleJumlahChange = (index: number, jumlah: number) => {
    setProductList((prev) => {
      const updated = [...prev];
      updated[index].quantity = jumlah;
      return updated;
    });
  };

  const handleTambahBarisBarang = () => {
    setProductList((prev) => [...prev, { id: "", name: "", quantity: 0 }]);
  };

  const handlePilihBarang = (index: number, barangId: string) => {
    const barang = products.find((b) => b.id === barangId);
    if (!barang) return;

    setProductList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        id: barang.id,
        name: barang.name,
      };
      return updated;
    });
  };

  const handleHapusBarisBarang = (index: number) => {
    setProductList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tambah Order</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Form Order</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Customer Selection */}
          <div className="grid gap-2">
            <Label>Customer</Label>
            <div className="flex gap-2 items-end">
              <Select
                value={selectedCustomer}
                onValueChange={(val) => setSelectedCustomer(val)}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Pilih Customer" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={handleCreateOrder}
                disabled={!selectedCustomer}
              >
                Buat Order
              </Button>
            </div>
          </div>

          {/* Order Date */}
          <div className="grid gap-2">
            <Label>Tanggal Order</Label>
            <Input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-64"
            />
          </div>

          {/* Produk List */}
          {orderCreated && (
            <div className="grid gap-2">
              <div className="flex justify-between items-center mb-2">
                <Button variant="outline" onClick={handleTambahBarisBarang}>
                  + Tambah Barang
                </Button>
              </div>

              <div className="overflow-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Nama Barang</th>
                      <th className="p-2 text-left">Stok</th>
                      <th className="p-2 text-left">Harga</th>
                      <th className="p-2 text-left">Jumlah</th>
                      <th className="p-2 text-left">Subtotal</th>
                      <th className="p-2 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map((product, index) => {
                      const selected = products.find(
                        (b) => b.id === product.id
                      );
                      const harga = selected?.price ?? 0;
                      const stok = selected?.quantity_product ?? 0;
                      const subtotal = harga * product.quantity;

                      return (
                        <tr key={index} className="border-t">
                          <td className="p-2">
                            <Select
                              value={product.id}
                              onValueChange={(val) =>
                                handlePilihBarang(index, val)
                              }
                            >
                              <SelectTrigger className="w-64">
                                <SelectValue placeholder="Pilih Barang" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((b) => (
                                  <SelectItem key={b.id} value={b.id}>
                                    {b.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-2">{stok}</td>
                          <td className="p-2">
                            Rp {harga.toLocaleString("id-ID")}
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={product.quantity}
                              min={0}
                              onChange={(e) =>
                                handleJumlahChange(
                                  index,
                                  Number(e.target.value)
                                )
                              }
                              className="w-24"
                            />
                          </td>
                          <td className="p-2">
                            Rp {subtotal.toLocaleString("id-ID")}
                          </td>
                          <td className="p-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleHapusBarisBarang(index)}
                            >
                              Hapus
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="text-right mt-4 font-semibold text-lg pr-2">
                Total: Rp {total.toLocaleString("id-ID")}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={handleSaveOrderDetails} variant="primary">
                  Simpan Detail Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
