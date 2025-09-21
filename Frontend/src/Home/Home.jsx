import React from "react";

function Home_Normal() {
  return (
    <div>
      <h1>Bienvenido a Home Normal</h1>
      <p>Esta es la página principal para usuarios normales.</p>
      <div className="mt-3">
        <a className="btn btn-primary" href="/pacientes">Ir a Pacientes</a>
      </div>
    </div>
  );
}

export default Home_Normal;