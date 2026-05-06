const partidos = [
  {
    id: 1,
    fecha: "11/06/2026 - 16:00",
    local: "México",
    visitante: "Sudáfrica",
    resultadoReal: [2, 1]
  },
  {
    id: 2,
    fecha: "12/06/2026 - 19:00",
    local: "Canadá",
    visitante: "Japón",
    resultadoReal: [1, 1]
  },
  {
    id: 3,
    fecha: "13/06/2026 - 13:00",
    local: "Uruguay",
    visitante: "Marruecos",
    resultadoReal: [3, 1]
  },
  {
    id: 4,
    fecha: "14/06/2026 - 16:00",
    local: "Brasil",
    visitante: "Alemania",
    resultadoReal: [2, 2]
  },
  {
    id: 5,
    fecha: "15/06/2026 - 21:00",
    local: "Argentina",
    visitante: "España",
    resultadoReal: [1, 0]
  }
];

let participantes = JSON.parse(localStorage.getItem("participantesAgroventas")) || [];

const formRegistro = document.getElementById("formRegistro");
const participanteActivo = document.getElementById("participanteActivo");
const listaFixture = document.getElementById("listaFixture");
const tablaPosiciones = document.getElementById("tablaPosiciones");
const guardarPronosticos = document.getElementById("guardarPronosticos");

formRegistro.addEventListener("submit", function (e) {
  e.preventDefault();

  const nuevoParticipante = {
    id: Date.now(),
    nombre: document.getElementById("nombre").value.trim(),
    tipo: "Cliente de Agroventas",
    empresa: document.getElementById("empresa").value.trim(),
    celular: document.getElementById("celular").value.trim(),
    pronosticos: {},
    puntos: 0
  };

  participantes.push(nuevoParticipante);
  guardarDatos();

  formRegistro.reset();
  actualizarParticipantes();
  actualizarTabla();

  alert("Cliente registrado correctamente.");
});

function mostrarFixture() {
  listaFixture.innerHTML = "";

  partidos.forEach((partido) => {
    const div = document.createElement("div");
    div.classList.add("partido");

    div.innerHTML = `
      <div class="fecha">${partido.fecha}</div>

      <div class="equipo-local">${partido.local}</div>

      <input 
        type="number" 
        min="0" 
        id="local-${partido.id}" 
        placeholder="0"
      />

      <div class="vs">VS</div>

      <input 
        type="number" 
        min="0" 
        id="visitante-${partido.id}" 
        placeholder="0"
      />

      <div class="equipo-visitante">${partido.visitante}</div>
    `;

    listaFixture.appendChild(div);
  });
}

function actualizarParticipantes() {
  participanteActivo.innerHTML = `<option value="">Seleccionar cliente</option>`;

  participantes.forEach((participante) => {
    const option = document.createElement("option");
    option.value = participante.id;
    option.textContent = `${participante.nombre} - ${participante.empresa}`;
    participanteActivo.appendChild(option);
  });
}

guardarPronosticos.addEventListener("click", function () {
  const idParticipante = Number(participanteActivo.value);

  if (!idParticipante) {
    alert("Primero seleccioná un cliente.");
    return;
  }

  const participante = participantes.find((p) => p.id === idParticipante);

  partidos.forEach((partido) => {
    const golesLocal = document.getElementById(`local-${partido.id}`).value;
    const golesVisitante = document.getElementById(`visitante-${partido.id}`).value;

    if (golesLocal !== "" && golesVisitante !== "") {
      participante.pronosticos[partido.id] = [
        Number(golesLocal),
        Number(golesVisitante)
      ];
    }
  });

  participante.puntos = calcularPuntos(participante);

  guardarDatos();
  actualizarTabla();

  alert("Pronósticos guardados correctamente.");
});

function calcularPuntos(participante) {
  let puntos = 0;

  partidos.forEach((partido) => {
    const pronostico = participante.pronosticos[partido.id];

    if (!pronostico) return;

    const realLocal = partido.resultadoReal[0];
    const realVisitante = partido.resultadoReal[1];

    const pronLocal = pronostico[0];
    const pronVisitante = pronostico[1];

    if (pronLocal === realLocal && pronVisitante === realVisitante) {
      puntos += 3;
    } else if (
      obtenerResultado(pronLocal, pronVisitante) ===
      obtenerResultado(realLocal, realVisitante)
    ) {
      puntos += 1;
    }
  });

  return puntos;
}

function obtenerResultado(local, visitante) {
  if (local > visitante) return "local";
  if (local < visitante) return "visitante";
  return "empate";
}

function actualizarTabla() {
  tablaPosiciones.innerHTML = "";

  const ordenados = [...participantes].sort((a, b) => b.puntos - a.puntos);

  ordenados.forEach((participante, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${participante.nombre}</td>
      <td>${participante.empresa}</td>
      <td><strong>${participante.puntos}</strong></td>
    `;

    tablaPosiciones.appendChild(fila);
  });
}

function guardarDatos() {
  localStorage.setItem("participantesAgroventas", JSON.stringify(participantes));
}

mostrarFixture();
actualizarParticipantes();
actualizarTabla();

  