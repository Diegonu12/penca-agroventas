import {
  db,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc
} from "./firebase.js";

import { partidos } from "./data.js?v=14";

const listaFixture = document.getElementById("listaFixture");
const guardarPronosticos = document.getElementById("guardarPronosticos");
const botonesFiltro = document.querySelectorAll(".filtro-btn");
const contadorPartidos = document.getElementById("contadorPartidos");
const codigoCliente = document.getElementById("codigoCliente");
const buscarPorCodigo = document.getElementById("buscarPorCodigo");
const clienteSeleccionadoTexto = document.getElementById("clienteSeleccionadoTexto");

let clienteActivo = null;
let clientesRegistrados = [];
let pronosticosActuales = {};
let pronosticosGuardadosOriginales = {};
let filtroActual = obtenerFiltroInicialDesdeUrl();
let resultadosOficiales = {};
function obtenerFiltroInicialDesdeUrl() {
  const parametros = new URLSearchParams(window.location.search);
  const filtro = parametros.get("filtro");

  if (filtro === "16avos") {
    return "16avos de final";
  }

  return "todos";
}
function marcarBotonFiltroActivo() {
  botonesFiltro.forEach((boton) => {
    boton.classList.remove("activo");

    if (boton.dataset.filtro === filtroActual) {
      boton.classList.add("activo");
    }
  });
}

iniciarFixtureVendedor();

async function iniciarFixtureVendedor() {
  await cargarClientesEnSelect();
  await cargarResultadosOficiales();
  marcarBotonFiltroActivo();
  mostrarFixture();
}

async function cargarClientesEnSelect() {
  clientesRegistrados = [];

  const resultado = await getDocs(collection(db, "usuarios"));

  resultado.forEach((docCliente) => {
    const cliente = docCliente.data();

    clientesRegistrados.push({
      id: docCliente.id,
      nombre: cliente.nombre || "",
      telefono: cliente.telefono || "",
      email: cliente.email || ""
    });
  });
}

if (buscarPorCodigo) {
  buscarPorCodigo.addEventListener("click", async () => {
    const codigo = codigoCliente.value.trim();

    if (!codigo) {
      alert("Ingresá tu número de teléfono.");
      return;
    }

    const resultado = await getDocs(collection(db, "usuarios"));

    let clienteEncontrado = null;

    resultado.forEach((docCliente) => {
      const cliente = docCliente.data();

      if (cliente.telefono === codigo) {
        clienteEncontrado = {
          id: docCliente.id,
          ...cliente
        };
      }
    });

    if (!clienteEncontrado) {
      alert("Número no encontrado.");
      return;
    }

    clienteActivo = clienteEncontrado.id;
    pronosticosActuales = {};
    pronosticosGuardadosOriginales = {};

    if (clienteSeleccionadoTexto) {
      clienteSeleccionadoTexto.textContent =
        `Cliente: ${clienteEncontrado.nombre}`;
    }

    await cargarPronosticosGuardados();
    mostrarFixture();
  });
}

async function cargarPronosticosGuardados() {
  if (!clienteActivo) return;

  const ref = doc(db, "pronosticos", clienteActivo);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const datos = snap.data();

    pronosticosActuales = datos.partidos || {};

    pronosticosGuardadosOriginales =
      JSON.parse(JSON.stringify(pronosticosActuales));
  }
}

function obtenerPartidosFiltrados() {
  if (filtroActual === "todos") return partidos;

  if (filtroActual === "uruguay") {
    return partidos.filter((partido) =>
      partido.local.toLowerCase() === "uruguay" ||
      partido.visitante.toLowerCase() === "uruguay"
    );
  }

  const grupos = [
    "A", "B", "C", "D", "E", "F",
    "G", "H", "I", "J", "K", "L"
  ];

  if (grupos.includes(filtroActual)) {
    return partidos.filter((partido) =>
      partido.grupo.includes(`GRUPO ${filtroActual}`)
    );
  }

  return partidos.filter((partido) =>
    partido.grupo === filtroActual
  );
}

