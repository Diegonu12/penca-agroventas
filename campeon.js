import {
  db,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc
} from "./firebase.js";

import { partidos } from "./data.js?v=50";

const telefonoCampeon = document.getElementById("campeonTelefono");
const guardarCampeon = document.getElementById("guardarCampeon");
const mensajeCampeon = document.getElementById("mensajeCampeon");

function mostrarMensajeCampeon(texto, tipo = "") {
  if (!mensajeCampeon) return;

  mensajeCampeon.textContent = texto;
  mensajeCampeon.className = "mensaje-campeon";

  if (tipo) {
    mensajeCampeon.classList.add(tipo);
  }
}

function obtenerCampeonSeleccionado() {
  const seleccionado = document.querySelector(
    'input[name="campeonSeleccion"]:checked'
  );

  return seleccionado ? seleccionado.value : "";
}

function obtenerFechaInicioFinal() {
  const partidoFinal = partidos.find((partido) => Number(partido.id) === 104);

  if (!partidoFinal || !partidoFinal.fecha) {
    return null;
  }

  // Formato esperado: "19/07/2026 - 16:00"
  const [fecha, hora] = partidoFinal.fecha.split(" - ");

  if (!fecha || !hora) {
    return null;
  }

  const [dia, mes, anio] = fecha.split("/");
  const [horas, minutos] = hora.split(":");

  if (!dia || !mes || !anio || !horas || !minutos) {
    return null;
  }

  // Hora de Uruguay: -03:00
  return new Date(
    `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}T${horas.padStart(2, "0")}:${minutos.padStart(2, "0")}:00-03:00`
  );
}

function eleccionCampeonBloqueada() {
  const fechaInicioFinal = obtenerFechaInicioFinal();

  if (!fechaInicioFinal) {
    return false;
  }

  return new Date() >= fechaInicioFinal;
}

function bloquearFormularioCampeonSiCorresponde() {
  if (!eleccionCampeonBloqueada()) {
    return;
  }

  if (telefonoCampeon) {
    telefonoCampeon.disabled = true;
  }

  document
    .querySelectorAll('input[name="campeonSeleccion"]')
    .forEach((input) => {
      input.disabled = true;
    });

  if (guardarCampeon) {
    guardarCampeon.disabled = true;
    guardarCampeon.textContent = "Elección cerrada";
  }

  mostrarMensajeCampeon(
    "La elección del campeón ya cerró porque comenzó la final.",
    "error"
  );
}

async function buscarClientePorTelefono(telefono) {
  const usuariosSnap = await getDocs(collection(db, "usuarios"));

  let clienteEncontrado = null;

  usuariosSnap.forEach((docUsuario) => {
    const usuario = docUsuario.data();

    const telefonoUsuario = String(usuario.telefono || "").trim();
    const idUsuario = String(docUsuario.id || "").trim();

    if (telefonoUsuario === telefono || idUsuario === telefono) {
      clienteEncontrado = {
        id: docUsuario.id,
        nombre: usuario.nombre || "",
        telefono: usuario.telefono || telefono
      };
    }
  });

  return clienteEncontrado;
}

bloquearFormularioCampeonSiCorresponde();

if (guardarCampeon) {
  guardarCampeon.addEventListener("click", async () => {
    if (eleccionCampeonBloqueada()) {
      bloquearFormularioCampeonSiCorresponde();
      return;
    }

    const telefono = telefonoCampeon.value.trim();
    const campeon = obtenerCampeonSeleccionado();

    if (!telefono) {
      mostrarMensajeCampeon("Ingresá tu teléfono registrado.", "error");
      return;
    }

    if (!campeon) {
      mostrarMensajeCampeon("Seleccioná una selección campeona.", "error");
      return;
    }

    guardarCampeon.disabled = true;
    guardarCampeon.textContent = "Guardando...";

    try {
      const cliente = await buscarClientePorTelefono(telefono);

      if (!cliente) {
        mostrarMensajeCampeon(
          "No encontramos un cliente con ese teléfono.",
          "error"
        );
        return;
      }

      const pronosticoRef = doc(db, "pronosticos", cliente.id);
      const pronosticoSnap = await getDoc(pronosticoRef);

      const datosActuales = pronosticoSnap.exists()
        ? pronosticoSnap.data()
        : {};

      const campeonAnterior =
        datosActuales.campeonMundial?.seleccion || "";

      if (campeonAnterior === campeon) {
        mostrarMensajeCampeon(
          `Ya tenías elegido a ${campeon} como campeón.`,
          "ok"
        );
        return;
      }

      await setDoc(
        pronosticoRef,
        {
          clienteId: cliente.id,
          campeonMundial: {
            seleccion: campeon,
            seleccionAnterior: campeonAnterior || null,
            puntosSiAcierta: 100,
            nombreCliente: cliente.nombre,
            telefono: cliente.telefono,
            modificado: new Date().toISOString()
          },
          actualizadoCampeon: new Date().toISOString()
        },
        { merge: true }
      );

      if (campeonAnterior) {
        mostrarMensajeCampeon(
          `Cambio guardado ✅ Antes tenías ${campeonAnterior} y ahora elegiste ${campeon}.`,
          "ok"
        );
      } else {
        mostrarMensajeCampeon(
          `Listo ✅ Elegiste a ${campeon} como campeón. Si acierta, suma 100 puntos.`,
          "ok"
        );
      }

    } catch (error) {
      console.error("Error guardando campeón:", error);
      mostrarMensajeCampeon(
        "Error al guardar. Intentá de nuevo.",
        "error"
      );

    } finally {
      if (!eleccionCampeonBloqueada()) {
        guardarCampeon.disabled = false;
        guardarCampeon.textContent = "Guardar campeón";
      } else {
        bloquearFormularioCampeonSiCorresponde();
      }
    }
  });
}