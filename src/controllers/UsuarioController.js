const express = require("express");
const { session } = require("passport");
const passport = require("passport");
const pool = require("../database");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

async function index(req, res) {
  // const consulta = `call CON_GP_USUARIO('NULL')`;
  // await pool.query('consulta', (err, tasks) => {
  // console.log(id);
  // // console.log(p_sessionid);
  // // console.log(session.arguments)
  // // console.log(passport.use(Validarid));
  // await pool.query('SELECT COD_USUARIO FROM GP_USUARIO WHERE USUARIO = ?', [id], (err, users)=> {
  //   if(err) {
  //     res.json(err);
  //   }
  //   console.log(users);
  // });
  await pool.query("SELECT * FROM GP_USUARIO", (err, tasks) => {
    if (err) {
      res.json(err);
    }
    res.render("auth/index", { tasks });
  });
  // });
}

async function exportpdf(req, res) {
  const source = `<!DOCTYPE html>
<html>
  <head>
    <title>Reporte de Usuarios</title>
  </head>
  <body>
    <h1>Reporte de Usuarios</h1>
    <table style="border: 1px solid black;">
      <thead>
        <tr>
          <th style="border: 1px solid black;">Codigo de Usuario</th>
          <th style="border: 1px solid black;">Usuario</th>
          <th style="border: 1px solid black;">Nombre de Usuario</th>
          <th style="border: 1px solid black;"Estado de Usuario</th>
          <th style="border: 1px solid black;">Correo Electronico</th>
          <th style="border: 1px solid black;">Fecha de Ultima Conexion</th>
          
          <th style="border: 1px solid black;">Descripcion del Rol</th>
        </tr>
      </thead>
      <tbody>
        {{#each tasks}}
        <tr>
          <td style="border: 1px solid black;">{{COD_USUARIO}}</td>
          <td style="border: 1px solid black;">{{USUARIO}}</td>
          <td style="border: 1px solid black;">{{NOM_USUARIO}}</td>
          <td style="border: 1px solid black;">{{EST_USUARIO}}</td>
          <td style="border: 1px solid black;">{{DIR_CORREO_ELECTRONICO}}</td>
          <td style="border: 1px solid black;">{{FEC_ULT_CONEXION}}</td>
          <td style="border: 1px solid black;">{{DES_ROL}}</td>
          
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
        `SELECT 		A.COD_USUARIO
                    ,UPPER(A.USUARIO) USUARIO
                    ,UPPER(A.NOM_USUARIO) NOM_USUARIO
                    ,UPPER(A.EST_USUARIO) EST_USUARIO
                    ,A.DIR_CORREO_ELECTRONICO
                    ,DATE_FORMAT(FEC_ULT_CONEXION, "%d/%m/%Y") FEC_ULT_CONEXION
                    
                    ,UPPER(B.DES_ROL) DES_ROL
        FROM 		GP_USUARIO A
        INNER JOIN	GP_ROLES B 
        ON 			A.COD_ROL=B.COD_ROL`,
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

async function destroy(req, res) {
  const COD_USUARIO = req.body.COD_USUARIO;
  console.log(COD_USUARIO);
  const DEL_GP_USUARIO = `call DEL_GP_USUARIO(${COD_USUARIO})`;
  await pool.query("DEL_GP_USUARIO", (err, tasks) => {
    // await pool.query('DELETE FROM GP_USUARIO WHERE COD_USUARIO = ?', [id], (err, rows) => {
    res.redirect("/auth");
  });
}

async function edit(req, res) {
  const id = req.params.id;
  const user = req.params.user;

  const token = req.query.token;
  console.log(token);

  console.log(user);
  await pool.query(
    "SELECT COD_USUARIO FROM GP_USUARIO WHERE USUARIO = ?",
    [user],
    (err, users) => {
      if (err) {
        res.json(err);
      }
      console.log(users);
    }
  );
  // const COD_USUARIO = req.body.COD_USUARIO;
  // const DEL_GP_USUARIO = `call DEL_GP_USUARIO(${COD_USUARIO})`;

  await pool.query(
    "SELECT * FROM GP_USUARIO WHERE COD_USUARIO = ?",
    [id],
    (err, tasks) => {
      if (err) {
        res.json(err);
      }
      res.render("auth/signup_edit", { tasks });
    }
  );
  // });
}

function update(req, res) {
  const id = req.params.id;
  const user_session = req.body.user_session;
  const data = req.body;
  console.log(user_session);

  req.getConnection((err, conn) => {
    conn.query(
      "UPDATE GP_USUARIO SET ? WHERE COD_USUARIO = ?",
      [data, id],
      (err, rows) => {
        if (err) {
          res.json(err);
        }
        res.redirect("/auth");
      }
    );
  });
}

module.exports = {
  index: index,
  // create: create,
  // store: store,
  destroy: destroy,
  edit: edit,
  update: update,
  exportpdf: exportpdf,
};
