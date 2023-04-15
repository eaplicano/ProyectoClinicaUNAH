const express = require("express");
const pool = require("../database");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

async function index(req, res) {
  await pool.query(
    'SELECT COD_CONSULTA, COD_EXPEDIENTE, DATE_FORMAT(FEC_CONSULTA, "%d/%m/%Y") as FEC_CONSULTA ,GP_CLINICA.NOM_CLINICA, GP_TIP_CONSULTA.NOM_TIP_CONSULTA  FROM GP_CONSULTA INNER JOIN GP_CLINICA ON GP_CONSULTA.COD_CLINICA = GP_CLINICA.COD_CLINICA INNER JOIN GP_TIP_CONSULTA ON GP_CONSULTA.COD_TIP_CONSULTA = GP_TIP_CONSULTA.COD_TIP_CONSULTA;',
    (err, rows) => {
      if (err) {
        res.json(err);
      }
      res.render("consulta/index", { rows });
    }
  );
}

async function exportpdf(req, res) {
  const source = `<!DOCTYPE html>
<html>
  <head>
    <title>Reporte de Consultas</title>
  </head>
  <body>
    <h1>Reporte de Consultas</h1>
    <table style="border: 1px solid black;">
      <thead>
        <tr>
          <th style="border: 1px solid black;">Codigo de Consulta</th>
          <th style="border: 1px solid black;">Codigo de Expediente</th>
          <th style="border: 1px solid black;">Codigo de Pacientes</th>
          <th style="border: 1px solid black;">Nombre</th>
          <th style="border: 1px solid black;">Apellido</th>
          <th style="border: 1px solid black;">Fecha de Consulta</th>
          <th style="border: 1px solid black;">Nombre de Clinica</th>
          <th style="border: 1px solid black;">Tipo de Consulta</th>
        </tr>
      </thead>
      <tbody>
        {{#each tasks}}
        <tr>
          <td style="border: 1px solid black;">{{COD_CONSULTA}}</td>
          <td style="border: 1px solid black;">{{COD_EXPEDIENTE}}</td>
          <td style="border: 1px solid black;">{{COD_PACIENTE}}</td>
          <td style="border: 1px solid black;">{{NOM_PACIENTE}}</td>
          <td style="border: 1px solid black;">{{APE_PACIENTE}}</td>
          <td style="border: 1px solid black;">{{FEC_CONSULTA}}</td>
          <td style="border: 1px solid black;">{{NOM_CLINICA}}</td>
          <td style="border: 1px solid black;">{{NOM_TIP_CONSULTA}}</td>
        </tr>
        {{/each}}
      </tbody>
    </table>
  </body>
</html>
  `;
  const template = handlebars.compile(source);

  const userTable = async () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT 		a.COD_CONSULTA
                  , a.COD_EXPEDIENTE
                    ,e.COD_PACIENTE
                    ,upper(e.NOM_PACIENTE)NOM_PACIENTE
                    , upper(e.ape_paciente)APE_PACIENTE
                    , DATE_FORMAT(FEC_CONSULTA, "%d/%m/%Y") as FEC_CONSULTA
                    , b.NOM_CLINICA
                    , c.NOM_TIP_CONSULTA  
        FROM GP_CONSULTA a
        INNER JOIN GP_CLINICA b
        ON a.COD_CLINICA = b.COD_CLINICA 
        INNER JOIN GP_TIP_CONSULTA c
        ON a.COD_TIP_CONSULTA = c.COD_TIP_CONSULTA
        inner join GP_EXPEDIENTE d
        ON 			a.COD_EXPEDIENTE = d.COD_EXPEDIENTE
        INNER JOIN 	GP_PACIENTE e
        ON 			d.COD_PACIENTE = e.COD_PACIENTE;`,
        (error, tasks) => {
          if (error) return reject(error); // <= si el proceso falla llamamos a reject y le pasamos el objeto error como argumento
          const data = tasks;
          return resolve(data); // <= si el proceso es exitoso llamamos a resolve y le pasamos el objeto data como argumento
        }
      );
    });
  };

  // Define the data to be used in the template
  const tasks = await userTable();
  //console.log(tasks);

  const html = template({ tasks });

  // Generate the PDF using Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: "A2" });
  await browser.close();

  // Send the PDF as a response
  res.set("Content-Type", "application/pdf");
  res.send(pdf);
}

async function indexConsulta(req, res) {
  const id = req.params.id;

  // req.getConnection((err, conn) => {
  //const id = req.params.id;
  console.log(id);
  await pool.query(
    "SELECT * FROM GP_CONSULTA WHERE COD_EXPEDIENTE = ?",
    [id],
    (err, rows) => {
      if (err) {
        res.json(err);
      }
      res.render("consulta/consulta_edit", { rows });
    }
  );
}

async function create(req, res) {
  const id = req.params.id;

  // req.getConnection((err, conn) => {
  //const id = req.params.id;
  console.log(id);
  await pool.query(
    "SELECT * FROM GP_EXPEDIENTE WHERE COD_EXPEDIENTE = ?",
    [id],
    (err, tasks) => {
      if (err) {
        res.json(err);
      }
    }
  );
  res.render("consulta/consulta_create");
}

async function store(req, res) {
  const data = req.body;

  //  req.getConnection((err, conn) => {
  const { COD_SIG_VITALES, TIP_SIGNO_VITAL, DES_SIGNO_VITAL } = req.body;
  const P_ins_sig_vitales = `call P_ins_sig_vitales(${COD_SIG_VITALES},'${TIP_SIGNO_VITAL}','${DES_SIGNO_VITAL}',CURDATE(), CURDATE(), 001,001)`;

  await pool.query(P_ins_sig_vitales, (err, rows) => {
    if (err) {
      res.json(err);
    }
    res.redirect("/consulta");
  });
  // });
}

async function destroy(req, res) {
  const id = req.body.id;
  const data = req.body;

  //req.getConnection((err, conn) => {
  const P_DLT_SIG_VITALES = `call P_DLT_SIG_VITALES(${id})`;
  await pool.query(P_DLT_SIG_VITALES, [data, id], (err, rows) => {
    if (err) {
      res.json(err);
    }
    res.redirect("/consulta");
    console.log(req.body);
    console.log(rows);
    console.log(data);
  });
  //})
}

async function edit(req, res) {
  const id = req.params.id;

  // req.getConnection((err, conn) => {
  //const id = req.params.id;
  //console.log(id);
  await pool.query(
    "SELECT * FROM GP_SIG_VITALES WHERE COD_SIG_VITALES = ?",
    [id],
    (err, tasks) => {
      if (err) {
        res.json(err);
      }
      res.render("consulta/consulta_edit", { tasks });
    }
  );
  // });
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  // req.getConnection((err, conn) => {
  const { COD_SIG_VITALES, TIP_SIGNO_VITAL, DES_SIGNO_VITAL } = req.body;
  const P_UPD_SIG_VITALES = `call P_UPD_SIG_VITALES(${COD_SIG_VITALES},'${TIP_SIGNO_VITAL}','${DES_SIGNO_VITAL}',CURDATE(), 001)`;
  await pool.query(P_UPD_SIG_VITALES, [data, id], (err, rows) => {
    if (err) {
      res.json(err);
    }
    res.redirect("/consulta");
  });
  //});
}
async function createSigVital(req, res) {
  const id = req.params.id;
  console.log(id);
  await pool.query(
    "SELECT * FROM GP_CONSULTA WHERE COD_CONSULTA = ?",
    [id],
    (err, tasks) => {
      if (err) {
        res.json(err);
      }
      // console.log(tasks);
      res.render("consulta/sig_vital_create", { tasks });
    }
  );
}

async function storeSigVital(req, res) {
  const data = req.body;

  // req.getConnection((err, conn) => {
  const {
    COD_CONSULTA,
    DES_PRE_ARTERIAL,
    DES_FRE_CARDIACA,
    DES_FRE_RESPIRATORIA,
    DES_PULSO,
    DES_TEMPERATURA,
    DES_SAT_OXIGENO,
    DES_TALLA,
    DES_PESO,
    DES_IND_CORPORAL,
    DES_CINTURA,
    DES_CADERA,
    DES_CINTURA_CADERA,
    DES_OJOS,
    DES_OIDOS,
    DES_NARIZ,
    DES_BOCA,
    DES_CUELLO,
    DES_TORAX,
    DES_CORAZON,
    DES_PULMONES,
    DES_ABDOMEN,
    DES_GENITO_URINARIO,
    DES_MIEMBROS,
    DES_PIEL_FANERAS,
    OBSERVACIONES,
  } = req.body;
  const INS_GP_PRECLINICA = `call INS_GP_PRECLINICA(${COD_CONSULTA},'${DES_PRE_ARTERIAL}','${DES_FRE_CARDIACA}', '${DES_FRE_RESPIRATORIA}','${DES_PULSO}','${DES_TEMPERATURA}','${DES_SAT_OXIGENO}','${DES_TALLA}','${DES_PESO}','${DES_IND_CORPORAL}','${DES_CINTURA}','${DES_CADERA}','${DES_CINTURA_CADERA}','${DES_OJOS}','${DES_OIDOS}','${DES_NARIZ}','${DES_BOCA}','${DES_CUELLO}','${DES_TORAX}','${DES_CORAZON}','${DES_PULMONES}','${DES_ABDOMEN}','${DES_GENITO_URINARIO}','${DES_MIEMBROS}','${DES_PIEL_FANERAS}','${OBSERVACIONES}',001,001)`;
  // console.log(INS_GP_PRECLINICA);
  await pool.query(INS_GP_PRECLINICA, (err, rows) => {
    if (err) {
      res.json(err);
    }
    // console.log(INS_GP_PRECLINICA);
    // pool.query('SELECT * FROM GP_CONSULTA WHERE COD_CONSULTA = ?', [id], (err, rows) => {
    //   if(err) {
    //     res.json(err);
    //   }
    res.redirect("/consulta");
    // });
  });
  // });
}

async function createDiagnostico(req, res) {
  const id = req.params.id;
  console.log(id);
  await pool.query(
    "SELECT * FROM GP_CONSULTA WHERE COD_CONSULTA = ?",
    [id],
    (err, tasks) => {
      if (err) {
        res.json(err);
      }
      // console.log(tasks);
      res.render("consulta/diagnostico_create", { tasks });
    }
  );
}

async function storeDiagnostico(req, res) {
  const data = req.body;

  // req.getConnection((err, conn) => {
  const {
    COD_CONSULTA,
    DES_DIAGNOSTICO_GEN,
    DES_ETARIO,
    DES_VACUNAL,
    DES_PATOLOGICO,
    DES_NUTRICIONAL,
    DES_DESARROLLO,
    DES_PLAN,
  } = req.body;
  const INS_GP_DIAGNOSTICO = `call INS_GP_DIAGNOSTICO(${COD_CONSULTA},'${DES_DIAGNOSTICO_GEN}','${DES_ETARIO}','${DES_VACUNAL}','${DES_PATOLOGICO}','${DES_NUTRICIONAL}','${DES_DESARROLLO}','${DES_PLAN}',001,001)`;
  // console.log(INS_GP_DIAGNOSTICO);
  await pool.query(INS_GP_DIAGNOSTICO, (err, rows) => {
    if (err) {
      res.json(err);
    }
    // console.log(INS_GP_DIAGNOSTICO);
    // pool.query('SELECT * FROM GP_CONSULTA WHERE COD_CONSULTA = ?', [id], (err, rows) => {
    //   if(err) {
    //     res.json(err);
    //   }
    res.redirect("/consulta");
    // });
  });
  // });
}

module.exports = {
  index: index,
  create: create,
  store: store,
  destroy: destroy,
  edit: edit,
  update: update,
  indexConsulta: indexConsulta,
  createSigVital: createSigVital,
  storeSigVital: storeSigVital,
  createDiagnostico: createDiagnostico,
  storeDiagnostico: storeDiagnostico,
  exportpdf: exportpdf,
};
