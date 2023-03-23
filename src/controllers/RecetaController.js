const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index(req, res) {

    //req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_RECETA', (err, tasks) => {
          if(err) {
            res.json(err);
          }
        //console.log(tasks);
        res.render('receta/receta_index', { tasks });
        });
     // });
}


function create(req, res) {

    res.render('receta/receta_create');
    
}


async function store(req, res) {
    const data = req.body;

  //  req.getConnection((err, conn) => {
    const { COD_RECETA,DET_RECETA} = req.body;
    const P_INS_RECETA = `call P_INS_RECETA(${COD_RECETA},'${DET_RECETA}',CURDATE(), CURDATE(), 001,001)`;
 
      await pool.query(P_INS_RECETA, (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/receta');
        console.log(req.body);
        console.log(rows);
        console.log(data);
      });
    //  }); 
}


async function destroy(req, res) {
    const id = req.body.id;
    const data = req.body;
  
   // req.getConnection((err, conn) => {
    const P_DLT_RECETA = `call P_DLT_RECETA(${id})`;

      await pool.query(P_DLT_RECETA, [data, id],(err, rows) => {
      if(err) {
        res.json(err);
      }
      res.redirect('/receta');
      console.log(req.body);
      console.log(rows);
      console.log(data);
    });
   // })
  }

  async function edit(req, res) {
    const id = req.params.id;

    //req.getConnection((err, conn) => {
        //const id = req.params.id;
        //console.log(id);
        await pool.query('SELECT * FROM GP_RECETA WHERE COD_RECETA = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
       res.render('receta/receta_edit', { tasks });
      });
   // });
  }

  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    //req.getConnection((err, conn) => {
      const { COD_RECETA,DET_RECETA} = req.body;
      const P_UPD_RECETA = `call P_UPD_RECETA(${COD_RECETA},'${DET_RECETA}',CURDATE(), 001)`;
   
      await pool.query(P_UPD_RECETA, [data, id],(err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/receta');
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