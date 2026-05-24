import {
  db,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc
} from "./firebase.js";

import { partidos } from "./data.js";

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
let filtroActual = "todos";

iniciarFixtureVendedor();

async function iniciarFixtureVendedor() {
  await cargarClientesEnSelect();
  mostrarFixture();
}

async function cargarClientesEnSelect() {

  clientesRegistrados = [];

  const resultado =
    await getDocs(collection(db, "usuarios"));

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
      alert("Ingresá tu código de acceso.");
      return;
    }

    const resultado = await getDocs(collection(db, "usuarios"));

    let clienteEncontrado = null;

    resultado.forEach((docCliente) => {
      const cliente = docCliente.data();

      if (cliente.codigoAcceso === codigo) {
        clienteEncontrado = {
          id: docCliente.id,
          ...cliente
        };
      }
    });

    if (!clienteEncontrado) {
      alert("Código incorrecto o cliente no encontrado.");
      return;
    }

    clienteActivo = clienteEncontrado.id;
    pronosticosActuales = {};

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

  

  const ref =
    doc(db, "pronosticos", clienteActivo);  

  const snap =
    await getDoc(ref);

  if (snap.exists()) {

    const datos =
      snap.data();

    pronosticosActuales =
      datos.partidos || {};

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

  return partidos.filter((partido) =>
    partido.grupo.includes(`GRUPO ${filtroActual}`)
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
    ${partidoYaComenzo(partido) ? "disabled" : ""}
  >

  <strong>VS</strong>

  <input
    type="number"
    class="input-pronostico"
    min="0"
    id="visitante-${partido.id}"
    value="${pronostico.visitante ?? ""}"
    placeholder="-"
    ${partidoYaComenzo(partido) ? "disabled" : ""}
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

  console.log("Cliente activo:", clienteActivo);

  if (!clienteActivo) {
    alert("Primero seleccioná un cliente.");
    return;
  }

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

  console.log("Pronósticos:", pronosticos);

  try {

    alert("Estoy por guardar en Firebase");

await setDoc(
  doc(db, "pronosticos", clienteActivo),
  {
    clienteId: clienteActivo,
    partidos: pronosticos,
    actualizado: new Date().toISOString()
  }
);

alert("Pronósticos guardados correctamente ✅");

} catch (error) {

  console.error("ERROR FIREBASE:", error);

  alert("Error Firebase: " + error.message);

}  

});
}