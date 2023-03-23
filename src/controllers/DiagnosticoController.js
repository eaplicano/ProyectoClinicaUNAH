const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index(req, res) {

    //req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_DIAGNOSTICO', (err, tasks) => {
          if(err) {
            res.json(err);
          }
        //console.log(tasks);
        res.render('diagnostico/diagnostico_index', { tasks });
        });
     // });
}


function create(req, res) {

    res.render('diagnostico/diagnostico_create');
    
}


async function store(req, res) {
    const data = req.body;

   // req.getConnection((err, conn) => {
    const { COD_DIAGNOSTICO,TIP_DIAGNOSTICO,DES_DIAGNOSTICO} = req.body;
    const P_INS_DIAGNOSTICO = `call P_INS_DIAGNOSTICO(${COD_DIAGNOSTICO},'${TIP_DIAGNOSTICO}','${DES_DIAGNOSTICO}',CURDATE(), CURDATE(), 001,001)`;

      await pool.query(P_INS_DIAGNOSTICO, (err, rows) => {
      if(err) {
        res.json(err);
      }
      res.redirect('/diagnostico');
      console.log(req.body);
      console.log(rows);
      console.log(data);
    });
    //  }); 
}


async function destroy(req, res) {
    const id = req.body.id;
    const data = req.body;
  
    //req.getConnection((err, conn) => {
      const P_DLT_DIAGNOSTICO = `call P_DLT_DIAGNOSTICO(${id})`;

      await pool.query(P_DLT_DIAGNOSTICO, [data, id],(err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/diagnostico');
        console.log(req.body);
        console.log(rows);
        console.log(data);
      });
    //})
  }

  async function edit(req, res) {
    const id = req.params.id;

    //req.getConnection((err, conn) => {
        //const id = req.params.id;
        //console.log(id);
        await pool.query('SELECT * FROM GP_DIAGNOSTICO WHERE COD_DIAGNOSTICO = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
       res.render('diagnostico/diagnostico_edit', { tasks });
      });
   // });
  }

  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    //req.getConnection((err, conn) => {
      const {COD_DIAGNOSTICO,TIP_DIAGNOSTICO,DES_DIAGNOSTICO} = req.body;
      const P_UPD_DIAGNOSTICO = `call P_UPD_DIAGNOSTICO(${COD_DIAGNOSTICO},'${TIP_DIAGNOSTICO}','${DES_DIAGNOSTICO}',CURDATE(), 001)`;
   
      await pool.query(P_UPD_DIAGNOSTICO, [data, id],(err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/diagnostico');
        console.log(req.body);
        console.log(rows);
        console.log(data);
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
}