import {
  db,
  collection,
  getDocs,
  doc,
  setDoc
} from "./firebase.js";

import { partidos } from "./data.js?v=52";

const listaResultadosAdmin = document.getElementById("listaResultadosAdmin");
const tablaClientesAdmin = document.getElementById("tablaClientesAdmin");
const buscadorClienteAdmin = document.getElementById("buscadorClienteAdmin");

let resultadosOficialesAdmin = {};

if (buscadorClienteAdmin) {
  buscadorClienteAdmin.addEventListener("input", filtrarClientesAdmin);
}

iniciarAdmin();

async function iniciarAdmin() {
  await cargarResultadosOficialesAdmin();
  mostrarPanelAdmin();
  await cargarClientesAdmin();
}

async function cargarResultadosOficialesAdmin() {
  resultadosOficialesAdmin = {};

  const snap = await getDocs(collection(db, "resultadosOficiales"));

  snap.forEach((docResultado) => {
    resultadosOficialesAdmin[docResultado.id] = docResultado.data();
  });
}

function mostrarPanelAdmin() {
  if (!listaResultadosAdmin) return;

  listaResultadosAdmin.innerHTML = "";

  partidos.forEach((partido) => {

    const resultadoGuardado =
      resultadosOficialesAdmin[String(partido.id)] || {};

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
          <input
            type="number"
            min="0"
            id="real-local-${partido.id}"
            placeholder="-"
            value="${resultadoGuardado.local ?? ""}"
          >

          <strong>VS</strong>

          <input
            type="number"
            min="0"
            id="real-visitante-${partido.id}"
            placeholder="-"
            value="${resultadoGuardado.visitante ?? ""}"
          >
${Number(partido.id) === 104 ? `
  <div class="admin-campeon-final">
    <label for="campeon-final-${partido.id}">
      Campeón real
    </label>

    <select id="campeon-final-${partido.id}">
      <option value="">Seleccionar campeón si hay empate</option>

      <option
        value="${partido.local}"
        ${resultadoGuardado.campeon === partido.local ? "selected" : ""}
      >
        ${partido.local}
      </option>

      <option
        value="${partido.visitante}"
        ${resultadoGuardado.campeon === partido.visitante ? "selected" : ""}
      >
        ${partido.visitante}
      </option>
    </select>
  </div>
` : ""}

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
    const localInput =
      document.getElementById(`real-local-${partidoId}`);

    const visitanteInput =
      document.getElementById(`real-visitante-${partidoId}`);

    if (
      localInput.value === "" ||
      visitanteInput.value === ""
    ) {
      alert("Cargá ambos resultados.");
      return;
    }

    const partido =
      partidos.find(
        (p) => String(p.id) === String(partidoId)
      );

    if (!partido) {
      alert("No se encontró el partido.");
      return;
    }

let campeonFinal = null;

if (Number(partido.id) === 104) {
  const golesLocal = Number(localInput.value);
  const golesVisitante = Number(visitanteInput.value);

  if (golesLocal > golesVisitante) {
    campeonFinal = partido.local;
  }

  if (golesVisitante > golesLocal) {
    campeonFinal = partido.visitante;
  }

  if (golesLocal === golesVisitante) {
    const campeonSelect =
      document.getElementById(`campeon-final-${partidoId}`);

    if (!campeonSelect || !campeonSelect.value) {
      alert("La final terminó empatada. Seleccioná el campeón real.");
      return;
    }

    campeonFinal = campeonSelect.value;
  }
}

 const resultadoReal = {
  partidoId: String(partidoId),
  local: Number(localInput.value),
  visitante: Number(visitanteInput.value),
  partido: `${partido.local} vs ${partido.visitante}`,
  fecha: partido.fecha,
  grupo: partido.grupo,

  ...(Number(partido.id) === 104
    ? { campeon: campeonFinal }
    : {}),

  actualizado: new Date().toISOString()
};

    await setDoc(
      doc(
        db,
        "resultadosOficiales",
        String(partidoId)
      ),
      resultadoReal
    );

    await recalcularPuntos();

    alert(
      "Resultado oficial guardado y puntos actualizados ✅"
    );

  } catch (error) {
    console.error(
      "Error guardando resultado oficial:",
      error
    );

    alert(
      "Error al guardar. Revisá la consola con F12."
    );
  }
}

async function recalcularPuntos() {

  const resultadosSnap =
    await getDocs(
      collection(db, "resultadosOficiales")
    );

  const resultados = {};

  resultadosSnap.forEach((docResultado) => {
    resultados[docResultado.id] =
      docResultado.data();
  });

  const usuariosSnap =
    await getDocs(
      collection(db, "usuarios")
    );

  const usuariosPorId = {};

  usuariosSnap.forEach((docUsuario) => {
    usuariosPorId[docUsuario.id] =
      docUsuario.data();
  });

  const pronosticosSnap =
    await getDocs(
      collection(db, "pronosticos")
    );

  const puntosPorCliente = {};

  pronosticosSnap.forEach((docPronostico) => {

    const clienteId = docPronostico.id;
    const data = docPronostico.data();
    const pronosticos = data.partidos || {};

    let puntosCalculados = 0;

    Object.entries(pronosticos)
      .forEach(([partidoId, pronostico]) => {

        const real = resultados[partidoId];

        if (!real) return;

        const partidoEncontrado =
          partidos.find(
            (partido) =>
              String(partido.id) === String(partidoId)
          );

        const grupo =
          partidoEncontrado?.grupo ||
          pronostico.grupo ||
          real.grupo ||
          "";

        puntosCalculados +=
          calcularPuntos(
            pronostico,
            real,
            grupo
          );
      });

const partidoFinal =
  partidos.find((partido) => Number(partido.id) === 104);

const resultadoFinal =
  resultados["104"];

puntosCalculados += calcularPuntosCampeon(
  data,
  partidoFinal,
  resultadoFinal
);


    const usuario =
      usuariosPorId[clienteId] || {};

    const puntosActualesFirebase =
      Number(usuario.puntos || 0);

    const puntosBase =
      Number(usuario.puntosBase || 0);

    const puntosFinales =
      Math.max(
        puntosActualesFirebase,
        puntosBase + puntosCalculados,
        puntosCalculados
      );

    puntosPorCliente[clienteId] = {
      puntosFinales,
      puntosCalculados
    };
  });

  for (
    const [clienteId, datos]
    of Object.entries(puntosPorCliente)
  ) {

    await setDoc(
      doc(db, "usuarios", clienteId),
      {
        puntos: datos.puntosFinales,
        puntosCalculados: datos.puntosCalculados,
        actualizadoPuntos: new Date().toISOString()
      },
      { merge: true }
    );
  }
}

function esFaseFinalAdmin(grupo) {
  return (
    grupo === "16avos de final" ||
    grupo === "Octavos de final" ||
    grupo === "Cuartos de final" ||
    grupo === "Semifinal" ||
    grupo === "Final"
  );
}

function calcularPuntos(
  pronostico,
  real,
  grupo
){
  if (!pronostico || !real) return 0;

  if (
    pronostico.local === undefined ||
    pronostico.visitante === undefined ||
    real.local === undefined ||
    real.visitante === undefined ||
    real.local === "" ||
    real.visitante === ""
  ) {
    return 0;
  }

  const localPronostico = Number(pronostico.local);
  const visitantePronostico = Number(pronostico.visitante);
  const localReal = Number(real.local);
  const visitanteReal = Number(real.visitante);

  const diferenciaPronostico =
    localPronostico - visitantePronostico;

  const diferenciaReal =
    localReal - visitanteReal;

  const signoPronostico = Math.sign(diferenciaPronostico);
  const signoReal = Math.sign(diferenciaReal);

  const resultadoExacto =
    localPronostico === localReal &&
    visitantePronostico === visitanteReal;

  const esFinal =
    String(grupo || "").toLowerCase() === "final";

  // Premio especial: resultado exacto en la Final
  if (esFinal && resultadoExacto) {
    return 150;
  }

 if (esFaseFinalAdmin(grupo)) {
    if (resultadoExacto) {
      return 8;
    }

    if (
      diferenciaReal !== 0 &&
      diferenciaPronostico === diferenciaReal
    ) {
      return 5;
    }

    if (
      diferenciaReal !== 0 &&
      signoPronostico === signoReal
    ) {
      return 3;
    }

    if (
      diferenciaReal === 0 &&
      diferenciaPronostico === 0
    ) {
      return 1;
    }

    return 0;
  }

  // Regla vieja para fase de grupos
  if (resultadoExacto) {
    return 3;
  }

  if (signoPronostico === signoReal) {
    return 1;
  }

  return 0;
}

async function cargarClientesAdmin() {

  if (!tablaClientesAdmin)
    return;

  tablaClientesAdmin.innerHTML = "";

  const resultado =
    await getDocs(
      collection(db, "usuarios")
    );

  resultado.forEach((docCliente) => {

    const cliente =
      docCliente.data();

    const fila =
      document.createElement("tr");

    fila.innerHTML = `
      <td>${cliente.nombre || "-"}</td>
      <td>${cliente.telefono || "-"}</td>
      <td>${cliente.cumple || "-"}</td>
      <td>${cliente.email || "-"}</td>
      <td><strong>${cliente.puntos || 0}</strong></td>
    `;

    tablaClientesAdmin
      .appendChild(fila);
  });
  filtrarClientesAdmin();
}


function normalizarNombreEquipo(nombre) {
  return String(nombre || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function calcularPuntosCampeon(
  datosPronostico,
  partidoFinal,
  resultadoFinal
) {
  if (!datosPronostico || !partidoFinal || !resultadoFinal) {
    return 0;
  }

  const campeonElegido =
    datosPronostico.campeonMundial?.seleccion;

  if (!campeonElegido) {
    return 0;
  }

  if (
    resultadoFinal.local === undefined ||
    resultadoFinal.visitante === undefined ||
    resultadoFinal.local === "" ||
    resultadoFinal.visitante === ""
  ) {
    return 0;
  }

  let campeonReal =
    resultadoFinal.campeon || "";

  if (!campeonReal) {
    const golesLocal = Number(resultadoFinal.local);
    const golesVisitante = Number(resultadoFinal.visitante);

    if (golesLocal > golesVisitante) {
      campeonReal = partidoFinal.local;
    }

    if (golesVisitante > golesLocal) {
      campeonReal = partidoFinal.visitante;
    }
  }

  if (!campeonReal) {
    return 0;
  }

  if (
    normalizarNombreEquipo(campeonElegido) ===
    normalizarNombreEquipo(campeonReal)
  ) {
    return 100;
  }

  return 0;
}

async function auditarClientesSinPronosticos() {

  const usuariosSnap =
    await getDocs(
      collection(db, "usuarios")
    );

  const pronosticosSnap =
    await getDocs(
      collection(db, "pronosticos")
    );

  const idsPronosticos =
    new Set();

  pronosticosSnap.forEach(
    (docPronostico) => {
      idsPronosticos.add(
        docPronostico.id
      );
    }
  );

  const problemas = [];

  usuariosSnap.forEach(
    (docUsuario) => {

      const usuario =
        docUsuario.data();

      if (
        !idsPronosticos.has(
          docUsuario.id
        )
      ) {

        problemas.push({
          id: docUsuario.id,
          nombre:
            usuario.nombre || "-",
          telefono:
            usuario.telefono || "-",
          email:
            usuario.email || "-"
        });
      }
    }
  );

  console.table(problemas);

  alert(
    `Clientes sin pronósticos encontrados: ${problemas.length}. Revisá la consola con F12.`
  );
}
function normalizarTextoAdmin(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function filtrarClientesAdmin() {
  if (!tablaClientesAdmin || !buscadorClienteAdmin) return;

  const busqueda = normalizarTextoAdmin(buscadorClienteAdmin.value);
  const filas = tablaClientesAdmin.querySelectorAll("tr");

  filas.forEach((fila) => {
    const textoFila = normalizarTextoAdmin(fila.textContent);

    if (!busqueda || textoFila.includes(busqueda)) {
      fila.style.display = "";
    } else {
      fila.style.display = "none";
    }
  });
}