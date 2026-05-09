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
        resultadoReal: null
      });
    });
  });

  return partidosGenerados;
}

export const partidos = crearPartidos();