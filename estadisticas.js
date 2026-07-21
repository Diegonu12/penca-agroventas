import {
  db,
  collection,
  getDocs
} from "./firebase.js";

import { partidos } from "./data.js?v=53";

const actualizarEstadisticas =
  document.getElementById("actualizarEstadisticas");

const tablaPronosticosPorFase =
  document.getElementById("tablaPronosticosPorFase");

const tablaTopRanking =
  document.getElementById("tablaTopRanking");

if (actualizarEstadisticas) {
  actualizarEstadisticas.addEventListener("click", cargarEstadisticas);
}

cargarEstadisticas();

function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function actualizarTexto(id, valor) {
  const elemento = document.getElementById(id);

  if (elemento) {
    elemento.textContent = valor;
  }
}

async function cargarEstadisticas() {
  try {
    if (actualizarEstadisticas) {
      actualizarEstadisticas.disabled = true;
      actualizarEstadisticas.textContent = "Actualizando...";
    }

    const usuariosSnap = await getDocs(collection(db, "usuarios"));
    const pronosticosSnap = await getDocs(collection(db, "pronosticos"));

    const usuarios = {};
    const ranking = [];

    usuariosSnap.forEach((docUsuario) => {
      const usuario = docUsuario.data();

      usuarios[docUsuario.id] = usuario;

      ranking.push({
        id: docUsuario.id,
        nombre: usuario.nombre || "-",
        telefono: usuario.telefono || docUsuario.id || "-",
        puntos: Number(usuario.puntos || 0)
      });
    });

    const totalClientes = usuariosSnap.size;

    let clientesConPronosticos = 0;
    let totalPronosticosCargados = 0;
    let pronosticaronTercerPuesto = 0;
    let pronosticaronFinal = 0;

    let eligieronCampeon = 0;
    let campeonArgentina = 0;
    let campeonEspana = 0;

    const pronosticosPorFase = {};

    pronosticosSnap.forEach((docPronostico) => {
      const datos = docPronostico.data();

      const partidosPronosticados = datos.partidos || {};
      const idsPartidos = Object.keys(partidosPronosticados);

      if (idsPartidos.length > 0) {
        clientesConPronosticos++;
      }

      totalPronosticosCargados += idsPartidos.length;

      if (partidosPronosticados["103"]) {
        pronosticaronTercerPuesto++;
      }

      if (partidosPronosticados["104"]) {
        pronosticaronFinal++;
      }

      idsPartidos.forEach((idPartido) => {
        const partidoEncontrado = partidos.find(
          (partido) => String(partido.id) === String(idPartido)
        );

        const fase =
          partidoEncontrado?.grupo ||
          partidosPronosticados[idPartido]?.grupo ||
          "Sin fase";

        if (!pronosticosPorFase[fase]) {
          pronosticosPorFase[fase] = 0;
        }

        pronosticosPorFase[fase]++;
      });

      const campeon =
        datos.campeonMundial?.seleccion || "";

      if (campeon) {
        eligieronCampeon++;
      }

      if (normalizarTexto(campeon) === "argentina") {
        campeonArgentina++;
      }

      if (normalizarTexto(campeon) === "espana") {
        campeonEspana++;
      }
    });

    const clientesSinPronosticos =
      totalClientes - clientesConPronosticos;

    const clientesSinCampeon =
      totalClientes - eligieronCampeon;

    actualizarTexto("statTotalClientes", totalClientes);
    actualizarTexto("statConPronosticos", clientesConPronosticos);
    actualizarTexto("statSinPronosticos", clientesSinPronosticos);
    actualizarTexto("statTotalPronosticos", totalPronosticosCargados);
    actualizarTexto("statTercerPuesto", pronosticaronTercerPuesto);
    actualizarTexto("statFinal", pronosticaronFinal);
    actualizarTexto("statCampeon", eligieronCampeon);
    actualizarTexto("statSinCampeon", clientesSinCampeon);
    actualizarTexto("statArgentina", campeonArgentina);
    actualizarTexto("statEspana", campeonEspana);

    cargarTablaPronosticosPorFase(pronosticosPorFase);
    cargarTopRanking(ranking);

  } catch (error) {
    console.error("Error cargando estadísticas:", error);
    alert("No se pudieron cargar las estadísticas. Revisá la consola con F12.");

  } finally {
    if (actualizarEstadisticas) {
      actualizarEstadisticas.disabled = false;
      actualizarEstadisticas.textContent = "Actualizar datos";
    }
  }
}

function cargarTablaPronosticosPorFase(pronosticosPorFase) {
  if (!tablaPronosticosPorFase) return;

  const fasesOrdenadas = [
    "16avos de final",
    "Octavos de final",
    "Cuartos de final",
    "Semifinal",
    "Tercer puesto",
    "Final"
  ];

  const filas = fasesOrdenadas
    .filter((fase) => pronosticosPorFase[fase])
    .map((fase) => {
      return {
        fase,
        cantidad: pronosticosPorFase[fase]
      };
    });

  if (filas.length === 0) {
    tablaPronosticosPorFase.innerHTML = `
      <tr>
        <td colspan="2">Todavía no hay pronósticos cargados.</td>
      </tr>
    `;
    return;
  }

  tablaPronosticosPorFase.innerHTML = filas
    .map((item) => `
      <tr>
        <td>${item.fase}</td>
        <td><strong>${item.cantidad}</strong></td>
      </tr>
    `)
    .join("");
}

function cargarTopRanking(ranking) {
  if (!tablaTopRanking) return;

  ranking.sort((a, b) => {
    if (b.puntos !== a.puntos) {
      return b.puntos - a.puntos;
    }

    return a.nombre.localeCompare(b.nombre);
  });

  const top10 = ranking.slice(0, 10);

  if (top10.length === 0) {
    tablaTopRanking.innerHTML = `
      <tr>
        <td colspan="4">Todavía no hay clientes registrados.</td>
      </tr>
    `;
    return;
  }

  tablaTopRanking.innerHTML = top10
    .map((cliente, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${cliente.nombre}</td>
        <td>${cliente.telefono}</td>
        <td><strong>${cliente.puntos}</strong></td>
      </tr>
    `)
    .join("");
}