import { useEffect, useState } from "react";
import { incidentsApi, communitiesApi } from "../services/api";
import IncidentForm from "../components/IncidentForm";

const STATUS_BADGE = {
  Abierta: "badge-pending",
  "En progreso": "badge-pending",
  Resuelta: "badge-paid",
  Cerrada: "badge-paid",
};

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [incidentsData, communitiesData] = await Promise.all([
        incidentsApi.list(),
        communitiesApi.list(),
      ]);
      setIncidents(incidentsData);
      setCommunities(communitiesData);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las incidencias.");
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
    setEditingIncident(null);
    setModalOpen(true);
  };

  const openEdit = (incident) => {
    setEditingIncident(incident);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (form) => {
    if (editingIncident) {
      await incidentsApi.update(editingIncident.id, form);
    } else {
      await incidentsApi.create(form);
    }
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async (incident) => {
    if (!window.confirm(`¿Eliminar la incidencia "${incident.title}"?`)) return;
    try {
      await incidentsApi.remove(incident.id);
      loadData();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la incidencia.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Incidents</span>
          <h1>Incidencias</h1>
          <p>Reporta y haz seguimiento de incidencias por comunidad.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openCreate}
          disabled={communities.length === 0}
        >
          + Crear incidencia
        </button>
      </div>

      {error && <div className="banner-error">{error}</div>}
      {!loading && communities.length === 0 && (
        <div className="banner-error">
          Crea primero una comunidad para poder registrar incidencias.
        </div>
      )}

      <div className="panel">
        <div className="table-toolbar">
          <h3>Listado de incidencias</h3>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-state">Cargando incidencias...</div>
          ) : incidents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⚠️</div>
              Todavía no hay incidencias registradas.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Comunidad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>{incident.title}</td>
                    <td>{incident.priority}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[incident.status] || "badge-pending"}`}>
                        {incident.status}
                      </span>
                    </td>
                    <td>{incident.created_at?.slice(0, 10)}</td>
                    <td>{communityName(incident.community_id)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEdit(incident)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(incident)}
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
        <IncidentForm
          initialData={editingIncident}
          communities={communities}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default Incidents;
