import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";

interface Appointment {
  _id: string;
  clientEmail: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  amount: number;
  description: string;
}

const STATUS_COLORS = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  cancelled: "bg-gray-500/20 text-gray-400",
  completed: "bg-green-500/20 text-green-400",
};

export function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<{
    clientEmail: string;
    date: string;
    time: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    amount: number;
    description: string;
  }>({
    clientEmail: "",
    date: "",
    time: "",
    status: "pending",
    amount: 0,
    description: "",
  });

  const fetchAppointments = async () => {
    try {
      const response = await api.get<{ appointments: Appointment[] }>("/appointments");
      setAppointments(response.appointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpenModal = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        clientEmail: appointment.clientEmail,
        date: appointment.date.split("T")[0],
        time: appointment.time,
        status: appointment.status,
        amount: appointment.amount,
        description: appointment.description,
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        clientEmail: "",
        date: "",
        time: "",
        status: "pending",
        amount: 0,
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (editingAppointment) {
        await api.put(`/appointments/${editingAppointment._id}`, formData);
      } else {
        await api.post("/appointments", formData);
      }
      await fetchAppointments();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save appointment:", error);
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await api.delete(`/appointments/${appointmentId}`);
      await fetchAppointments();
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-3xl font-bold text-gradient">Schedule</h1>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gradient">Schedule</h1>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-cardinal px-4 py-2 text-foreground transition-colors hover:bg-cardinal-light"
        >
          <Plus size={20} />
          New Appointment
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Client</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No appointments yet
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr key={appointment._id} className="border-b border-border">
                  <td className="px-4 py-3">{appointment.clientEmail}</td>
                  <td className="px-4 py-3">{new Date(appointment.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{appointment.time}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        STATUS_COLORS[appointment.status],
                      )}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">${appointment.amount}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(appointment)}
                        className="rounded p-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(appointment._id)}
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
                {editingAppointment ? "Edit Appointment" : "New Appointment"}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm text-muted">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(event) => setFormData({ ...formData, date: event.target.value })}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-cardinal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-muted">Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(event) => setFormData({ ...formData, time: event.target.value })}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-cardinal focus:outline-none"
                  />
                </div>
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
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
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
                <label className="mb-2 block text-sm text-muted">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({ ...formData, description: event.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-cardinal focus:outline-none"
                  rows={3}
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
                  {editingAppointment ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
