import { useEffect, useState } from "react";
import {
  communitiesApi,
  neighborsApi,
  paymentsApi,
  expensesApi,
} from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    communities: 0,
    neighbors: 0,
    pendingPayments: 0,
    totalExpenses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError("");
      try {
        const [communities, neighbors, payments, expenses] = await Promise.all([
          communitiesApi.list(),
          neighborsApi.list(),
          paymentsApi.list(),
          expensesApi.list(),
        ]);

        const pendingPayments = payments.filter((p) => !p.paid).length;
        const totalExpenses = expenses.reduce(
          (sum, e) => sum + Number(e.amount || 0),
          0
        );

        setStats({
          communities: communities.length,
          neighbors: neighbors.length,
          pendingPayments,
          totalExpenses,
        });
      } catch (err) {
        setError(err.message || "No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const cards = [
    { label: "Comunidades", value: stats.communities },
    { label: "Vecinos", value: stats.neighbors },
    { label: "Pagos pendientes", value: stats.pendingPayments },
    {
    
      label: "Gastos totales",
      value: `${stats.totalExpenses.toFixed(2)} €`,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Inicio</h1>
          <p>Resumen general de tus comunidades.</p>
        </div>
      </div>

      {error && <div className="banner-error">{error}</div>}

      {loading ? (
        <div className="panel">
          <div className="loading-state">Cargando estadísticas...</div>
        </div>
      ) : (
        <div className="stat-grid">
          {cards.map((card) => (
            <div className="stat-card" key={card.label}>
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
