import {
  db,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc
} from "./firebase.js";

import { partidos } from "./data.js?v=46";

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

  if (!filtro) {
    return "todos";
  }

  const filtrosValidos = [
    "todos",
    "16avos de final",
    "Octavos de final",
    "Cuartos de final",
    "Semifinal",
    "Final"
  ];

  if (filtrosValidos.includes(filtro)) {
    return filtro;
  }

  if (filtro.toLowerCase() === "16avos") {
    return "16avos de final";
  }

  if (filtro.toLowerCase() === "octavos") {
    return "Octavos de final";
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
  marcarBotonFiltroActivo();

  // Primero mostramos el fixture aunque Firebase demore o falle
  mostrarFixture();

  try {
    await cargarClientesEnSelect();
  } catch (error) {
    console.error("Error cargando clientes:", error);
  }

  try {
    await cargarResultadosOficiales();
  } catch (error) {
    console.error("Error cargando resultados oficiales:", error);
  }

  // Volvemos a mostrar el fixture con los datos que se hayan podido cargar
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

function normalizarTextoFiltro(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function obtenerPartidosFiltrados() {

  if (filtroActual === "todos") {
    return partidos.filter((partido) =>
      partido.id >= 73 && partido.id <= 104
    );
  }

  if (filtroActual === "16avos de final") {
    return partidos.filter((partido) =>
      partido.id >= 73 && partido.id <= 88
    );
  }

  if (filtroActual === "Octavos de final") {
    return partidos.filter((partido) =>
      partido.id >= 89 && partido.id <= 96
    );
  }

  if (filtroActual === "Cuartos de final") {
    return partidos.filter((partido) =>
      partido.id >= 97 && partido.id <= 100
    );
  }

  if (filtroActual === "Semifinal") {
    return partidos.filter((partido) =>
      partido.id === 101 || partido.id === 102
    );
  }

  if (filtroActual === "Final") {
    return partidos.filter((partido) =>
      partido.id === 104
    );
  }

  if (filtroActual === "uruguay") {
    return partidos.filter((partido) =>
      partido.local.toLowerCase() === "uruguay" ||
      partido.visitante.toLowerCase() === "uruguay"
    );
  }

  return partidos;
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
  const textoLocal = String(partido.local || "").toLowerCase();
  const textoVisitante = String(partido.visitante || "").toLowerCase();

  return (
    textoLocal.includes("confirmar") ||
    textoVisitante.includes("confirmar") ||
    textoLocal.includes("grupo") ||
    textoVisitante.includes("grupo") ||
    textoLocal.includes("ganador") ||
    textoVisitante.includes("ganador") ||
    textoLocal.includes("perdedor") ||
    textoVisitante.includes("perdedor") ||
    textoLocal.includes("tbd") ||
    textoVisitante.includes("tbd")
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


  console.log("Filtro actual:", filtroActual);
  console.log("Partidos cargados:", partidos.length);
  console.log("Grupos existentes:", partidos.map((p) => p.grupo));
  console.log("Partidos filtrados:", partidosFiltrados);


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

    filtroActual = boton.dataset.filtro;

    const nuevaUrl = new URL(window.location.href);

    if (filtroActual === "todos") {
      nuevaUrl.searchParams.delete("filtro");
    } else {
      nuevaUrl.searchParams.set("filtro", filtroActual);
    }

    window.history.replaceState({}, "", nuevaUrl);

    marcarBotonFiltroActivo();
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

    const pronosticoRef = doc(db, "pronosticos", clienteActivo);
    const pronosticoSnap = await getDoc(pronosticoRef);

    const partidosGuardadosEnFirebase =
      pronosticoSnap.exists() && pronosticoSnap.data().partidos
        ? pronosticoSnap.data().partidos
        : {};

    const partidosAActualizar = {};

    Object.entries(pronosticosActuales).forEach(([idPartido, datos]) => {
      const partido = partidos.find(
        (p) => String(p.id) === String(idPartido)
      );

      if (!partido) return;

      const partidoBloqueado =
        partidoYaComenzo(partido) || partidoTieneEquipoPendiente(partido);

      // Si el partido ya empezó, no se modifica.
      // Pero tampoco se borra lo que ya estaba guardado.
      if (partidoBloqueado) {
        return;
      }

      if (pronosticoCompleto(datos)) {
        partidosAActualizar[idPartido] = {
          local: Number(datos.local),
          visitante: Number(datos.visitante),
          partido: `${partido.local} vs ${partido.visitante}`,
          grupo: partido.grupo,
          fecha: partido.fecha
        };
      }
    });

    if (Object.keys(partidosAActualizar).length === 0) {
      alert("No hay pronósticos nuevos para guardar.");
      return;
    }

    try {
      

      // Guardado seguro: solo actualiza/agrega partidos nuevos.
      // No borra los anteriores.
      await setDoc(
        pronosticoRef,
        {
          clienteId: clienteActivo,
          partidos: partidosAActualizar,
          actualizado: new Date().toISOString()
        },
        { merge: true }
      );

      const partidosCombinados = {
        ...partidosGuardadosEnFirebase,
        ...partidosAActualizar
      };

      pronosticosGuardadosOriginales =
        JSON.parse(JSON.stringify(partidosCombinados));

      pronosticosActuales =
        JSON.parse(JSON.stringify(partidosCombinados));

      alert("Pronósticos guardados correctamente ✅");

    } catch (error) {
      console.error("ERROR FIREBASE:", error);
      alert("Error Firebase: " + error.message);
    }
  });
}