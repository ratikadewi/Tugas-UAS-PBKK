"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { fetchOrderItems } from "@/lib/api";

type Props = {
  orderId?: string;
  trigger: React.ReactNode;
};

export default function OrderItemsModal(
  { orderId, trigger }: Props = { trigger: null }
) {
  // Jika orderId belum ada, jangan render modal
  if (!orderId) return null;

  const [details, setDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchOrderItems(orderId);
      setDetails(data);
    } catch (err) {
      console.error("Gagal fetch order items:", err);
    } finally {
      setLoading(false);
    }
  };

  const total = details.reduce((sum, item) => {
    const price = item.product?.price ?? 0;
    return sum + price * (item.quantity ?? 0);
  }, 0);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) loadDetails();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Barang dalam Order</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>Loading...</p>
        ) : details.length === 0 ? (
          <p className="text-muted-foreground">Tidak ada item.</p>
        ) : (
          <>
            <table className="w-full text-sm mt-4 border rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Nama Produk</th>
                  <th className="text-left p-2">Jumlah</th>
                  <th className="text-left p-2">Harga</th>
                  <th className="text-left p-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {details.map((item, index) => {
                  const product = item.product ?? {};
                  const name = product.name ?? "-";
                  const price = product.price ?? 0;
                  const quantity = item.quantity ?? 0;
                  const subtotal = price * quantity;

                  return (
                    <tr key={index} className="border-t">
                      <td className="p-2">{name}</td>
                      <td className="p-2">{quantity}</td>
                      <td className="p-2">
                        Rp {price.toLocaleString("id-ID")}
                      </td>
                      <td className="p-2">
                        Rp {subtotal.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-end mt-4 pr-2 text-lg font-semibold">
              Total: Rp {total.toLocaleString("id-ID")}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
