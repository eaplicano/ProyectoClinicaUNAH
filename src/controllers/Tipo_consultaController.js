const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index(req, res) {

   // req.getConnection((err, conn) => {
    await pool.query('SELECT * FROM gp_tip_consulta', (err, tasks) => {
          if(err) {
            res.json(err);
          }
        //console.log(tasks);
        res.render('tipo_consulta/tipo_consulta_index', { tasks });
        });
  //    });
}


function create(req, res) {

    res.render('tipo_consulta/tipo_consulta_create');
    
}


async function store(req, res) {
    const data = req.body;

  //  req.getConnection((err, conn) => {
    const {COD_TIP_CONSULTA,NOM_TIP_CONSULTAL} = req.body;
    const P_INS_TIP_CONSULTA = `call P_INS_TIP_CONSULTA(${COD_TIP_CONSULTA},'${NOM_TIP_CONSULTAL}',CURDATE(), CURDATE(), 001,001)`;
 
    await pool.query(P_INS_TIP_CONSULTA, (err, rows) => {
      if(err) {
        res.json(err);
      }
      res.redirect('/tipo_consulta');
      console.log(req.body);
      console.log(rows);
      console.log(data);
      }); 
   // });
}

async function destroy(req, res) {
    const id = req.body.id;
    const data = req.body;
  
    //req.getConnection((err, conn) => {
      const P_DLT_TIP_CONSULTA = `call P_DLT_TIP_CONSULTA(${id})`;
      await pool.query(P_DLT_TIP_CONSULTA, [data, id],(err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/tipo_consulta');
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
        await pool.query('SELECT * FROM GP_TIP_CONSULTA WHERE COD_TIP_CONSULTA = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
       res.render('tipo_consulta/tipo_consulta_edit', { tasks });
      });
   // });
  }
  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
   // req.getConnection((err, conn) => {
    const { COD_TIP_CONSULTA,NOM_TIP_CONSULTA} = req.body;
    const P_UPD_TIP_CONSULTA = `call P_UPD_TIP_CONSULTA(${COD_TIP_CONSULTA},'${NOM_TIP_CONSULTA}',CURDATE(), 001)`;
   
    await pool.query(P_UPD_TIP_CONSULTA, [data, id],(err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/tipo_consulta');
        console.log(req.body);
        console.log(rows);
        console.log(data);
      });
    //});
  }

 

module.exports = {
    index: index,
    create: create,
    store: store,
    destroy: destroy,
    edit: edit,
    update: update,
}