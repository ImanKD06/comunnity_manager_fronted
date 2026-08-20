import { useEffect, useState } from "react";
import { communitiesApi } from "../services/api";
import CommunityForm from "../components/CommunityForm";

function Communities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState(null);

  const loadCommunities = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await communitiesApi.list();
      setCommunities(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las comunidades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  const openCreate = () => {
    setEditingCommunity(null);
    setModalOpen(true);
  };

  const openEdit = (community) => {
    setEditingCommunity(community);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (form) => {
    if (editingCommunity) {
      await communitiesApi.update(editingCommunity.id, form);
    } else {
      await communitiesApi.create(form);
    }
    setModalOpen(false);
    loadCommunities();
  };

  const handleDelete = async (community) => {
    if (!window.confirm(`¿Eliminar la comunidad "${community.name}"?`)) return;
    try {
      await communitiesApi.remove(community.id);
      loadCommunities();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la comunidad.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Communities</span>
          <h1>Comunidades</h1>
          <p>Gestiona las comunidades de vecinos registradas.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Crear comunidad
        </button>
      </div>

      {error && <div className="banner-error">{error}</div>}

      <div className="panel">
        <div className="table-toolbar">
          <h3>Listado de comunidades</h3>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-state">Cargando comunidades...</div>
          ) : communities.length === 0 ? (
            <div className="empty-state">
              Todavía no hay comunidades. Crea la primera.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {communities.map((community) => (
                  <tr key={community.id}>
                    <td>#{community.id}</td>
                    <td>{community.name}</td>
                    <td>{community.address}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEdit(community)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(community)}
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
        <CommunityForm
          initialData={editingCommunity}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default Communities;
