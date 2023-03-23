const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index(req, res) {

   // req.getConnection((err, conn) => {
    await pool.query('SELECT * FROM GP_CLINICA', (err, tasks) => {
          if(err) {
            res.json(err);
          }
        //console.log(tasks);
        res.render('clinica/clinica_index', { tasks });
        });
  //    });
}


function create(req, res) {

    res.render('clinica/clinica_create');
    
}


async function store(req, res) {
    const data = req.body;

  //  req.getConnection((err, conn) => {
    const {COD_CLINICA,NOM_CLINICA,DIR_CLINICA,NUM_TELEFONO,DIR_CORREO_ELECTR} = req.body;
    const INS_CLINICA = `call INS_CLINICA(${COD_CLINICA},'${NOM_CLINICA}','${DIR_CLINICA}',${NUM_TELEFONO},'${DIR_CORREO_ELECTR}',CURDATE(), CURDATE(), 001,001)`;
    
    await pool.query(INS_CLINICA, (err, rows) => {
      if(err) {
        res.json(err);
      }
      res.redirect('/clinica');
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
      const DLT_CLINICA = `call DLT_CLINICA(${id})`;
      await pool.query(DLT_CLINICA, [data, id],(err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/clinica');
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
        await pool.query('SELECT * FROM GP_CLINICA WHERE COD_CLINICA = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
       res.render('clinica/clinica_edit', { tasks });
      });
   // });
  }
  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
   // req.getConnection((err, conn) => {
    const {COD_CLINICA,NOM_CLINICA,DIR_CLINICA,NUM_TELEFONO,DIR_CORREO_ELECTR} = req.body;
    const UPD_CLINICA = `call UPD_CLINICA(${COD_CLINICA},'${NOM_CLINICA}','${DIR_CLINICA}',${NUM_TELEFONO},'${DIR_CORREO_ELECTR}',CURDATE(), 001)`;
      await pool.query(UPD_CLINICA, [data, id],(err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/clinica');
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