const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index(req, res) {

   // req.getConnection((err, conn) => {
    await pool.query('SELECT * FROM GP_CONTACTO_EMER', (err, tasks) => {
          if(err) {
            res.json(err);
          }
        //console.log(tasks);
        res.render('contacto_emerg/contacto_emerg_index', { tasks });
        });
  //    });
}


function create(req, res) {

    res.render('contacto_emerg/contacto_emerg_create');
    
}


async function store(req, res) {
    const data = req.body;

  //  req.getConnection((err, conn) => {
    const { COD_CONTACTO,COD_PACIENTE,NOM_COMPLETO,DIR_DOMICILIO,NUM_TELEFONO} = req.body;
    const INS_CONTACTO_EMER = `call INS_CONTACTO_EMER(${COD_CONTACTO},${COD_PACIENTE},'${NOM_COMPLETO}','${DIR_DOMICILIO}','${NUM_TELEFONO}',CURDATE(), CURDATE(), 001,001)`;
    
    await pool.query(INS_CONTACTO_EMER, (err, rows) => {
      if(err) {
        res.json(err);
      }
      res.redirect('/contacto_emerg');
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
      const DEL_CONTACTO_EMER = `call DEL_CONTACTO_EMER(${id})`;
      await pool.query(DEL_CONTACTO_EMER, [data, id],(err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/contacto_emerg');
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
        await pool.query('SELECT * FROM GP_CONTACTO_EMER WHERE COD_CONTACTO = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
       res.render('contacto_emerg/contacto_emerg_edit', { tasks });
      });
   // });
  }
  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
   // req.getConnection((err, conn) => {
    const {COD_CONTACTO,NOM_COMPLETO,DIR_DOMICILIO,NUM_TELEFONO} = req.body;
    const ACT_CONTACTO_EMER = `call ACT_CONTACTO_EMER(${COD_CONTACTO},'${NOM_COMPLETO}','${DIR_DOMICILIO}','${NUM_TELEFONO}',CURDATE(),001)`;
      await pool.query(ACT_CONTACTO_EMER, [data, id],(err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/contacto_emerg');
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