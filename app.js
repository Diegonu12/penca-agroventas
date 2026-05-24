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

if (buscadorCliente && listaClientes) {

  buscadorCliente.addEventListener("input", () => {

    const texto =
      buscadorCliente.value.toLowerCase().trim();

    listaClientes.innerHTML = "";

    if (texto.length < 2) {
      listaClientes.style.display = "none";
      return;
    }

    const filtrados =
      clientesRegistrados.filter((cliente) => {

      return (
        cliente.nombre.toLowerCase().includes(texto) ||
        cliente.telefono.toLowerCase().includes(texto) ||
        cliente.email.toLowerCase().includes(texto)
      );

    });

    if (filtrados.length === 0) {

      listaClientes.innerHTML =
        `<div class="resultado-cliente-item">
          No se encontraron clientes
        </div>`;

      listaClientes.style.display = "block";

      return;
    }

    filtrados.forEach((cliente) => {

      const item =
        document.createElement("div");

      item.classList.add("resultado-cliente-item");

     item.innerHTML = `
  <div class="cliente-item-nombre">
    ${cliente.nombre}
  </div>

  <div class="cliente-item-info">
    📞 ${cliente.telefono || "Sin teléfono"} 
    ${cliente.email ? " · ✉️ " + cliente.email : ""}
  </div>
`;

      item.addEventListener("click", async () => {

        clienteActivo = cliente.id;

        pronosticosActuales = {};

        buscadorCliente.value =
          cliente.nombre;

        listaClientes.innerHTML = "";

        listaClientes.style.display = "none";

        if (clienteSeleccionadoTexto) {

          clienteSeleccionadoTexto.textContent =
            `Cliente seleccionado: ${cliente.nombre}`;

        }

        await cargarPronosticosGuardados();

        mostrarFixture();

      });

      listaClientes.appendChild(item);

    });

    listaClientes.style.display = "block";

  });

}
async function cargarPronosticosGuardados() {

  if (!clienteActivo) return;

  desbloquearInputsPronosticos(); 

  const ref =
    doc(db, "pronosticos", clienteActivo);

  const snap =
    await getDoc(ref);

  if (snap.exists()) {

    const datos = snap.data();

    pronosticosActuales =
      datos.partidos || {};

    if (datos.bloqueado === true) {

      const confirmar =
        confirm(
          "Tus pronósticos ya fueron guardados.\n\n¿Deseás solicitar modificación al vendedor?"
        );

      if (confirmar) {

        const clave =
          prompt("Ingresá la clave del vendedor");

        if (clave !== "Agro2026") {

          alert("Clave incorrecta. Pronósticos bloqueados.");

          bloquearInputsPronosticos();

          return;
        }

        alert("Edición habilitada por vendedor ✅");

        desbloquearInputsPronosticos();

      } else {

        bloquearInputsPronosticos();

      }

    }

  }

}
function bloquearInputsPronosticos() {

  document
    .querySelectorAll(".input-pronostico")
    .forEach((input) => {

      input.disabled = true;

    });

  const botonGuardar =
    document.getElementById("guardarPronosticos");

  if (botonGuardar) {

    botonGuardar.disabled = true;

    botonGuardar.style.opacity = "0.5";

    botonGuardar.style.cursor =
      "not-allowed";

  }

}
function desbloquearInputsPronosticos() {

  document
    .querySelectorAll(".input-pronostico")
    .forEach((input) => {
      input.disabled = false;
    });

  const botonGuardar =
    document.getElementById("guardarPronosticos");

  if (botonGuardar) {
    botonGuardar.disabled = false;
    botonGuardar.style.opacity = "1";
    botonGuardar.style.cursor = "pointer";
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
  >

  <strong>VS</strong>

  <input
    type="number"
    class="input-pronostico"
    min="0"
    id="visitante-${partido.id}"
    value="${pronostico.visitante ?? ""}"
    placeholder="-"
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
    bloqueado: true,
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