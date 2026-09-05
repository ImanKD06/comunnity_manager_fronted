import { useEffect, useState } from "react";
import { neighborsApi, communitiesApi } from "../services/api";
import NeighborForm from "../components/NeighborForm";

function Neighbors() {
  const [neighbors, setNeighbors] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNeighbor, setEditingNeighbor] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [neighborsData, communitiesData] = await Promise.all([
        neighborsApi.list(),
        communitiesApi.list(),
      ]);
      setNeighbors(neighborsData);
      setCommunities(communitiesData);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los vecinos.");
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
    setEditingNeighbor(null);
    setModalOpen(true);
  };

  const openEdit = (neighbor) => {
    setEditingNeighbor(neighbor);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (form) => {
    if (editingNeighbor) {
      await neighborsApi.update(editingNeighbor.id, form);
    } else {
      await neighborsApi.create(form);
    }
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async (neighbor) => {
    if (!window.confirm(`¿Eliminar a "${neighbor.name}"?`)) return;
    try {
      await neighborsApi.remove(neighbor.id);
      loadData();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el vecino.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Neighbors</span>
          <h1>Vecinos</h1>
          <p>Gestiona los vecinos asociados a cada comunidad.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openCreate}
          disabled={communities.length === 0}
        >
          + Crear vecino
        </button>
      </div>

      {error && <div className="banner-error">{error}</div>}
      {!loading && communities.length === 0 && (
        <div className="banner-error">
          Crea primero una comunidad para poder añadir vecinos.
        </div>
      )}

      <div className="panel">
        <div className="table-toolbar">
          <h3>Listado de vecinos</h3>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-state">Cargando vecinos...</div>
          ) : neighbors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              Todavía no hay vecinos registrados.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apartamento</th>
                  <th>Teléfono</th>
                  <th>Comunidad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {neighbors.map((neighbor) => (
                  <tr key={neighbor.id}>
                    <td>{neighbor.name}</td>
                    <td>{neighbor.apartment}</td>
                    <td>{neighbor.phone}</td>
                    <td>{communityName(neighbor.community_id)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEdit(neighbor)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(neighbor)}
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
        <NeighborForm
          initialData={editingNeighbor}
          communities={communities}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default Neighbors;
