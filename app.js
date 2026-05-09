import {
  auth,
  db,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc
} from "./firebase.js";

import { partidos } from "./data.js";

const listaFixture = document.getElementById("listaFixture");
const guardarPronosticos = document.getElementById("guardarPronosticos");

let usuarioActual = null;
let pronosticosActuales = {};

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  usuarioActual = user;

  await cargarPronosticosGuardados();
  mostrarFixture();
});

async function cargarPronosticosGuardados() {
  const ref = doc(db, "pronosticos", usuarioActual.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    pronosticosActuales = snap.data().partidos || {};
  }
}

function mostrarFixture() {
  if (!listaFixture) return;

  listaFixture.innerHTML = "";

  partidos.forEach((partido) => {
    const pronostico = pronosticosActuales[partido.id] || {};

    const div = document.createElement("div");
    div.classList.add("partido");

    div.innerHTML = `
      <div class="fecha">${partido.fecha}</div>

      <div class="equipo equipo-local">
        <img src="${partido.banderaLocal}" alt="${partido.local}" class="bandera-img">
        <strong>${partido.local}</strong>
      </div>

      <input
        type="number"
        min="0"
        id="local-${partido.id}"
        placeholder="0"
        value="${pronostico.local ?? ""}"
      />

      <div class="vs">VS</div>

      <input
        type="number"
        min="0"
        id="visitante-${partido.id}"
        placeholder="0"
        value="${pronostico.visitante ?? ""}"
      />

      <div class="equipo equipo-visitante">
        <img src="${partido.banderaVisitante}" alt="${partido.visitante}" class="bandera-img">
        <strong>${partido.visitante}</strong>
      </div>

      <div class="grupo-partido">${partido.grupo}</div>
    `;

    listaFixture.appendChild(div);
  });
}

if (guardarPronosticos) {
  guardarPronosticos.addEventListener("click", async () => {
    if (!usuarioActual) return;

    const pronosticos = {};

    partidos.forEach((partido) => {
      const golesLocal = document.getElementById(`local-${partido.id}`).value;
      const golesVisitante = document.getElementById(`visitante-${partido.id}`).value;

      if (golesLocal !== "" && golesVisitante !== "") {
        pronosticos[partido.id] = {
          local: Number(golesLocal),
          visitante: Number(golesVisitante),
          partido: `${partido.local} vs ${partido.visitante}`,
          grupo: partido.grupo,
          fecha: partido.fecha
        };
      }
    });

    await setDoc(doc(db, "pronosticos", usuarioActual.uid), {
      usuarioId: usuarioActual.uid,
      email: usuarioActual.email,
      partidos: pronosticos,
      actualizado: new Date().toISOString()
    });

    alert("Pronósticos guardados correctamente 😎");
  });
}