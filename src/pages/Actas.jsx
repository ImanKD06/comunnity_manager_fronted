import { useEffect, useState } from "react";
import { actasApi, communitiesApi } from "../services/api";
import ActaForm from "../components/ActaForm";

function Actas() {
  const [actas, setActas] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingActa, setEditingActa] = useState(null);
  const [viewingActa, setViewingActa] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [actasData, communitiesData] = await Promise.all([
        actasApi.list(),
        communitiesApi.list(),
      ]);
      setActas(actasData);
      setCommunities(communitiesData);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las actas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const communityName = (id) =>
    communities.find((c) => c.id === id)?.name || "—";

  const openCreate = () => {
    setEditingActa(null);
    setModalOpen(true);
  };

  const openEdit = (acta) => {
    setEditingActa(acta);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (form) => {
    if (editingActa) {
      await actasApi.update(editingActa.id, form);
    } else {
      await actasApi.create(form);
    }
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async (acta) => {
    if (!window.confirm(`¿Eliminar el acta "${acta.title}"?`)) return;
    try {
      await actasApi.remove(acta.id);
      loadData();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el acta.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Actas</span>
          <h1>Actas de reunión</h1>
          <p>Redacta y consulta las actas de las juntas de vecinos.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openCreate}
          disabled={communities.length === 0}
        >
          + Crear acta
        </button>
      </div>

      {error && <div className="banner-error">{error}</div>}
      {!loading && communities.length === 0 && (
        <div className="banner-error">
          Crea primero una comunidad para poder registrar actas.
        </div>
      )}

      <div className="panel">
        <div className="table-toolbar">
          <h3>Listado de actas</h3>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-state">Cargando actas...</div>
          ) : actas.length === 0 ? (
            <div className="empty-state">
              Todavía no hay actas registradas.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Fecha de reunión</th>
                  <th>Comunidad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {actas.map((acta) => (
                  <tr key={acta.id}>
                    <td>{acta.title}</td>
                    <td>{acta.meeting_date?.slice(0, 10)}</td>
                    <td>{communityName(acta.community_id)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setViewingActa(acta)}
                        >
                          Ver
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEdit(acta)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(acta)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <ActaForm
          initialData={editingActa}
          communities={communities}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}

      {viewingActa && (
        <div className="modal-overlay" onClick={() => setViewingActa(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{viewingActa.title}</h3>
              <button className="modal-close" onClick={() => setViewingActa(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-muted)" }}>
                {viewingActa.meeting_date?.slice(0, 10)} · {communityName(viewingActa.community_id)}
              </p>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "var(--font-body)",
                  fontSize: 13.5,
                  background: "var(--color-bg-soft)",
                  padding: 14,
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  margin: 0,
                }}
              >
                {viewingActa.content || "Sin contenido generado todavía."}
              </pre>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setViewingActa(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Actas;
