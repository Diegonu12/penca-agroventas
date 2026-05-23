
import {
  db,
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  orderBy
} from "./firebase.js";

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
      const idCliente = Date.now().toString();

    const codigoAcceso = Math.floor(100000 + Math.random() * 900000).toString();

await setDoc(doc(db, "usuarios", idCliente), {
  nombre,
  direccion,
  cumple,
  telefono,
  email,
  codigoAcceso,
  puntos: 0,
  creado: new Date().toISOString()
});

alert(
  `Cliente registrado correctamente ✅\n\nCódigo de acceso: ${codigoAcceso}\n\nGuardá este código para cargar sus pronósticos.`
);

      alert("Cliente registrado correctamente ✅");

      formIndex.reset();

      cargarClientesRegistrados();

    } catch (error) {
      console.error("Error al registrar cliente:", error);
      alert("No se pudo registrar el cliente. Revisá Firebase o la consola.");
    }
  });
} else {
  console.error("No se encontró el formulario registro-cliente-index");
}

async function cargarClientesRegistrados() {
  if (!tablaPosiciones) return;

  tablaPosiciones.innerHTML = "";

  if (rankingHero) {
    rankingHero.innerHTML = "";
  }

  try {
    const consulta = query(
      collection(db, "usuarios"),
      orderBy("puntos", "desc")
    );

    const resultado = await getDocs(consulta);

    let posicion = 1;

    resultado.forEach((docUsuario) => {
      const usuario = docUsuario.data();

      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${posicion}</td>
        <td>${usuario.nombre || "-"}</td>
        <td>${usuario.telefono || "-"}</td>
        <td>${usuario.cumple || "-"}</td>
        <td><strong>${usuario.puntos || 0}</strong></td>
      `;

      tablaPosiciones.appendChild(fila);

      if (rankingHero && posicion <= 3) {
        const item = document.createElement("p");

        item.textContent =
          `${posicion}. ${usuario.nombre || "-"} — ${usuario.puntos || 0} pts`;

        rankingHero.appendChild(item);
      }

      posicion++;
    });

    if (rankingHero && posicion === 1) {
      rankingHero.innerHTML = "<p>Sin participantes aún</p>";
    }

  } catch (error) {
    console.error("Error al cargar clientes:", error);
  }
}

cargarClientesRegistrados();