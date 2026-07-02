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

const fixtureBase = [
  // 11/06/2026
  { fecha: "11/06/2026 - 16:00", grupo: "A", jornada: "FECHA 1", local: "mexico", visitante: "sudafrica" },
  { fecha: "11/06/2026 - 23:00", grupo: "A", jornada: "FECHA 1", local: "corea", visitante: "chequia" },

  // 12/06/2026
  { fecha: "12/06/2026 - 16:00", grupo: "B", jornada: "FECHA 1", local: "canada", visitante: "bosnia" },
  { fecha: "12/06/2026 - 22:00", grupo: "D", jornada: "FECHA 1", local: "usa", visitante: "paraguay" },

  // 13/06/2026
  { fecha: "13/06/2026 - 16:00", grupo: "B", jornada: "FECHA 1", local: "qatar", visitante: "suiza" },
  { fecha: "13/06/2026 - 19:00", grupo: "C", jornada: "FECHA 1", local: "brasil", visitante: "marruecos" },
  { fecha: "13/06/2026 - 22:00", grupo: "C", jornada: "FECHA 1", local: "haiti", visitante: "escocia" },

  // 14/06/2026
  { fecha: "14/06/2026 - 01:00", grupo: "D", jornada: "FECHA 1", local: "australia", visitante: "turquia" },
  { fecha: "14/06/2026 - 14:00", grupo: "E", jornada: "FECHA 1", local: "alemania", visitante: "curacao" },
  { fecha: "14/06/2026 - 17:00", grupo: "F", jornada: "FECHA 1", local: "paisesBajos", visitante: "japon" },
  { fecha: "14/06/2026 - 20:00", grupo: "E", jornada: "FECHA 1", local: "costaMarfil", visitante: "ecuador" },
  { fecha: "14/06/2026 - 23:00", grupo: "F", jornada: "FECHA 1", local: "suecia", visitante: "tunez" },

  // 15/06/2026
  { fecha: "15/06/2026 - 13:00", grupo: "H", jornada: "FECHA 1", local: "espana", visitante: "caboVerde" },
  { fecha: "15/06/2026 - 16:00", grupo: "G", jornada: "FECHA 1", local: "belgica", visitante: "egipto" },
  { fecha: "15/06/2026 - 19:00", grupo: "H", jornada: "FECHA 1", local: "arabia", visitante: "uruguay" },
  { fecha: "15/06/2026 - 22:00", grupo: "G", jornada: "FECHA 1", local: "iran", visitante: "nuevaZelanda" },

  // 16/06/2026
  { fecha: "16/06/2026 - 16:00", grupo: "I", jornada: "FECHA 1", local: "francia", visitante: "senegal" },
  { fecha: "16/06/2026 - 19:00", grupo: "I", jornada: "FECHA 1", local: "iraq", visitante: "noruega" },
  { fecha: "16/06/2026 - 22:00", grupo: "J", jornada: "FECHA 1", local: "argentina", visitante: "argelia" },

  // 17/06/2026
  { fecha: "17/06/2026 - 01:00", grupo: "J", jornada: "FECHA 1", local: "austria", visitante: "jordania" },
  { fecha: "17/06/2026 - 14:00", grupo: "K", jornada: "FECHA 1", local: "portugal", visitante: "congo" },
  { fecha: "17/06/2026 - 17:00", grupo: "L", jornada: "FECHA 1", local: "inglaterra", visitante: "croacia" },
  { fecha: "17/06/2026 - 20:00", grupo: "L", jornada: "FECHA 1", local: "ghana", visitante: "panama" },
  { fecha: "17/06/2026 - 23:00", grupo: "K", jornada: "FECHA 1", local: "uzbekistan", visitante: "colombia" },

  // 18/06/2026
  { fecha: "18/06/2026 - 13:00", grupo: "A", jornada: "FECHA 2", local: "chequia", visitante: "sudafrica" },
  { fecha: "18/06/2026 - 16:00", grupo: "B", jornada: "FECHA 2", local: "suiza", visitante: "bosnia" },
  { fecha: "18/06/2026 - 19:00", grupo: "B", jornada: "FECHA 2", local: "canada", visitante: "qatar" },
  { fecha: "18/06/2026 - 22:00", grupo: "A", jornada: "FECHA 2", local: "mexico", visitante: "corea" },

  // 19/06/2026
  { fecha: "19/06/2026 - 16:00", grupo: "D", jornada: "FECHA 2", local: "usa", visitante: "australia" },
  { fecha: "19/06/2026 - 19:00", grupo: "C", jornada: "FECHA 2", local: "escocia", visitante: "marruecos" },
  { fecha: "19/06/2026 - 21:30", grupo: "C", jornada: "FECHA 2", local: "brasil", visitante: "haiti" },

  // 20/06/2026
  { fecha: "20/06/2026 - 00:00", grupo: "D", jornada: "FECHA 2", local: "turquia", visitante: "paraguay" },
  { fecha: "20/06/2026 - 14:00", grupo: "F", jornada: "FECHA 2", local: "paisesBajos", visitante: "suecia" },
  { fecha: "20/06/2026 - 17:00", grupo: "E", jornada: "FECHA 2", local: "alemania", visitante: "costaMarfil" },
  { fecha: "20/06/2026 - 21:00", grupo: "E", jornada: "FECHA 2", local: "ecuador", visitante: "curacao" },

  // 21/06/2026
  { fecha: "21/06/2026 - 01:00", grupo: "F", jornada: "FECHA 2", local: "tunez", visitante: "japon" },
  { fecha: "21/06/2026 - 13:00", grupo: "H", jornada: "FECHA 2", local: "espana", visitante: "arabia" },
  { fecha: "21/06/2026 - 16:00", grupo: "G", jornada: "FECHA 2", local: "belgica", visitante: "iran" },
  { fecha: "21/06/2026 - 19:00", grupo: "H", jornada: "FECHA 2", local: "uruguay", visitante: "caboVerde" },
  { fecha: "21/06/2026 - 22:00", grupo: "G", jornada: "FECHA 2", local: "nuevaZelanda", visitante: "egipto" },

  // 22/06/2026
  { fecha: "22/06/2026 - 14:00", grupo: "J", jornada: "FECHA 2", local: "argentina", visitante: "austria" },
  { fecha: "22/06/2026 - 18:00", grupo: "I", jornada: "FECHA 2", local: "francia", visitante: "iraq" },
  { fecha: "22/06/2026 - 21:00", grupo: "I", jornada: "FECHA 2", local: "noruega", visitante: "senegal" },

  // 23/06/2026
  { fecha: "23/06/2026 - 00:00", grupo: "J", jornada: "FECHA 2", local: "jordania", visitante: "argelia" },
  { fecha: "23/06/2026 - 14:00", grupo: "K", jornada: "FECHA 2", local: "portugal", visitante: "uzbekistan" },
  { fecha: "23/06/2026 - 17:00", grupo: "L", jornada: "FECHA 2", local: "inglaterra", visitante: "ghana" },
  { fecha: "23/06/2026 - 20:00", grupo: "L", jornada: "FECHA 2", local: "panama", visitante: "croacia" },
  { fecha: "23/06/2026 - 23:00", grupo: "K", jornada: "FECHA 2", local: "colombia", visitante: "congo" },

  // 24/06/2026
  { fecha: "24/06/2026 - 16:00", grupo: "B", jornada: "FECHA 3", local: "suiza", visitante: "canada" },
  { fecha: "24/06/2026 - 16:00", grupo: "B", jornada: "FECHA 3", local: "bosnia", visitante: "qatar" },
  { fecha: "24/06/2026 - 19:00", grupo: "C", jornada: "FECHA 3", local: "marruecos", visitante: "haiti" },
  { fecha: "24/06/2026 - 19:00", grupo: "C", jornada: "FECHA 3", local: "escocia", visitante: "brasil" },
  { fecha: "24/06/2026 - 22:00", grupo: "A", jornada: "FECHA 3", local: "sudafrica", visitante: "corea" },
  { fecha: "24/06/2026 - 22:00", grupo: "A", jornada: "FECHA 3", local: "chequia", visitante: "mexico" },

  // 25/06/2026
  { fecha: "25/06/2026 - 17:00", grupo: "E", jornada: "FECHA 3", local: "curacao", visitante: "costaMarfil" },
  { fecha: "25/06/2026 - 17:00", grupo: "E", jornada: "FECHA 3", local: "ecuador", visitante: "alemania" },
  { fecha: "25/06/2026 - 20:00", grupo: "F", jornada: "FECHA 3", local: "tunez", visitante: "paisesBajos" },
  { fecha: "25/06/2026 - 20:00", grupo: "F", jornada: "FECHA 3", local: "japon", visitante: "suecia" },
  { fecha: "25/06/2026 - 23:00", grupo: "D", jornada: "FECHA 3", local: "turquia", visitante: "usa" },
  { fecha: "25/06/2026 - 23:00", grupo: "D", jornada: "FECHA 3", local: "paraguay", visitante: "australia" },

  // 26/06/2026
  { fecha: "26/06/2026 - 16:00", grupo: "I", jornada: "FECHA 3", local: "noruega", visitante: "francia" },
  { fecha: "26/06/2026 - 16:00", grupo: "I", jornada: "FECHA 3", local: "senegal", visitante: "iraq" },
  { fecha: "26/06/2026 - 21:00", grupo: "H", jornada: "FECHA 3", local: "caboVerde", visitante: "arabia" },
  { fecha: "26/06/2026 - 21:00", grupo: "H", jornada: "FECHA 3", local: "uruguay", visitante: "espana" },

  // 27/06/2026
  { fecha: "27/06/2026 - 00:00", grupo: "G", jornada: "FECHA 3", local: "nuevaZelanda", visitante: "belgica" },
  { fecha: "27/06/2026 - 00:00", grupo: "G", jornada: "FECHA 3", local: "egipto", visitante: "iran" },
  { fecha: "27/06/2026 - 18:00", grupo: "L", jornada: "FECHA 3", local: "panama", visitante: "inglaterra" },
  { fecha: "27/06/2026 - 18:00", grupo: "L", jornada: "FECHA 3", local: "croacia", visitante: "ghana" },
  { fecha: "27/06/2026 - 20:30", grupo: "K", jornada: "FECHA 3", local: "colombia", visitante: "portugal" },
  { fecha: "27/06/2026 - 20:30", grupo: "K", jornada: "FECHA 3", local: "congo", visitante: "uzbekistan" },
  { fecha: "27/06/2026 - 23:00", grupo: "J", jornada: "FECHA 3", local: "argelia", visitante: "austria" },
  { fecha: "27/06/2026 - 23:00", grupo: "J", jornada: "FECHA 3", local: "jordania", visitante: "argentina" }
];

