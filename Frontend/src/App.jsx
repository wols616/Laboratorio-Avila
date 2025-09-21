import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "./Login/LoginPage";
import Home_Normal from "./Home/home_normal";
import AdminRegister from "./components/AdminRegister";
import './App.css'

function App() {
  useEffect(() => {
    let timeout;
    const INACTIVITY_LIMIT = 120 * 60 * 1000; // 120 minutos

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        localStorage.removeItem("user");
        window.location.href = "/"; 
      }, INACTIVITY_LIMIT);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<ProtectedRoute allowedPrivileges={[0]} />}>
          <Route path="/home_normal" element={<Home_Normal />} />
        </Route>
        {/*
        Solo pacientes (privilegio 1)
        <Route element={<ProtectedRoute allowedPrivileges={[1]} />}>
          <Route path="/home_paciente" element={<Home_Paciente />} />
          <Route path="/consentimiento-informado" element={<ConsentimientoInformado />} />
        </Route>
        */}
        {/* Ruta temporal para registrar un admin desde la UI */}
        <Route path="/register" element={<AdminRegister />} />
        {/* Solo admin (privilegio 3) 
        <Route element={<ProtectedRoute allowedPrivileges={[3]} />}>
          <Route path="/admin/home" element={<HomeAdmin />} />
        </Route>
        */}
      </Routes>
    </Router>
  );
}

export default App;
