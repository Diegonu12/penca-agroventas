const equipos = {
  mexico: { nombre: "México", bandera: "https://flagcdn.com/w80/mx.png" },
  sudafrica: { nombre: "Sudáfrica", bandera: "https://flagcdn.com/w80/za.png" },
  corea: { nombre: "Corea del Sur", bandera: "https://flagcdn.com/w80/kr.png" },
  chequia: { nombre: "Chequia", bandera: "https://flagcdn.com/w80/cz.png" },

  canada: { nombre: "Canadá", bandera: "https://flagcdn.com/w80/ca.png" },
  suiza: { nombre: "Suiza", bandera: "https://flagcdn.com/w80/ch.png" },
  qatar: { nombre: "Qatar", bandera: "https://flagcdn.com/w80/qa.png" },
  bosnia: { nombre: "Bosnia y Herzegovina", bandera: "https://flagcdn.com/w80/ba.png" },

  brasil: { nombre: "Brasil", bandera: "https://flagcdn.com/w80/br.png" },
  marruecos: { nombre: "Marruecos", bandera: "https://flagcdn.com/w80/ma.png" },
  haiti: { nombre: "Haití", bandera: "https://flagcdn.com/w80/ht.png" },
  escocia: { nombre: "Escocia", bandera: "https://flagcdn.com/w80/gb-sct.png" },

  usa: { nombre: "Estados Unidos", bandera: "https://flagcdn.com/w80/us.png" },
  paraguay: { nombre: "Paraguay", bandera: "https://flagcdn.com/w80/py.png" },
  australia: { nombre: "Australia", bandera: "https://flagcdn.com/w80/au.png" },
  turquia: { nombre: "Turquía", bandera: "https://flagcdn.com/w80/tr.png" },

  alemania: { nombre: "Alemania", bandera: "https://flagcdn.com/w80/de.png" },
  curacao: { nombre: "Curazao", bandera: "https://flagcdn.com/w80/cw.png" },
  costaMarfil: { nombre: "Costa de Marfil", bandera: "https://flagcdn.com/w80/ci.png" },
  ecuador: { nombre: "Ecuador", bandera: "https://flagcdn.com/w80/ec.png" },

  paisesBajos: { nombre: "Países Bajos", bandera: "https://flagcdn.com/w80/nl.png" },
  japon: { nombre: "Japón", bandera: "https://flagcdn.com/w80/jp.png" },
  suecia: { nombre: "Suecia", bandera: "https://flagcdn.com/w80/se.png" },
  tunez: { nombre: "Túnez", bandera: "https://flagcdn.com/w80/tn.png" },

  belgica: { nombre: "Bélgica", bandera: "https://flagcdn.com/w80/be.png" },
  egipto: { nombre: "Egipto", bandera: "https://flagcdn.com/w80/eg.png" },
  iran: { nombre: "Irán", bandera: "https://flagcdn.com/w80/ir.png" },
  nuevaZelanda: { nombre: "Nueva Zelanda", bandera: "https://flagcdn.com/w80/nz.png" },

  espana: { nombre: "España", bandera: "https://flagcdn.com/w80/es.png" },
  caboVerde: { nombre: "Cabo Verde", bandera: "https://flagcdn.com/w80/cv.png" },
  arabia: { nombre: "Arabia Saudita", bandera: "https://flagcdn.com/w80/sa.png" },
  uruguay: { nombre: "Uruguay", bandera: "https://flagcdn.com/w80/uy.png" },

  francia: { nombre: "Francia", bandera: "https://flagcdn.com/w80/fr.png" },
  senegal: { nombre: "Senegal", bandera: "https://flagcdn.com/w80/sn.png" },
  noruega: { nombre: "Noruega", bandera: "https://flagcdn.com/w80/no.png" },
  iraq: { nombre: "Irak", bandera: "https://flagcdn.com/w80/iq.png" },

  argentina: { nombre: "Argentina", bandera: "https://flagcdn.com/w80/ar.png" },
  argelia: { nombre: "Argelia", bandera: "https://flagcdn.com/w80/dz.png" },
  austria: { nombre: "Austria", bandera: "https://flagcdn.com/w80/at.png" },
  jordania: { nombre: "Jordania", bandera: "https://flagcdn.com/w80/jo.png" },

  portugal: { nombre: "Portugal", bandera: "https://flagcdn.com/w80/pt.png" },
  congo: { nombre: "RD Congo", bandera: "https://flagcdn.com/w80/cd.png" },
  uzbekistan: { nombre: "Uzbekistán", bandera: "https://flagcdn.com/w80/uz.png" },
  colombia: { nombre: "Colombia", bandera: "https://flagcdn.com/w80/co.png" },

  inglaterra: { nombre: "Inglaterra", bandera: "https://flagcdn.com/w80/gb-eng.png" },
  croacia: { nombre: "Croacia", bandera: "https://flagcdn.com/w80/hr.png" },
  ghana: { nombre: "Ghana", bandera: "https://flagcdn.com/w80/gh.png" },
  panama: { nombre: "Panamá", bandera: "https://flagcdn.com/w80/pa.png" }
};

