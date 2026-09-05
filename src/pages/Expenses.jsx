import { useEffect, useState } from "react";
import { expensesApi, communitiesApi } from "../services/api";
import ExpenseForm from "../components/ExpenseForm";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [expensesData, communitiesData] = await Promise.all([
        expensesApi.list(),
        communitiesApi.list(),
      ]);
      setExpenses(expensesData);
      setCommunities(communitiesData);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los gastos.");
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
    setEditingExpense(null);
    setModalOpen(true);
  };

  const openEdit = (expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (form) => {
    if (editingExpense) {
      await expensesApi.update(editingExpense.id, form);
    } else {
      await expensesApi.create(form);
    }
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async (expense) => {
    if (!window.confirm(`¿Eliminar el gasto "${expense.description}"?`)) return;
    try {
      await expensesApi.remove(expense.id);
      loadData();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el gasto.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Expenses</span>
          <h1>Gastos</h1>
          <p>Registra los gastos de mantenimiento de cada comunidad.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openCreate}
          disabled={communities.length === 0}
        >
          + Crear gasto
        </button>
      </div>

      {error && <div className="banner-error">{error}</div>}
      {!loading && communities.length === 0 && (
        <div className="banner-error">
          Crea primero una comunidad para poder registrar gastos.
        </div>
      )}

      <div className="panel">
        <div className="table-toolbar">
          <h3>Listado de gastos</h3>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-state">Cargando gastos...</div>
          ) : expenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              Todavía no hay gastos registrados.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Importe</th>
                  <th>Fecha</th>
                  <th>Comunidad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td>{Number(expense.amount).toFixed(2)} €</td>
                    <td>{expense.date}</td>
                    <td>{communityName(expense.community_id)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEdit(expense)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(expense)}
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
        <ExpenseForm
          initialData={editingExpense}
          communities={communities}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default Expenses;
