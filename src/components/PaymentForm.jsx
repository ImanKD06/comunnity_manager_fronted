import { useState } from "react";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function PaymentForm({ initialData, neighbors = [], onSubmit, onClose }) {
  const isEditing = Boolean(initialData);
  const [form, setForm] = useState({
    neighbor_id: initialData?.neighbor_id || neighbors[0]?.id || "",
    month: initialData?.month || new Date().getMonth() + 1,
    year: initialData?.year || new Date().getFullYear(),
    amount: initialData?.amount ?? "",
    paid: initialData?.paid || false,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.neighbor_id || !form.amount) {
      setError("Vecino e importe son obligatorios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        neighbor_id: Number(form.neighbor_id),
        month: Number(form.month),
        year: Number(form.year),
        amount: Number(form.amount),
        paid: Boolean(form.paid),
      });
    } catch (err) {
      setError(err.message || "No se pudo guardar el pago.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? "Editar pago" : "Crear pago"}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error">{error}</div>}

            <div className="field">
              <label htmlFor="neighbor_id">Vecino</label>
              <select
                id="neighbor_id"
                name="neighbor_id"
                value={form.neighbor_id}
                onChange={handleChange}
              >
                {neighbors.length === 0 && <option value="">Sin vecinos</option>}
                {neighbors.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} · {n.apartment}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="month">Mes</label>
              <select id="month" name="month" value={form.month} onChange={handleChange}>
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="year">Año</label>
              <input
                id="year"
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                placeholder="2026"
              />
            </div>

            <div className="field">
              <label htmlFor="amount">Importe (€)</label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="45.00"
              />
            </div>

            <div className="field">
              <label htmlFor="paid" style={{ flexDirection: "row", display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  id="paid"
                  name="paid"
                  type="checkbox"
                  style={{ width: "auto" }}
                  checked={form.paid}
                  onChange={handleChange}
                />
                Marcar como pagado
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentForm;
