import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";

interface Payment {
  _id: string;
  appointmentId?: string;
  clientEmail: string;
  amount: number;
  status: "pending" | "paid" | "cancelled" | "refunded";
  createdAt: string;
}

const STATUS_COLORS = {
  pending: "bg-yellow-500/20 text-yellow-400",
  paid: "bg-green-500/20 text-green-400",
  cancelled: "bg-gray-500/20 text-gray-400",
  refunded: "bg-red-500/20 text-red-400",
};

export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [formData, setFormData] = useState<{
    clientEmail: string;
    amount: number;
    status: "pending" | "paid" | "cancelled" | "refunded";
    appointmentId: string;
  }>({
    clientEmail: "",
    amount: 0,
    status: "pending",
    appointmentId: "",
  });

  const fetchPayments = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : undefined;
      const response = await api.get<{ payments: Payment[] }>("/payments", params);
      setPayments(response.payments);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const handleOpenModal = (payment?: Payment) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        clientEmail: payment.clientEmail,
        amount: payment.amount,
        status: payment.status,
        appointmentId: payment.appointmentId ?? "",
      });
    } else {
      setEditingPayment(null);
      setFormData({
        clientEmail: "",
        amount: 0,
        status: "pending",
        appointmentId: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPayment(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (editingPayment) {
        await api.put(`/payments/${editingPayment._id}`, {
          amount: formData.amount,
          status: formData.status,
        });
      } else {
        await api.post("/payments", formData);
      }
      await fetchPayments();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save payment:", error);
    }
  };

  const handleDelete = async (paymentId: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;

    try {
      await api.delete(`/payments/${paymentId}`);
      await fetchPayments();
    } catch (error) {
      console.error("Failed to delete payment:", error);
    }
  };

  const handleStatusChange = async (paymentId: string, newStatus: Payment["status"]) => {
    try {
      await api.put(`/payments/${paymentId}`, { status: newStatus });
      await fetchPayments();
    } catch (error) {
      console.error("Failed to update payment status:", error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-3xl font-bold text-gradient">Payments</h1>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gradient">Payments</h1>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-cardinal px-4 py-2 text-foreground transition-colors hover:bg-cardinal-light"
        >
          <Plus size={20} />
          New Payment
        </button>
      </div>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-foreground focus:border-cardinal focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Client</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No payments yet
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment._id} className="border-b border-border">
                  <td className="px-4 py-3">{payment.clientEmail}</td>
                  <td className="px-4 py-3">${payment.amount}</td>
                  <td className="px-4 py-3">
                    <select
                      value={payment.status}
                      onChange={(event) =>
                        handleStatusChange(payment._id, event.target.value as Payment["status"])
                      }
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        STATUS_COLORS[payment.status],
                      )}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(payment)}
                        className="rounded p-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(payment._id)}
                        className="rounded p-2 text-muted transition-colors hover:bg-cardinal hover:text-foreground"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="glass w-full max-w-md rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingPayment ? "Edit Payment" : "New Payment"}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded p-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-muted">Client Email</label>
                <input
                  type="email"
                  required
                  value={formData.clientEmail}
                  onChange={(event) =>
                    setFormData({ ...formData, clientEmail: event.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-cardinal focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-muted">Amount</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(event) =>
                    setFormData({ ...formData, amount: Number(event.target.value) })
                  }
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-cardinal focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-muted">Status</label>
                <select
                  value={formData.status}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      status: event.target.value as typeof formData.status,
                    })
                  }
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-cardinal focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-muted">Appointment ID (optional)</label>
                <input
                  type="text"
                  value={formData.appointmentId}
                  onChange={(event) =>
                    setFormData({ ...formData, appointmentId: event.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-cardinal focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 rounded-lg border border-border px-4 py-3 text-foreground transition-colors hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-cardinal px-4 py-3 font-semibold text-foreground transition-colors hover:bg-cardinal-light"
                >
                  {editingPayment ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
