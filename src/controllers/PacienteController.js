const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index(req, res) {
  // req.getConnection((err, conn) => {
    await pool.query('SELECT * FROM GP_PACIENTE', (err, tasks) => {
      if(err) {
        res.json(err);
      }
      //console.log(tasks);
      res.render('Pacientes/index', { tasks });
    });
  // });
}

// async function indexPaciente(req, res) {
//   // req.getConnection((err, conn) => {
//     await pool.query('SELECT * FROM GP_PACIENTE', (err, tasks) => {
//       if(err) {
//         res.json(err);
//       }
//       //console.log(tasks);
//       res.render('expediente/expediente_paciente', { tasks });
//     });
//   // });
// }

function create(req, res) {

  res.render('Pacientes/pacientes_create');
}

async function store(req, res) {
  const data = req.body;

  const {NUM_IDENTIDAD,NOM_PACIENTE,APE_PACIENTE,FEC_NACIMIENTO,DIR_DOMICILIO,DIR_CORREO_ELECTRONICO,NUM_TELEFONO,GENERO,OCUPACION} = req.body;
  const GP_INS_PACIENTE = `call INS_GP_PACIENTE('${NUM_IDENTIDAD}', '${NOM_PACIENTE}', '${APE_PACIENTE}', '${FEC_NACIMIENTO}', '${DIR_DOMICILIO}', '${DIR_CORREO_ELECTRONICO}', '${NUM_TELEFONO}', '${GENERO}', '${OCUPACION}', 001, 001)`;

  // `call GP_INS_PACIENTE(${NUM_IDENTIDAD},'${NOM_PACIENTE}','${APE_PACIENTE}',${FEC_NACIMIENTO},'${DIR_DOMICILIO}','${DIR_CORREO_ELECTRONICO}',${NUM_TELEFONO},'${GENERO}','${OCUPACION}',001,001)`;
  
  console.log(GP_INS_PACIENTE);
  await pool.query(GP_INS_PACIENTE, (err, rows) => {
    if(err) {
      res.json(err);
    }
    res.redirect('/expediente_paciente');
  });
}

async function destroy(req, res) {
  const id = req.body.id;
  console.log(req.body);
  // req.getConnection((err, conn) => {
    await pool.query('DELETE FROM GP_PACIENTE WHERE COD_PACIENTE = ?', [id], (err, rows) => {
      res.redirect('/Pacientes');
    });
  // })
}

async function edit(req, res) {
  const id = req.params.id;

  // req.getConnection((err, conn) => {
    await pool.query('SELECT * FROM GP_PACIENTE WHERE COD_PACIENTE = ?', [id], (err, tasks) => {
      if(err) {
        res.json(err);
      }
      res.render('Pacientes/pacientes_edit', { tasks });
    });
  // });
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  // req.getConnection((err, conn) => {
    await pool.query('UPDATE GP_PACIENTE SET ? WHERE COD_PACIENTE = ?', [data, id], (err, rows) => {
      if(err) {
        res.json(err);
      }
      res.redirect('/Pacientes');
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
  // indexPaciente: indexPaciente,
}