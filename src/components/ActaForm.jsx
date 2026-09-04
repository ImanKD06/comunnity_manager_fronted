import { useState } from "react";
import { actasApi, aiApi } from "../services/api";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function ActaForm({ initialData, communities = [], onSubmit, onClose }) {
  const isEditing = Boolean(initialData);
  const [form, setForm] = useState({
    title: initialData?.title || "",
    meeting_date: initialData?.meeting_date
      ? initialData.meeting_date.slice(0, 10)
      : todayIso(),
    attendees: initialData?.attendees || "",
    topics: initialData?.topics || "",
    agreements: initialData?.agreements || "",
    content: initialData?.content || "",
    community_id: initialData?.community_id || communities[0]?.id || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!form.title.trim()) {
      setError("Añade un título antes de generar el contenido.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const result = await actasApi.generate({
        title: form.title,
        meeting_date: form.meeting_date,
        attendees: form.attendees,
        topics: form.topics,
        agreements: form.agreements,
        content: form.content,
        community_id: Number(form.community_id) || 0,
      });
      setForm((prev) => ({ ...prev, content: result.content || result.acta || "" }));
    } catch (err) {
      setError(err.message || "No se pudo generar el contenido.");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateWithAi = async () => {
    if (!form.title.trim()) {
      setError("Añade un título antes de generar el contenido con IA.");
      return;
    }
    setGeneratingAi(true);
    setError("");
    try {
      // Encuentra el nombre de la comunidad seleccionada para dárselo a la IA
      const selectedCommunity = communities.find(
        (c) => String(c.id) === String(form.community_id)
      );

      const result = await aiApi.generateMinute({
        title: form.title,
        meeting_date: form.meeting_date,
        attendees: form.attendees,
        topics: form.topics,
        agreements: form.agreements,
        community_name: selectedCommunity ? selectedCommunity.name : "",
      });

      // Mapeamos tanto "acta" como "content" por flexibilidad
      const generatedContent = result.acta || result.content || "";
      setForm((prev) => ({ ...prev, content: generatedContent }));
    } catch (err) {
      setError(
        err.message ||
          "No se pudo generar el acta con IA. Comprueba la conexión con el servidor."
      );
    } finally {
      setGeneratingAi(false);
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
      setError(err.message || "No se pudo guardar el acta.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? "Editar acta" : "Crear acta"}</h3>
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
                placeholder="Junta ordinaria anual"
                autoFocus
              />
            </div>

            <div className="field">
              <label htmlFor="meeting_date">Fecha de la reunión</label>
              <input
                id="meeting_date"
                name="meeting_date"
                type="date"
                value={form.meeting_date}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="attendees">Asistentes</label>
              <input
                id="attendees"
                name="attendees"
                value={form.attendees}
                onChange={handleChange}
                placeholder="Presidente, secretario, 5 vecinos..."
              />
            </div>

            <div className="field">
              <label htmlFor="topics">Temas tratados</label>
              <input
                id="topics"
                name="topics"
                value={form.topics}
                onChange={handleChange}
                placeholder="Presupuesto anual, reparación fachada..."
              />
            </div>

            <div className="field">
              <label htmlFor="agreements">Acuerdos</label>
              <input
                id="agreements"
                name="agreements"
                value={form.agreements}
                onChange={handleChange}
                placeholder="Aprobado presupuesto por unanimidad..."
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

            <div className="field">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justify: "space-between",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <label htmlFor="content" style={{ margin: 0 }}>
                  Contenido del acta
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={handleGenerate}
                    disabled={generating || generatingAi}
                  >
                    {generating ? "Generando..." : "Plantilla rápida"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleGenerateWithAi}
                    disabled={generating || generatingAi}
                  >
                    {generatingAi ? "Generando con IA..." : "✨ Generar con IA"}
                  </button>
                </div>
              </div>
              <textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="El contenido del acta se puede generar automáticamente (plantilla o IA) o escribir a mano"
                rows={7}
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
                "Generar con IA" redacta un acta formal completa usando Gemini.
              </span>
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

export default ActaForm;
