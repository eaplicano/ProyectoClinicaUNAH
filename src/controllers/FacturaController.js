const pool = require('../database');
async function index(req, res) {
  await pool.query('SELECT * FROM GP_FACTURA', (err, tasks) => {
        if(err) {
          res.json(err);
        }
        //console.log(tasks);
        res.render('Factura/factura_index', { tasks });
      });
  }
  
  function create(req, res) {
  
    res.render('Factura/factura_create');
  }
  
  async function store(req, res) {
    const data = req.body;
  
    const { COD_FACTURA, FEC_FACTURACION,COD_PACIENTE,MON_ISV} = req.body;
      const INS_GP_FACTURA = `call INS_GP_FACTURA(${COD_FACTURA},${FEC_FACTURACION},'${COD_PACIENTE}',
      ${MON_ISV},001,001,001,001)`;//Falta modificar para agregar el procedimiento almacenado de consulta de factura
   
      await pool.query(INS_GP_Factura, (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/factura_index');
      });
  }
  
  async function destroy(req, res) {
    const id = req.body.id;
  
    await pool.query('DELETE FROM GP_FACTURA WHERE COD_FACTURA = ?', [id], (err, rows) => {
        res.redirect('/factura_index');
      });
  }
  
  async function edit(req, res) {
    const id = req.params.id;
  
    await pool.query('SELECT * FROM GP_FACTURA WHERE COD_FACTURA = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
        res.render('Factura/factura_edit', { tasks });
      });
  }
  
 async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    await pool.query('UPDATE GP_FACTURA SET ? WHERE COD_FACTURA = ?', [data, id], (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/factura_index');
      });
  }
  
  
  module.exports = {
    index: index,
    create: create,
    store: store,
    destroy: destroy,
    edit: edit,
    update: update,
  }