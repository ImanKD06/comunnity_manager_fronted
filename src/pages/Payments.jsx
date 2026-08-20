import { useEffect, useState } from "react";
import { paymentsApi, neighborsApi } from "../services/api";
import PaymentForm from "../components/PaymentForm";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function Payments() {
  const [payments, setPayments] = useState([]);
  const [neighbors, setNeighbors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [paymentsData, neighborsData] = await Promise.all([
        paymentsApi.list(),
        neighborsApi.list(),
      ]);
      setPayments(paymentsData);
      setNeighbors(neighborsData);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los pagos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const neighborName = (id) => neighbors.find((n) => n.id === id)?.name || "—";

  const openCreate = () => {
    setEditingPayment(null);
    setModalOpen(true);
  };

  const openEdit = (payment) => {
    setEditingPayment(payment);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (form) => {
    if (editingPayment) {
      await paymentsApi.update(editingPayment.id, form);
    } else {
      await paymentsApi.create(form);
    }
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async (payment) => {
    if (!window.confirm("¿Eliminar este pago?")) return;
    try {
      await paymentsApi.remove(payment.id);
      loadData();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el pago.");
    }
  };

  const handleMarkAsPaid = async (payment) => {
    try {
      await paymentsApi.markAsPaid(payment.id);
      loadData();
    } catch (err) {
      setError(err.message || "No se pudo actualizar el pago.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Payments</span>
          <h1>Pagos</h1>
          <p>Controla las cuotas mensuales de cada vecino.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openCreate}
          disabled={neighbors.length === 0}
        >
          + Crear pago
        </button>
      </div>

      {error && <div className="banner-error">{error}</div>}
      {!loading && neighbors.length === 0 && (
        <div className="banner-error">
          Crea primero un vecino para poder registrar pagos.
        </div>
      )}

      <div className="panel">
        <div className="table-toolbar">
          <h3>Listado de pagos</h3>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-state">Cargando pagos...</div>
          ) : payments.length === 0 ? (
            <div className="empty-state">
              
              Todavía no hay pagos registrados.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Vecino</th>
                  <th>Mes</th>
                  <th>Año</th>
                  <th>Importe</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{neighborName(payment.neighbor_id)}</td>
                    <td>{MONTHS[payment.month - 1] || payment.month}</td>
                    <td>{payment.year}</td>
                    <td>{Number(payment.amount).toFixed(2)} €</td>
                    <td>
                      {payment.paid ? (
                        <span className="badge badge-paid">✓ Pagado</span>
                      ) : (
                        <span className="badge badge-pending">Pendiente</span>
                      )}
                    </td>
                    <td>
                      <div className="row-actions">
                        {!payment.paid && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleMarkAsPaid(payment)}
                          >
                            Marcar como pagado
                          </button>
                        )}
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEdit(payment)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(payment)}
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
        <PaymentForm
          initialData={editingPayment}
          neighbors={neighbors}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default Payments;
