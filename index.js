import {
  db,
  collection,
  getDocs,
  doc,
  setDoc
} from "./firebase.js";

import { partidos } from "./data.js?v=14";

const formIndex = document.getElementById("registro-cliente-index");
const tablaPosiciones = document.getElementById("tablaPosiciones");
const cumpleInput = document.getElementById("cumpleIndex");
const rankingHero = document.getElementById("rankingHero");

if (cumpleInput) {
  cumpleInput.addEventListener("input", (e) => {
    let valor = e.target.value.replace(/\D/g, "");

    if (valor.length >= 3) {
      valor = valor.substring(0, 2) + "/" + valor.substring(2, 4);
    }

    e.target.value = valor;
  });
}

if (formIndex) {
  formIndex.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombreIndex").value.trim();
    const direccion = document.getElementById("direccionIndex").value.trim();
    const cumple = document.getElementById("cumpleIndex").value.trim();
    const telefono = document.getElementById("telefonoIndex").value.trim();
    const email = document.getElementById("emailIndex").value.trim();

    if (!nombre || !direccion || !cumple || !telefono || !email) {
      alert("Completá todos los datos.");
      return;
    }

    try {
      const idCliente = telefono;

      await setDoc(doc(db, "usuarios", idCliente), {
        nombre,
        direccion,
        cumple,
        telefono,
        email,
        puntos: 0,
        creado: new Date().toISOString()
      });

      alert(
        `Cliente registrado correctamente ✅

Para ingresar al fixture y cargar tus pronósticos, usá tu número de celular:

${telefono}`
      );

      formIndex.reset();

      cargarClientesRegistrados();

    } catch (error) {
      console.error("Error al registrar cliente:", error);
      alert("No se pudo registrar el cliente. Revisá Firebase o la consola.");
    }
  });
}

function esFaseFinal(grupo) {
  return (
    grupo === "16avos de final" ||
    grupo === "Octavos de final" ||
    grupo === "Cuartos de final" ||
    grupo === "Semifinal" ||
    grupo === "Final"
  );
}

function calcularPuntosPartido(pronostico, resultadoReal, grupo) {
  if (!pronostico || !resultadoReal) return 0;

  if (
    pronostico.local === undefined ||
    pronostico.visitante === undefined ||
    resultadoReal.local === undefined ||
    resultadoReal.visitante === undefined ||
    resultadoReal.local === "" ||
    resultadoReal.visitante === ""
  ) {
    return 0;
  }

  const pronosticoLocal = Number(pronostico.local);
  const pronosticoVisitante = Number(pronostico.visitante);
  const realLocal = Number(resultadoReal.local);
  const realVisitante = Number(resultadoReal.visitante);

  const diferenciaPronostico =
    pronosticoLocal - pronosticoVisitante;

  const diferenciaReal =
    realLocal - realVisitante;

  const signoPronostico = Math.sign(diferenciaPronostico);
  const signoReal = Math.sign(diferenciaReal);

  const resultadoExacto =
    pronosticoLocal === realLocal &&
    pronosticoVisitante === realVisitante;

  if (esFaseFinal(grupo)) {
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

async function obtenerResultadosOficiales() {
  const resultadosOficiales = {};

  const resultado = await getDocs(collection(db, "resultadosOficiales"));

  resultado.forEach((docResultado) => {
    resultadosOficiales[docResultado.id] = docResultado.data();
  });

  return resultadosOficiales;
}

async function obtenerPronosticosPorCliente() {
  const pronosticosPorCliente = {};

  const resultado = await getDocs(collection(db, "pronosticos"));

  resultado.forEach((docPronostico) => {
    const datos = docPronostico.data();

    pronosticosPorCliente[docPronostico.id] = datos.partidos || {};
  });

  return pronosticosPorCliente;
}

async function cargarClientesRegistrados() {
  if (!tablaPosiciones) return;

  tablaPosiciones.innerHTML = "";

  if (rankingHero) {
    rankingHero.innerHTML = "";
  }

  try {
    const usuariosSnap = await getDocs(collection(db, "usuarios"));
    const resultadosOficiales = await obtenerResultadosOficiales();
    const pronosticosPorCliente = await obtenerPronosticosPorCliente();

    const ranking = [];

        usuariosSnap.forEach((docUsuario) => {
      const usuario = docUsuario.data();
      const clienteId = docUsuario.id;

      const pronosticosCliente =
        pronosticosPorCliente[clienteId] || {};

      let puntosTotales = 0;

      Object.entries(pronosticosCliente).forEach(([idPartido, pronostico]) => {
        const resultadoReal = resultadosOficiales[idPartido];

        if (!resultadoReal) return;

        const partidoEncontrado = partidos.find(
          (partido) => String(partido.id) === String(idPartido)
        );

        const grupo =
          partidoEncontrado?.grupo ||
          pronostico.grupo ||
          "";

        puntosTotales += calcularPuntosPartido(
          pronostico,
          resultadoReal,
          grupo
        );
      });

      const puntosGuardados = Number(usuario.puntos || 0);

      const puntosFinales = Math.max(
        puntosTotales,
        puntosGuardados
      );

      ranking.push({
        id: clienteId,
        nombre: usuario.nombre || "-",
        puntos: puntosFinales
      });
    });
    
    ranking.sort((a, b) => {
      if (b.puntos !== a.puntos) {
        return b.puntos - a.puntos;
      }

      return a.nombre.localeCompare(b.nombre);
    });

    ranking.forEach((cliente, index) => {
      const posicion = index + 1;

      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${posicion}</td>
        <td>${cliente.nombre}</td>
        <td><strong>${cliente.puntos}</strong></td>
      `;

      tablaPosiciones.appendChild(fila);

      if (rankingHero && posicion <= 3) {
        const item = document.createElement("p");

        item.textContent =
          `${posicion}. ${cliente.nombre} — ${cliente.puntos} pts`;

        rankingHero.appendChild(item);
      }
    });

    if (rankingHero && ranking.length === 0) {
      rankingHero.innerHTML = "<p>Sin participantes aún</p>";
    }

  } catch (error) {
    console.error("Error al cargar clientes:", error);
  }
}

cargarClientesRegistrados();