function crearPartidos() {
  return fixtureBase.map((partido, index) => {
    const equipoLocal = equipos[partido.local];
    const equipoVisitante = equipos[partido.visitante];

    return {
      id: index + 1,
      fecha: partido.fecha,
      grupo: `GRUPO ${partido.grupo} - ${partido.jornada}`,
      local: equipoLocal.nombre,
      visitante: equipoVisitante.nombre,
      banderaLocal: equipoLocal.bandera,
      banderaVisitante: equipoVisitante.bandera,
      resultadoReal: null
    };
  });
}

const banderaPlaceholder =
  "https://placehold.co/80x50/e5e7eb/064e3b?text=TBD";

function equipoTemporal(nombre) {
  return {
    nombre,
    bandera: banderaPlaceholder
  };
}

const faseFinalBase = [
     // =========================
  // 16AVOS DE FINAL
  // =========================

  {
    id: 73,
    fecha: "28/06/2026 - 16:00",
    grupo: "16avos de final",
    local: equipos.sudafrica,
    visitante: equipos.canada
  },
  {
    id: 74,
    fecha: "29/06/2026 - 17:30",
    grupo: "16avos de final",
    local: equipos.alemania,
    visitante: equipos.paraguay
  },
  {
    id: 75,
    fecha: "29/06/2026 - 22:00",
    grupo: "16avos de final",
    local: equipos.paisesBajos,
    visitante: equipos.marruecos
  },
  {
    id: 76,
    fecha: "29/06/2026 - 14:00",
    grupo: "16avos de final",
    local: equipos.brasil,
    visitante: equipos.japon
  },
  {
    id: 77,
    fecha: "30/06/2026 - 18:00",
    grupo: "16avos de final",
    local: equipos.francia,
    visitante: equipos.suecia
  },
  {
    id: 78,
    fecha: "30/06/2026 - 14:00",
    grupo: "16avos de final",
    local: equipos.costaMarfil,
    visitante: equipos.noruega
  },
  {
    id: 79,
    fecha: "30/06/2026 - 22:00",
    grupo: "16avos de final",
    local: equipos.mexico,
    visitante: equipos.ecuador
  },
  {
    id: 80,
    fecha: "01/07/2026 - 13:00",
    grupo: "16avos de final",
    local: equipos.inglaterra,
    visitante: equipos.congo
  },
  {
    id: 81,
    fecha: "01/07/2026 - 21:00",
    grupo: "16avos de final",
    local: equipos.usa,
    visitante: equipos.bosnia
  },
  {
    id: 82,
    fecha: "01/07/2026 - 17:00",
    grupo: "16avos de final",
    local: equipos.belgica,
    visitante: equipos.senegal
  },
  {
    id: 83,
    fecha: "02/07/2026 - 20:00",
    grupo: "16avos de final",
    local: equipos.portugal,
    visitante: equipos.croacia
  },
  {
    id: 84,
    fecha: "02/07/2026 - 16:00",
    grupo: "16avos de final",
    local: equipos.espana,
    visitante: equipos.austria
  },
  {
    id: 85,
    fecha: "03/07/2026 - 00:00",
    grupo: "16avos de final",
    local: equipos.suiza,
    visitante: equipos.argelia
  },
  {
    id: 86,
    fecha: "03/07/2026 - 19:00",
    grupo: "16avos de final",
    local: equipos.argentina,
    visitante: equipos.caboVerde
  },
  {
    id: 87,
    fecha: "03/07/2026 - 22:30",
    grupo: "16avos de final",
    local: equipos.colombia,
    visitante: equipos.ghana
  },
  {
    id: 88,
    fecha: "03/07/2026 - 15:00",
    grupo: "16avos de final",
    local: equipos.australia,
    visitante: equipos.egipto
  },

    // =========================
  // OCTAVOS DE FINAL
  // =========================

  {
    id: 89,
    fecha: "04/07/2026 - 14:00",
    grupo: "Octavos de final",
    local: equipos.canada,
    visitante: equipos.marruecos
  },
  {
    id: 90,
    fecha: "04/07/2026 - 18:00",
    grupo: "Octavos de final",
    local: equipos.paraguay,
    visitante: equipos.francia
  },
  {
    id: 91,
    fecha: "05/07/2026 - 17:00",
    grupo: "Octavos de final",
    local: equipos.brasil,
    visitante: equipos.noruega
  },
  {
    id: 92,
    fecha: "05/07/2026 - 21:00",
    grupo: "Octavos de final",
    local: equipos.mexico,
    visitante: equipos.inglaterra
  },
  {
    id: 93,
    fecha: "06/07/2026 - 16:00",
    grupo: "Octavos de final",
    local: equipoTemporal("Ganador Portugal/Croacia"),
    visitante: equipos.espana
  },
  {
    id: 94,
    fecha: "06/07/2026 - 21:00",
    grupo: "Octavos de final",
    local: equipos.usa,
    visitante: equipos.belgica
  },
  {
    id: 95,
    fecha: "07/07/2026 - 13:00",
    grupo: "Octavos de final",
    local: equipoTemporal("Ganador Argentina/Cabo Verde"),
    visitante: equipoTemporal("Ganador Australia/Egipto")
  },
  {
    id: 96,
    fecha: "07/07/2026 - 17:00",
    grupo: "Octavos de final",
    local: equipoTemporal("Ganador Suiza/Argelia"),
    visitante: equipoTemporal("Ganador Colombia/Ghana")
  },

  // =========================
  // CUARTOS DE FINAL
  // =========================

  {
    id: 97,
    fecha: "09/07/2026 - 17:00",
    grupo: "Cuartos de final",
    local: equipoTemporal("Ganador P89"),
    visitante: equipoTemporal("Ganador P90")
  },
  {
    id: 98,
    fecha: "10/07/2026 - 16:00",
    grupo: "Cuartos de final",
    local: equipoTemporal("Ganador P93"),
    visitante: equipoTemporal("Ganador P94")
  },
  {
    id: 99,
    fecha: "11/07/2026 - 18:00",
    grupo: "Cuartos de final",
    local: equipoTemporal("Ganador P91"),
    visitante: equipoTemporal("Ganador P92")
  },
  {
    id: 100,
    fecha: "11/07/2026 - 22:00",
    grupo: "Cuartos de final",
    local: equipoTemporal("Ganador P95"),
    visitante: equipoTemporal("Ganador P96")
  },

  // =========================
  // SEMIFINALES
  // =========================

  {
    id: 101,
    fecha: "14/07/2026 - 16:00",
    grupo: "Semifinal",
    local: equipoTemporal("Ganador P97"),
    visitante: equipoTemporal("Ganador P98")
  },
  {
    id: 102,
    fecha: "15/07/2026 - 16:00",
    grupo: "Semifinal",
    local: equipoTemporal("Ganador P99"),
    visitante: equipoTemporal("Ganador P100")
  },

  // =========================
  // GRAN FINAL
  // =========================

  {
    id: 104,
    fecha: "19/07/2026 - 16:00",
    grupo: "Final",
    local: equipoTemporal("Ganador P101"),
    visitante: equipoTemporal("Ganador P102")
  }
];

function crearPartidosFaseFinal() {
  return faseFinalBase.map((partido) => {
    return {
      id: partido.id,
      fecha: partido.fecha,
      grupo: partido.grupo,
      local: partido.local.nombre,
      visitante: partido.visitante.nombre,
      banderaLocal: partido.local.bandera,
      banderaVisitante: partido.visitante.bandera,
      resultadoReal: null
    };
  });
}

export const partidos = [
  ...crearPartidos(),
  ...crearPartidosFaseFinal()
];