const grupos = {
  A: ["mexico", "sudafrica", "corea", "chequia"],
  B: ["canada", "suiza", "qatar", "bosnia"],
  C: ["brasil", "marruecos", "haiti", "escocia"],
  D: ["usa", "paraguay", "australia", "turquia"],
  E: ["alemania", "curacao", "costaMarfil", "ecuador"],
  F: ["paisesBajos", "japon", "suecia", "tunez"],
  G: ["belgica", "egipto", "iran", "nuevaZelanda"],
  H: ["espana", "caboVerde", "arabia", "uruguay"],
  I: ["francia", "senegal", "noruega", "iraq"],
  J: ["argentina", "argelia", "austria", "jordania"],
  K: ["portugal", "congo", "uzbekistan", "colombia"],
  L: ["inglaterra", "croacia", "ghana", "panama"]
};

const fechasPorGrupo = {
  A: ["11/06/2026", "18/06/2026", "24/06/2026"],
  B: ["12/06/2026", "18/06/2026", "24/06/2026"],
  C: ["13/06/2026", "19/06/2026", "24/06/2026"],
  D: ["12/06/2026", "19/06/2026", "25/06/2026"],
  E: ["14/06/2026", "20/06/2026", "25/06/2026"],
  F: ["14/06/2026", "20/06/2026", "25/06/2026"],
  G: ["15/06/2026", "21/06/2026", "26/06/2026"],
  H: ["15/06/2026", "21/06/2026", "26/06/2026"],
  I: ["16/06/2026", "22/06/2026", "26/06/2026"],
  J: ["16/06/2026", "22/06/2026", "27/06/2026"],
  K: ["17/06/2026", "23/06/2026", "27/06/2026"],
  L: ["17/06/2026", "23/06/2026", "27/06/2026"]
};

function crearPartidos() {
  let id = 1;
  const partidosGenerados = [];

  Object.entries(grupos).forEach(([grupo, lista]) => {
    const [t1, t2, t3, t4] = lista;
    const fechas = fechasPorGrupo[grupo];

    const cruces = [
      [t1, t2, fechas[0], "FECHA 1"],
      [t3, t4, fechas[0], "FECHA 1"],
      [t1, t3, fechas[1], "FECHA 2"],
      [t4, t2, fechas[1], "FECHA 2"],
      [t4, t1, fechas[2], "FECHA 3"],
      [t2, t3, fechas[2], "FECHA 3"]
    ];

    cruces.forEach(([localKey, visitanteKey, fecha, jornada], index) => {
      partidosGenerados.push({
        id: id++,
        fecha: `${fecha} - ${index % 2 === 0 ? "16:00" : "19:00"}`,
        grupo: `GRUPO ${grupo} - ${jornada}`,
        local: equipos[localKey].nombre,
        visitante: equipos[visitanteKey].nombre,
        banderaLocal: equipos[localKey].bandera,
        banderaVisitante: equipos[visitanteKey].bandera,
        resultadoReal: [0, 0]
      });
    });
  });

  return partidosGenerados;
}

const partidos = crearPartidos();

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

  <div class="equipo equipo-local">
    <img src="${partido.banderaLocal}" alt="${partido.local}" class="bandera-img">
    <strong>${partido.local}</strong>
  </div>

  <input type="number" min="0" id="local-${partido.id}" placeholder="0" />

  <div class="vs">VS</div>

  <input type="number" min="0" id="visitante-${partido.id}" placeholder="0" />

  <div class="equipo equipo-visitante">
    <img src="${partido.banderaVisitante}" alt="${partido.visitante}" class="bandera-img">
    <strong>${partido.visitante}</strong>
  </div>

  <div class="grupo-partido">${partido.grupo}</div>
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

  