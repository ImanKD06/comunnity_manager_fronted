import { useState } from "react";
import { aiApi } from "../services/api";

const STATUS_OPTIONS = ["Abierta", "En progreso", "Resuelta", "Cerrada"];
const PRIORITY_OPTIONS = ["Baja", "Media", "Alta", "Urgente"];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function IncidentForm({ initialData, communities = [], onSubmit, onClose }) {
  const isEditing = Boolean(initialData);
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || STATUS_OPTIONS[0],
    priority: initialData?.priority || PRIORITY_OPTIONS[1],
    created_at: initialData?.created_at
      ? initialData.created_at.slice(0, 10)
      : todayIso(),
    community_id: initialData?.community_id || communities[0]?.id || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleAnalyzeWithAi = async () => {
    if (!form.description.trim()) {
      setError("Escribe una descripción antes de analizar con IA.");
      return;
    }
    setAnalyzing(true);
    setError("");
    setAiResult(null);
    try {
// En tu IncidentForm.jsx
const result = await aiApi.analyzeIncident(form.description);

// Extraes la propiedad 'analisis' que envía el backend
const data = result.analisis || result;

setAiResult({
  category: data.categoria || data.category || "General",
  priority: data.prioridad || data.priority || "Media",
  recommendation: data.recomendacion || data.recommendation || ""
});
    } catch (err) {
      setError(
        err.message ||
          "No se pudo analizar la incidencia con IA. Comprueba la conexión con el servidor."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const applyAiPriority = () => {
    if (!aiResult) return;
    
    // Si la prioridad sugerida coincide con tus opciones ("Baja", "Media", "Alta", "Urgente"), se aplica
    if (PRIORITY_OPTIONS.includes(aiResult.priority)) {
      setForm((prevForm) => ({ ...prevForm, priority: aiResult.priority }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.community_id) {
      setError("Título y comunidad son obligatorios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        ...form,
        community_id: Number(form.community_id),
      });
    } catch (err) {
      setError(err.message || "No se pudo guardar la incidencia.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? "Editar incidencia" : "Crear incidencia"}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error">{error}</div>}

            <div className="field">
              <label htmlFor="title">Título</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Fuga de agua en el garaje"
                autoFocus
              />
            </div>

            <div className="field">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label htmlFor="description" style={{ margin: 0 }}>
                  Descripción
                </label>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleAnalyzeWithAi}
                  disabled={analyzing}
                >
                  {analyzing ? "Analizando..." : " Analizar con IA"}
                </button>
              </div>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe la incidencia con el mayor detalle posible..."
                rows={4}
                style={{
                  border: "1px solid var(--color-border-strong)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 12px",
                  fontSize: "13.5px",
                  fontFamily: "var(--font-body)",
                  resize: "vertical",
                }}
              />
              <span style={{ fontSize: 12, color: "var(--color-text-soft)" }}>
                La IA sugiere categoría, prioridad y una recomendación.
              </span>
            </div>

            {aiResult && (
              <div
                style={{
                  background: "var(--color-primary-light)",
                  border: "1px solid var(--color-border-strong)",
                  borderRadius: "var(--radius-sm)",
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="badge badge-paid">Categoría: {aiResult.category}</span>
                  <span className="badge badge-pending">Prioridad IA: {aiResult.priority}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "var(--color-text)", whiteSpace: "pre-wrap" }}>
                  {aiResult.recommendation}
                </p>
                {PRIORITY_OPTIONS.includes(aiResult.priority) && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={applyAiPriority}
                    style={{ alignSelf: "flex-start" }}
                  >
                    Usar esta prioridad
                  </button>
                )}
              </div>
            )}

            <div className="field">
              <label htmlFor="status">Estado</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="priority">Prioridad</label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="created_at">Fecha</label>
              <input
                id="created_at"
                name="created_at"
                type="date"
                value={form.created_at}
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

export default IncidentForm;
