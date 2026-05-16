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
const botonesFiltro = document.querySelectorAll(".filtro-btn");
const contadorPartidos = document.getElementById("contadorPartidos");

let usuarioActual = null;
let pronosticosActuales = {};
let filtroActual = "todos";

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

function obtenerPartidosFiltrados() {
  if (filtroActual === "todos") {
    return partidos;
  }

  if (filtroActual === "uruguay") {
    return partidos.filter((partido) => {
      return (
        partido.local.toLowerCase() === "uruguay" ||
        partido.visitante.toLowerCase() === "uruguay"
      );
    });
  }

  return partidos.filter((partido) => {
    return partido.grupo.includes(`GRUPO ${filtroActual}`);
  });
}

function mostrarFixture() {
  if (!listaFixture) return;

  listaFixture.innerHTML = "";

  const partidosFiltrados = obtenerPartidosFiltrados();

  contadorPartidos.textContent =
    `Mostrando ${partidosFiltrados.length} partido(s)`;

  partidosFiltrados.forEach((partido) => {
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

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesFiltro.forEach((btn) => {
      btn.classList.remove("activo");
    });

    boton.classList.add("activo");

    filtroActual = boton.dataset.filtro;

    guardarValoresTemporales();
    mostrarFixture();
  });
});

function guardarValoresTemporales() {
  const inputs = document.querySelectorAll("#listaFixture input");

  inputs.forEach((input) => {
    const partes = input.id.split("-");
    const tipo = partes[0];
    const idPartido = partes[1];

    if (!pronosticosActuales[idPartido]) {
      pronosticosActuales[idPartido] = {};
    }

    if (input.value !== "") {
      pronosticosActuales[idPartido][tipo] = Number(input.value);
    }
  });
}

if (guardarPronosticos) {
  guardarPronosticos.addEventListener("click", async () => {
    if (!usuarioActual) return;

    guardarValoresTemporales();

    const pronosticos = {};

    Object.entries(pronosticosActuales).forEach(([idPartido, datos]) => {
      if (
        datos.local !== undefined &&
        datos.visitante !== undefined
      ) {
        const partido = partidos.find(
          (p) => String(p.id) === String(idPartido)
        );

        if (partido) {
          pronosticos[idPartido] = {
            local: Number(datos.local),
            visitante: Number(datos.visitante),
            partido: `${partido.local} vs ${partido.visitante}`,
            grupo: partido.grupo,
            fecha: partido.fecha
          };
        }
      }
    });

    await setDoc(doc(db, "pronosticos", usuarioActual.uid), {
      usuarioId: usuarioActual.uid,
      email: usuarioActual.email,
      partidos: pronosticos,
      actualizado: new Date().toISOString()
    });

    pronosticosActuales = pronosticos;

    alert("Pronósticos guardados correctamente 😎");
  });
}