function partidoYaComenzo(partido) {
  const partes = partido.fecha.split(" - ");

  if (partes.length < 2) return false;

  const fecha = partes[0];
  const hora = partes[1];

  const [dia, mes, anio] = fecha.split("/");

  const fechaPartido =
    new Date(`${anio}-${mes}-${dia}T${hora}:00`);

  return new Date() >= fechaPartido;
}

function partidoTieneEquipoPendiente(partido) {
  const textoLocal = partido.local.toLowerCase();
  const textoVisitante = partido.visitante.toLowerCase();

  return (
    textoLocal.includes("confirmar") ||
    textoVisitante.includes("confirmar") ||
    textoLocal.includes("grupo") ||
    textoVisitante.includes("grupo") ||
    textoLocal.includes("ganador") ||
    textoVisitante.includes("ganador") ||
    textoLocal.includes("perdedor") ||
    textoVisitante.includes("perdedor")
  );
}

function esFaseFinal(partido) {
  return (
    partido.grupo === "16avos de final" ||
    partido.grupo === "Octavos de final" ||
    partido.grupo === "Cuartos de final" ||
    partido.grupo === "Semifinal" ||
    partido.grupo === "Final"
  );
}

async function cargarResultadosOficiales() {
  resultadosOficiales = {};

  const resultado = await getDocs(collection(db, "resultadosOficiales"));

  resultado.forEach((docResultado) => {
    resultadosOficiales[docResultado.id] = docResultado.data();
  });
}

function calcularEstadoPronostico(pronostico, real, partido) {
  if (!pronostico || !real) return null;

  const pronosticoLocal = Number(pronostico.local);
  const pronosticoVisitante = Number(pronostico.visitante);
  const realLocal = Number(real.local);
  const realVisitante = Number(real.visitante);

  const diferenciaPronostico =
    pronosticoLocal - pronosticoVisitante;

  const diferenciaReal =
    realLocal - realVisitante;

  const signoPronostico = Math.sign(diferenciaPronostico);
  const signoReal = Math.sign(diferenciaReal);

  const resultadoExacto =
    pronosticoLocal === realLocal &&
    pronosticoVisitante === realVisitante;

  if (esFaseFinal(partido)) {
    if (resultadoExacto) {
      return {
        texto: "🎯 Resultado exacto +8 puntos",
        clase: "acierto-exacto"
      };
    }

    if (
      diferenciaReal !== 0 &&
      diferenciaPronostico === diferenciaReal
    ) {
      return {
        texto: "✅ Acertaste diferencia de goles +5 puntos",
        clase: "acierto-diferencia"
      };
    }

    if (
      signoReal !== 0 &&
      signoPronostico === signoReal
    ) {
      return {
        texto: "✅ Acertaste ganador +3 puntos",
        clase: "acierto-ganador"
      };
    }

    if (
      diferenciaReal === 0 &&
      diferenciaPronostico === 0
    ) {
      return {
        texto: "🤝 Acertaste empate +1 punto",
        clase: "acierto-empate"
      };
    }

    return {
      texto: "❌ Sin puntos",
      clase: "sin-puntos"
    };
  }

  if (resultadoExacto) {
    return {
      texto: "🎯 Acierto exacto +3 puntos",
      clase: "acierto-exacto"
    };
  }

  if (signoPronostico === signoReal) {
    return {
      texto: "✅ Acertaste ganador/empate +1 punto",
      clase: "acierto-ganador"
    };
  }

  return {
    texto: "❌ Sin puntos",
    clase: "sin-puntos"
  };
}

