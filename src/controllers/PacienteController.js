const pool = require("../database");
const ipp = require("ipp");
const getStream = require("get-stream");
const { isLoggedIn } = require("../lib/auth");

const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

async function index(req, res) {
  // req.getConnection((err, conn) => {
  await pool.query("SELECT * FROM GP_PACIENTE", (err, tasks) => {
    if (err) {
      res.json(err);
    }
    console.log(tasks);
    res.render("Pacientes/index", { tasks });
  });
  // });
}

async function exportpdf(req, res) {
  const source = `<!DOCTYPE html>
<html>
  <head>
    <title>Reporte de usuarios</title>
  </head>
  <body>
    <h1>Reporte de Pacientes</h1>
    <table style="border: 1px solid black;">
      <thead>
        <tr>
          <th style="border: 1px solid black;">Codigo de Paciente</th>
          <th style="border: 1px solid black;">Numero de Identidad</th>
          <th style="border: 1px solid black;">Nombre</th>
          <th style="border: 1px solid black;">Apellido</th>
          <th style="border: 1px solid black;">Fecha de Nacimiento</th>
          <th style="border: 1px solid black;">Direccion</th>
          <th style="border: 1px solid black;">Correo</th>
          <th style="border: 1px solid black;">Telefono</th>
          <th style="border: 1px solid black;">Genero</th>
          <th style="border: 1px solid black;">Ocupacion</th>
        </tr>
      </thead>
      <tbody>
        {{#each tasks}}
        <tr>
          <td style="border: 1px solid black;">{{COD_PACIENTE}}</td>
          <td style="border: 1px solid black;">{{NUM_IDENTIDAD}}</td>
          <td style="border: 1px solid black;">{{NOM_PACIENTE}}</td>
          <td style="border: 1px solid black;">{{APE_PACIENTE}}</td>
          <td style="border: 1px solid black;">{{FEC_NACIMIENTO}}</td>
          <td style="border: 1px solid black;">{{DIR_DOMICILIO}}</td>
          <td style="border: 1px solid black;">{{DIR_CORREO_ELECTRONICO}}</td>
          <td style="border: 1px solid black;">{{NUM_TELEFONO}}</td>
          <td style="border: 1px solid black;">{{GENERO}}</td>
          <td style="border: 1px solid black;">{{OCUPACION}}</td>
          
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
      pool.query("SELECT * FROM GP_PACIENTE", (error, tasks) => {
        if (error) return reject(error); // <= si el proceso falla llamamos a reject y le pasamos el objeto error como argumento
        const data = tasks;
        return resolve(data); // <= si el proceso es exitoso llamamos a resolve y le pasamos el objeto data como argumento
      });
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
  res.render("Pacientes/pacientes_create");
}

async function store(req, res) {
  const data = req.body;

  const {
    NUM_IDENTIDAD,
    NOM_PACIENTE,
    APE_PACIENTE,
    FEC_NACIMIENTO,
    DIR_DOMICILIO,
    DIR_CORREO_ELECTRONICO,
    NUM_TELEFONO,
    GENERO,
    OCUPACION,
  } = req.body;
  const GP_INS_PACIENTE = `call INS_GP_PACIENTE('${NUM_IDENTIDAD}', '${NOM_PACIENTE}', '${APE_PACIENTE}', '${FEC_NACIMIENTO}', '${DIR_DOMICILIO}', '${DIR_CORREO_ELECTRONICO}', '${NUM_TELEFONO}', '${GENERO}', '${OCUPACION}', 001, 001)`;

  // `call GP_INS_PACIENTE(${NUM_IDENTIDAD},'${NOM_PACIENTE}','${APE_PACIENTE}',${FEC_NACIMIENTO},'${DIR_DOMICILIO}','${DIR_CORREO_ELECTRONICO}',${NUM_TELEFONO},'${GENERO}','${OCUPACION}',001,001)`;

  console.log(GP_INS_PACIENTE);
  await pool.query(GP_INS_PACIENTE, (err, rows) => {
    if (err) {
      res.json(err);
    }
    res.redirect("/expediente_paciente");
  });
}

async function destroy(req, res) {
  const id = req.body.id;
  console.log(req.body);
  // req.getConnection((err, conn) => {
  await pool.query(
    "DELETE FROM GP_PACIENTE WHERE COD_PACIENTE = ?",
    [id],
    (err, rows) => {
      res.redirect("/Pacientes");
    }
  );
  // })
}

async function edit(req, res) {
  const id = req.params.id;

  // req.getConnection((err, conn) => {
  await pool.query(
    "SELECT * FROM GP_PACIENTE WHERE COD_PACIENTE = ?",
    [id],
    (err, tasks) => {
      if (err) {
        res.json(err);
      }
      res.render("Pacientes/pacientes_edit", { tasks });
    }
  );
  // });
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  // req.getConnection((err, conn) => {
  await pool.query(
    "UPDATE GP_PACIENTE SET ? WHERE COD_PACIENTE = ?",
    [data, id],
    (err, rows) => {
      if (err) {
        res.json(err);
      }
      res.redirect("/Pacientes");
    }
  );
  // });
}

module.exports = {
  index: index,
  create: create,
  store: store,
  destroy: destroy,
  edit: edit,
  update: update,
  exportpdf: exportpdf,
  // indexPaciente: indexPaciente,
};
