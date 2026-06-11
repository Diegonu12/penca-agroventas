import {
  db,
  collection,
  getDocs,
  doc,
  setDoc
} from "./firebase.js";

import { partidos } from "./data.js";

const listaResultadosAdmin = document.getElementById("listaResultadosAdmin");
const tablaClientesAdmin = document.getElementById("tablaClientesAdmin");

mostrarPanelAdmin();
cargarClientesAdmin();

function mostrarPanelAdmin() {
  if (!listaResultadosAdmin) return;

  listaResultadosAdmin.innerHTML = "";

  partidos.forEach((partido) => {
    const div = document.createElement("div");
    div.classList.add("partido");

    div.innerHTML = `
      <div class="app-card-fecha">${partido.fecha}</div>

      <div class="app-card-equipos">
        <div class="app-equipo">
          <img src="${partido.banderaLocal}" alt="${partido.local}">
          <span>${partido.local}</span>
        </div>

        <div class="app-pronostico">
          <input type="number" min="0" id="real-local-${partido.id}" placeholder="-">
          <strong>VS</strong>
          <input type="number" min="0" id="real-visitante-${partido.id}" placeholder="-">
        </div>

        <div class="app-equipo">
          <img src="${partido.banderaVisitante}" alt="${partido.visitante}">
          <span>${partido.visitante}</span>
        </div>
      </div>

      <div class="app-card-footer">
        <span>${partido.grupo}</span>

        <button
          class="btn-secundario btn-admin"
          data-id="${partido.id}"
        >
          Guardar resultado oficial
        </button>
      </div>
    `;

    listaResultadosAdmin.appendChild(div);
  });

  document.querySelectorAll(".btn-admin").forEach((boton) => {
    boton.addEventListener("click", async () => {
      const partidoId = boton.dataset.id;
      await guardarResultadoOficial(partidoId);
    });
  });
}

async function guardarResultadoOficial(partidoId) {
  try {
    const localInput = document.getElementById(`real-local-${partidoId}`);
    const visitanteInput = document.getElementById(`real-visitante-${partidoId}`);

    if (localInput.value === "" || visitanteInput.value === "") {
      alert("Cargá ambos resultados.");
      return;
    }

    const partido = partidos.find((p) => String(p.id) === String(partidoId));

    if (!partido) {
      alert("No se encontró el partido.");
      return;
    }

    const resultadoReal = {
      partidoId: String(partidoId),
      local: Number(localInput.value),
      visitante: Number(visitanteInput.value),
      partido: `${partido.local} vs ${partido.visitante}`,
      fecha: partido.fecha,
      grupo: partido.grupo,
      actualizado: new Date().toISOString()
    };

    await setDoc(
      doc(db, "resultadosOficiales", String(partidoId)),
      resultadoReal
    );

    await recalcularPuntos();

    alert("Resultado oficial guardado y puntos actualizados ✅");
  } catch (error) {
    console.error("Error guardando resultado oficial:", error);
    alert("Error al guardar. Revisá la consola con F12.");
  }
}

async function recalcularPuntos() {
  const resultadosSnap = await getDocs(collection(db, "resultadosOficiales"));

  const resultados = {};

  resultadosSnap.forEach((docResultado) => {
    resultados[docResultado.id] = docResultado.data();
  });

  const pronosticosSnap = await getDocs(collection(db, "pronosticos"));

  const puntosPorCliente = {};

  pronosticosSnap.forEach((docPronostico) => {
    const clienteId = docPronostico.id;
    const data = docPronostico.data();
    const pronosticos = data.partidos || {};

    let puntos = 0;

    Object.entries(pronosticos).forEach(([partidoId, pronostico]) => {
      const real = resultados[partidoId];

      if (!real) return;

      puntos += calcularPuntos(pronostico, real);
    });

    puntosPorCliente[clienteId] = puntos;
  });

  for (const [clienteId, puntos] of Object.entries(puntosPorCliente)) {
    await setDoc(
      doc(db, "usuarios", clienteId),
      { puntos },
      { merge: true }
    );
  }
}

function calcularPuntos(pronostico, real) {
  if (
    Number(pronostico.local) === Number(real.local) &&
    Number(pronostico.visitante) === Number(real.visitante)
  ) {
    return 3;
  }

  const signoPronostico =
    Math.sign(Number(pronostico.local) - Number(pronostico.visitante));

  const signoReal =
    Math.sign(Number(real.local) - Number(real.visitante));

  if (signoPronostico === signoReal) {
    return 1;
  }

  return 0;
}

async function cargarClientesAdmin() {
  if (!tablaClientesAdmin) return;

  tablaClientesAdmin.innerHTML = "";

  const resultado = await getDocs(collection(db, "usuarios"));

  resultado.forEach((docCliente) => {
    const cliente = docCliente.data();

    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${cliente.nombre || "-"}</td>
      <td>${cliente.telefono || "-"}</td>
      <td>${cliente.cumple || "-"}</td>
      <td>${cliente.email || "-"}</td>
      <td><strong>${cliente.puntos || 0}</strong></td>
    `;

    tablaClientesAdmin.appendChild(fila);
  });
}