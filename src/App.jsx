import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Communities from "./pages/Communities";
import Neighbors from "./pages/Neighbors";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";
import Incidents from "./pages/Incidents";
import Actas from "./pages/Actas";

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/neighbors" element={<Neighbors />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/actas" element={<Actas />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
