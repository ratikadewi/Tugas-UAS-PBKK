import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchOrders } from "@/lib/api";
import OrderWithProductModal from "./OrderWithProductModal";
import OrderItemsModal from "./OrderItemsModal";

export default function DaftarOrder() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error("Gagal fetch order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = (newData: any) => {
    // dummy entry saat tambah via modal
    const fakeId = Math.random().toString(36).substr(2, 9);
    const customerName =
      newData.customer_name ?? newData.customer?.customer_name ?? "-";
    const no_hp = newData.no_hp ?? "-";
    const tanggalOrder = newData.order_date;
    const total = newData.total_amount ?? 0;

    const newOrder = {
      id: fakeId,
      customer: { customer_name: customerName, no_hp },
      order_date: tanggalOrder,
      total_amount: total,
      orderItems: [], // kosongi dulu
    };

    setOrders((prev) => [...prev, newOrder]);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Order</h2>
        <OrderWithProductModal
          onSubmit={handleAdd}
          OrderItemsModal
          onSuccess={OrderItemsModal}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nama Customer</TableHead>
            <TableHead>No HP</TableHead>
            <TableHead>Tanggal Order</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, i) => (
            <TableRow key={order.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{order.customer?.name ?? "-"}</TableCell>
              <TableCell>{order.customer?.phone ?? "-"}</TableCell>
              <TableCell>
                {order.order_date
                  ? new Date(order.order_date).toLocaleDateString("id-ID")
                  : "-"}
              </TableCell>
              <TableCell>
                Rp {Number(order.total_amount).toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-right">
                <OrderItemsModal
                  orderId={order.id}
                  trigger={<Button variant="secondary">Lihat Barang</Button>}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
