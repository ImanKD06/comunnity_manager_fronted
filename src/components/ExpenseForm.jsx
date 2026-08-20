import { useState } from "react";

function ExpenseForm({ initialData, communities = [], onSubmit, onClose }) {
  const isEditing = Boolean(initialData);
  const [form, setForm] = useState({
    description: initialData?.description || "",
    amount: initialData?.amount ?? "",
    date: initialData?.date || new Date().toISOString().slice(0, 10),
    community_id: initialData?.community_id || communities[0]?.id || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim() || !form.amount || !form.date || !form.community_id) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        ...form,
        amount: Number(form.amount),
        community_id: Number(form.community_id),
      });
    } catch (err) {
      setError(err.message || "No se pudo guardar el gasto.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? "Editar gasto" : "Crear gasto"}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error">{error}</div>}

            <div className="field">
              <label htmlFor="description">Descripción</label>
              <input
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Reparación ascensor"
                autoFocus
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
                placeholder="320.00"
              />
            </div>

            <div className="field">
              <label htmlFor="date">Fecha</label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="community_id">Comunidad</label>
              <select
                id="community_id"
                name="community_id"
                value={form.community_id}
                onChange={handleChange}
              >
                {communities.length === 0 && <option value="">Sin comunidades</option>}
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
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

export default ExpenseForm;
