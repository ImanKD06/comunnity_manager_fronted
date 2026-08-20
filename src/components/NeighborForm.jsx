import { useState } from "react";

function NeighborForm({ initialData, communities = [], onSubmit, onClose }) {
  const isEditing = Boolean(initialData);
  const [form, setForm] = useState({
    name: initialData?.name || "",
    apartment: initialData?.apartment || "",
    phone: initialData?.phone || "",
    community_id: initialData?.community_id || communities[0]?.id || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.apartment.trim() || !form.community_id) {
      setError("Nombre, apartamento y comunidad son obligatorios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({ ...form, community_id: Number(form.community_id) });
    } catch (err) {
      setError(err.message || "No se pudo guardar el vecino.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? "Editar vecino" : "Crear vecino"}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error">{error}</div>}

            <div className="field">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ana García"
                autoFocus
              />
            </div>

            <div className="field">
              <label htmlFor="apartment">Apartamento</label>
              <input
                id="apartment"
                name="apartment"
                value={form.apartment}
                onChange={handleChange}
                placeholder="3ºB"
              />
            </div>

            <div className="field">
              <label htmlFor="phone">Teléfono</label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="600 111 222"
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

export default NeighborForm;
