const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index(req, res) {

   // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_ANTECEDENTE', (err, tasks) => {
          if(err) {
            res.json(err);
          }
        //console.log(tasks);
        res.render('antecedentes/antecedentes_index', { tasks });
        });
     // });
}


function create(req, res) {

    res.render('antecedentes/antecedentes_create');
    
}


async function store(req, res) {
    const data = req.body;

   // req.getConnection((err, conn) => {
    const { COD_ANTECEDENTE,TIP_ANTECEDENTE,DES_ANTECEDENTE} = req.body;
    const P_INS_ANTECEDENTE = `call P_INS_ANTECEDENTE(${COD_ANTECEDENTE},'${TIP_ANTECEDENTE}','${DES_ANTECEDENTE}',CURDATE(), CURDATE(), 001,001)`;
 
      await pool.query(P_INS_ANTECEDENTE, (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/antecedentes');
        console.log(req.body);
        console.log(rows);
        console.log(data);
      });
      //}); 
}


async function destroy(req, res) {
    const id = req.body.id;
    const data = req.body;
  
   // req.getConnection((err, conn) => {
    const P_DEL_ANTECEDENTE = `call P_DEL_ANTECEDENTE(${id})`;

      await pool.query(P_DEL_ANTECEDENTE, [data, id],(err, rows) => {
      if(err) {
        res.json(err);
      }
      res.redirect('/antecedentes');
      console.log(req.body);
      console.log(rows);
      console.log(data);
    });
   // })
  }

  async function edit(req, res) {
    const id = req.params.id;

   // req.getConnection((err, conn) => {
        //const id = req.params.id;
        //console.log(id);
        await pool.query('SELECT * FROM GP_ANTECEDENTE WHERE COD_ANTECEDENTE = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
       res.render('antecedentes/antecedentes_edit', { tasks });
      });
   // });
  }

  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
   // req.getConnection((err, conn) => {
    const { COD_ANTECEDENTE,TIP_ANTECEDENTE,DES_ANTECEDENTE} = req.body;
      const P_ACT_ANTECEDENTE = `call P_ACT_ANTECEDENTE(${COD_ANTECEDENTE},'${TIP_ANTECEDENTE}','${DES_ANTECEDENTE}',CURDATE(), 001)`;
   

      await pool.query(P_ACT_ANTECEDENTE, [data, id],(err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/antecedentes');
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