function mostrarFixture() {
  if (!listaFixture) return;

  listaFixture.innerHTML = "";

  const partidosFiltrados = obtenerPartidosFiltrados();

  if (contadorPartidos) {
    contadorPartidos.textContent =
      `Mostrando ${partidosFiltrados.length} partido(s)`;
  }

  partidosFiltrados.forEach((partido) => {
    const pronostico = pronosticosActuales[partido.id] || {};
    const resultadoOficial = resultadosOficiales[String(partido.id)];

    const estadoPronostico = calcularEstadoPronostico(
      pronostico,
      resultadoOficial,
      partido
    );

    const pronosticoBloqueado =
      partidoYaComenzo(partido) || partidoTieneEquipoPendiente(partido);

    const div = document.createElement("div");
    div.classList.add("partido");

    div.innerHTML = `
      <div class="app-card-fecha">
        ${partido.fecha}
      </div>

      <div class="app-card-equipos">

        <div class="app-equipo">
          <img src="${partido.banderaLocal}" alt="${partido.local}">
          <span>${partido.local}</span>
        </div>

        <div class="app-pronostico">

          <input
            type="number"
            class="input-pronostico"
            min="0"
            id="local-${partido.id}"
            value="${pronostico.local ?? ""}"
            placeholder="-"
            ${pronosticoBloqueado ? "disabled" : ""}
          >

          <strong>VS</strong>

          <input
            type="number"
            class="input-pronostico"
            min="0"
            id="visitante-${partido.id}"
            value="${pronostico.visitante ?? ""}"
            placeholder="-"
            ${pronosticoBloqueado ? "disabled" : ""}
          >

        </div>

        <div class="app-equipo">
          <img src="${partido.banderaVisitante}" alt="${partido.visitante}">
          <span>${partido.visitante}</span>
        </div>

      </div>

      <div class="app-card-footer">
        ${partido.grupo}
      </div>

      ${partidoTieneEquipoPendiente(partido) ? `
        <div class="partido-pendiente">
          Partido pendiente de confirmación. Se habilitará cuando estén definidos los equipos.
        </div>
      ` : ""}

      ${resultadoOficial ? `
        <div class="resultado-oficial">
          <strong>Resultado oficial:</strong>
          ${partido.local} ${resultadoOficial.local} - ${resultadoOficial.visitante} ${partido.visitante}
        </div>

        ${estadoPronostico ? `
          <div class="estado-pronostico ${estadoPronostico.clase}">
            ${estadoPronostico.texto}
          </div>
        ` : ""}
      ` : ""}
    `;

    listaFixture.appendChild(div);
  });
}

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    guardarValoresTemporales();

    botonesFiltro.forEach((btn) => btn.classList.remove("activo"));
    boton.classList.add("activo");

    filtroActual = boton.dataset.filtro;

    mostrarFixture();
  });
});

function guardarValoresTemporales() {
  const inputs = document.querySelectorAll("#listaFixture input");

  inputs.forEach((input) => {
    if (input.disabled) return;

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

function pronosticoCompleto(datos) {
  return (
    datos &&
    datos.local !== undefined &&
    datos.visitante !== undefined
  );
}

if (guardarPronosticos) {
  guardarPronosticos.addEventListener("click", async () => {
    if (!clienteActivo) {
      alert("Primero seleccioná un cliente.");
      return;
    }

    guardarValoresTemporales();

    const pronosticos = {};

    Object.entries(pronosticosActuales).forEach(([idPartido, datos]) => {
      const partido = partidos.find(
        (p) => String(p.id) === String(idPartido)
      );

      if (!partido) return;

      const partidoBloqueado =
        partidoYaComenzo(partido) || partidoTieneEquipoPendiente(partido);

      const original = pronosticosGuardadosOriginales[idPartido];

      if (partidoBloqueado) {
        if (pronosticoCompleto(original)) {
          pronosticos[idPartido] = original;
        }

        return;
      }

      if (pronosticoCompleto(datos)) {
        pronosticos[idPartido] = {
          local: Number(datos.local),
          visitante: Number(datos.visitante),
          partido: `${partido.local} vs ${partido.visitante}`,
          grupo: partido.grupo,
          fecha: partido.fecha
        };
      }
    });

    try {
      await setDoc(
        doc(db, "pronosticos", clienteActivo),
        {
          clienteId: clienteActivo,
          partidos: pronosticos,
          actualizado: new Date().toISOString()
        }
      );

      pronosticosGuardadosOriginales =
        JSON.parse(JSON.stringify(pronosticos));

      pronosticosActuales =
        JSON.parse(JSON.stringify(pronosticos));

      alert("Pronósticos guardados correctamente ✅");

    } catch (error) {
      console.error("ERROR FIREBASE:", error);
      alert("Error Firebase: " + error.message);
    }
  });
}