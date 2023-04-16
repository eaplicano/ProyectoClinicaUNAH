const express = require("express");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

const pool = require("../database");
async function index(req, res) {
  await pool.query(
    `select GP_EXPEDIENTE.COD_EXPEDIENTE,upper(GP_PACIENTE.NOM_PACIENTE)NOM_PACIENTE, DATE_FORMAT(GP_PACIENTE.FEC_NACIMIENTO, "%d/%m/%Y") FEC_NACIMIENTO from GP_EXPEDIENTE INNER JOIN GP_PACIENTE ON GP_EXPEDIENTE.COD_PACIENTE = GP_PACIENTE.COD_PACIENTE`,
    (err, tasks) => {
      if (err) {
        res.json(err);
      }
      // console.log(tasks);
      res.render("expediente/expediente_index", { tasks });
    }
  );
}

async function exportpdf(req, res) {
  const source = `<!DOCTYPE html>
<html>
  <head>
    <title>Reporte de Expedientes</title>
  </head>
  <body>
    <h1>Reporte de Expedientes</h1>
    <table style="border: 1px solid black;">
      <thead>
        <tr>
          <th style="border: 1px solid black;">Codigo de Expediente</th>
          <th style="border: 1px solid black;">Codigo de Pacientes</th>
          <th style="border: 1px solid black;">Nombre</th>
          <th style="border: 1px solid black;">Apellido</th>
          <th style="border: 1px solid black;">Fecha de Nacimiento</th>
        </tr>
      </thead>
      <tbody>
        {{#each tasks}}
        <tr>
          <td style="border: 1px solid black;">{{COD_EXPEDIENTE}}</td>
          <td style="border: 1px solid black;">{{COD_PACIENTE}}</td>
          <td style="border: 1px solid black;">{{NOM_PACIENTE}}</td>
          <td style="border: 1px solid black;">{{APE_PACIENTE}}</td>
          <td style="border: 1px solid black;">{{FEC_NACIMIENTO}}</td>
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
        `select 		a.COD_EXPEDIENTE
                  ,a.COD_PACIENTE
                  ,upper(b.NOM_PACIENTE)NOM_PACIENTE
                        , upper(b.ape_paciente)APE_PACIENTE
                        ,b.FEC_NACIMIENTO 
            from 		GP_EXPEDIENTE a
            INNER JOIN 	GP_PACIENTE b
            ON 			a.COD_PACIENTE = b.COD_PACIENTE`,
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

function create(req, res) {
  res.render("expediente/expediente_create");
}

async function store(req, res) {
  const data = req.body;

  const { COD_EXPEDIENTE, COD_PACIENTE, COD_ANTECEDENTE } = req.body;
  const INS_GP_EXPEDIENTE = `call INS_GP_EXPEDIENTE(${COD_EXPEDIENTE},${COD_PACIENTE},'${COD_ANTECENTE}'},001,001,001,001)`; //falta modificar

  await pool.query(INS_GP_EXPEDIENTE, (err, rows) => {
    if (err) {
      res.json(err);
    }
    res.render("/antecedentes_create");
  });
}

async function edit(req, res) {
  const id = req.params.id;

  await pool.query(
    "SELECT * FROM GP_EXPEDIENTE WHERE COD_EXPEDIENTE = ?",
    [id],
    (err, tasks) => {
      if (err) {
        res.json(err);
      }
      res.render("Expediente/expediente_edit", { tasks });
    }
  );
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  await pool.query(
    "UPDATE GP_EXPEDIENTE SET ? WHERE COD_EXPEDIENTE = ?",
    [data, id],
    (err, rows) => {
      if (err) {
        res.json(err);
      }
      res.redirect("/expediente_index");
    }
  );
}

async function destroy(req, res) {
  const id = req.body.id;

  await pool.query(
    "DELETE FROM GP_EXPEDIENTE WHERE COD_EXPEDIENTE = ?",
    [id],
    (err, rows) => {
      res.redirect("/expediente");
    }
  );
}

async function indexConfirmar(req, res) {
  const id = req.params.id;
  // console.log(id);
  await pool.query(
    "SELECT * FROM GP_PACIENTE WHERE COD_PACIENTE = ?",
    [id],
    (err, tasks) => {
      if (err) {
        res.json(err);
      }
      res.render("expediente/expediente_confirmar", { tasks });
    }
  );
}

async function indexVisualizar(req, res) {
  const id = req.params.id;
  // console.log(id);
  await pool.query(
    "SELECT * FROM GP_PACIENTE WHERE COD_PACIENTE = ?",
    [id],
    (err, tasks) => {
      if (err) {
        res.json(err);
      }
      res.render("expediente/expediente_visualizar", { tasks });
    }
  );
}

async function indexConsulta(req, res) {
  const id = req.params.id;
  console.log(id);
  await pool.query(
    "SELECT * FROM GP_EXPEDIENTE WHERE COD_EXPEDIENTE = ?",
    [id],
    (err, tasks) => {
      if (err) {
        res.json(err);
      }
      //console.log(tasks);
      res.render("expediente/expediente_consulta", { tasks });
    }
  );
}

async function indexPaciente(req, res) {
  // req.getConnection((err, conn) => {
  await pool.query(
    'SELECT COD_PACIENTE, UPPER(NOM_PACIENTE) NOM_PACIENTE, UPPER(APE_PACIENTE) APE_PACIENTE, DATE_FORMAT(FEC_NACIMIENTO, "%d/%m/%Y") as FEC_NACIMIENTO FROM GP_PACIENTE',
    (err, tasks) => {
      if (err) {
        res.json(err);
      }
      //console.log(tasks);
      res.render("expediente/expediente_paciente", { tasks });
    }
  );
  // });
}

async function indexSeleccion(req, res) {
  const id = req.params.id;
  // console.log(id);
  // console.log(req.params.id);
  // const INDEX_SELECCION = `call CON_INDEX_EXPEDIENTE_SELECCION(?)`;
  // // const INDEX_SELECCION = `call CON_INDEX_EXPEDIENTE_SELECCION($[id])`;
  await pool.query(
    "select * from (GP_EXPEDIENTE INNER JOIN GP_PACIENTE ON GP_EXPEDIENTE.COD_PACIENTE = GP_PACIENTE.COD_PACIENTE) WHERE COD_EXPEDIENTE = ? GROUP BY COD_EXPEDIENTE",
    [id],
    (err, select) => {
      // await pool.query(INDEX_SELECCION, (err, select) => {
      if (err) {
        res.json(err);
      }
      // console.log(select);
      // console.log({ select });
      res.render("expediente/expediente_seleccion", { select });
    }
  );
  // });
}
// async function postSeleccion(req, res) {
//   const pac = req.params.pac;
//   const expe = req.params.expe;
//     res.render('/consulta/:paciente/:expediente', {select});
// }

async function saveConfirmar(req, res) {
  const { COD_PACIENTE } = req.body;
  // console.log(COD_PACIENTE);
  const INS_EXPEDIENTE = `call INS_GP_EXPEDIENTE(${COD_PACIENTE},001,001)`;

  await pool.query(INS_EXPEDIENTE, (err, rows) => {
    if (err) {
      res.json(err);
    }
    res.redirect("/expediente");
  });
}

async function saveConsulta(req, res) {
  const { COD_EXPEDIENTE, TIP_CONSULTA, COD_CLINICA } = req.body;
  // console.log(COD_PACIENTE);
  const INS_CONSULTA = `call INS_GP_CONSULTA(${COD_EXPEDIENTE},${TIP_CONSULTA},${COD_CLINICA},001,001)`;

  console.log(INS_CONSULTA);
  await pool.query(INS_CONSULTA, (err, insert) => {
    if (err) {
      res.json(err);
    }
    console.log(COD_EXPEDIENTE);
    // pool.query('SELECT * FROM GP_CONSULTA WHERE COD_EXPEDIENTE = ?) ',[COD_EXPEDIENTE], (err, rows) => {
    //   if(err) {
    //     res.json(err);
    //   }
    //   console.log(rows);
    // res.render('expediente/expediente_consulta_resume', { rows });
    res.redirect("/consulta");
  });
  // });
}

async function indexallConsulta(req, res) {
  const id = req.params.id;
  console.log(id);
  await pool.query("SELECT * FROM GP_CONSULTA", (err, rows) => {
    if (err) {
      res.json(err);
    }
    console.log(rows);
    res.render("expediente/expediente_consulta", { rows });
  });
}

// Antecedentes
async function indexAntecedente(req, res) {
  const COD_EXPEDIENTE = req.params.id;
  console.log(COD_EXPEDIENTE);
  // req.getConnection((err, conn) => {
  await pool.query(
    "SELECT * FROM GP_ANTECEDENTE",
    [COD_EXPEDIENTE],
    (err, tasks) => {
      if (err) {
        res.json(err);
      }
      //console.log(tasks);
      res.render("expediente/antecedentes_index", { tasks, COD_EXPEDIENTE });
    }
  );
  // });
}

async function createAntecedente(req, res) {
  const id = req.params.id;
  console.log(id);
  await pool.query(
    "SELECT * FROM GP_EXPEDIENTE WHERE COD_EXPEDIENTE = ?",
    [id],
    (err, tasks) => {
      if (err) {
        res.json(err);
      }
      // console.log(tasks);
      res.render("expediente/expediente_antecedentes", { tasks });
    }
  );
}

async function storeAntecedente(req, res) {
  const data = req.body;

  // req.getConnection((err, conn) => {
  const {
    COD_EXPEDIENTE,
    APP,
    APNoP,
    PATOLOGICO,
    A,
    HV,
    PLAN_FAM,
    AHTQx,
    G,
    C,
    Ob,
    HM,
  } = req.body;
  const INS_GP_ANTECEDENTE = `call INS_GP_ANTECEDENTE(${COD_EXPEDIENTE},'${APP}','${APNoP}','${PATOLOGICO}','${A}','${HV}','${PLAN_FAM}','${AHTQx}','${G}','${C}','${Ob}','${HM}')`;
  console.log(INS_GP_ANTECEDENTE);
  await pool.query(INS_GP_ANTECEDENTE, (err, rows) => {
    if (err) {
      res.json(err);
    }
    console.log(INS_GP_ANTECEDENTE);
    // pool.query('SELECT * FROM GP_CONSULTA WHERE COD_CONSULTA = ?', [id], (err, rows) => {
    //   if(err) {
    //     res.json(err);
    //   }
    res.redirect("/expediente");
    // });
  });
  // });
}

// Expediente Pacientes
// async function busquedaExp(req, res) {
//   const id = req.params.id;
//   console.log('Busqueda', id);

// await pool.query('SELECT * FROM GP_EXPEDIENTE WHERE COD_PACIENTE = ?', [id], (err, tasks) => {
//     if(err) {
//       res.json(err);
//     }
//     if(tasks!=null){
//       alert("El paciente ya tiene un Expediente Creado"+tasks.COD_EXPEDIENTE);

//       pool.query('SELECT * FROM GP_PACIENTE', (err, paciente) => {
//         if(err) {
//           res.json(err);
//         }
//         //console.log(tasks);
//         res.render('expediente/expediente_paciente', { paciente });
//       });
//     }
//     else{
//       const { COD_EXPEDIENTE, COD_PACIENTE,COD_ANTECEDENTE} = req.body;
//       const INS_GP_EXPEDIENTE = `call INS_GP_EXPEDIENTE(${COD_EXPEDIENTE},${COD_PACIENTE},'0'},001,001,001,001)`;//falta modificar

//       pool.query(INS_GP_EXPEDIENTE, (err, rows) => {
//         if(err) {
//           res.json(err);
//         }
//         res.render('/antecedentes_create');
//       });
//     }

//   });
// }

module.exports = {
  index: index,
  indexConfirmar: indexConfirmar,
  create: create,
  store: store,
  destroy: destroy,
  edit: edit,
  update: update,
  indexPaciente: indexPaciente,
  indexSeleccion: indexSeleccion,
  saveConfirmar: saveConfirmar,
  indexConsulta: indexConsulta,
  saveConsulta: saveConsulta,
  // indexSigVital: indexSigVital,
  indexallConsulta: indexallConsulta,
  createAntecedente: createAntecedente,
  storeAntecedente: storeAntecedente,
  indexAntecedente: indexAntecedente,
  // busquedaExp: busquedaExp,
  // postSeleccion: postSeleccion,
  indexVisualizar: indexVisualizar,
  exportpdf: exportpdf,
};
