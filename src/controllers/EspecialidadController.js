const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index(req, res) {

   // req.getConnection((err, conn) => {
    await pool.query('SELECT * FROM GP_ESPECIALIDAD', (err, tasks) => {
          if(err) {
            res.json(err);
          }
        //console.log(tasks);
        res.render('especialidad/especialidad_index', { tasks });
        });
  //    });
}


function create(req, res) {

    res.render('especialidad/especialidad_create');
    
}


async function store(req, res) {
    const data = req.body;

  //  req.getConnection((err, conn) => {
    const {COD_ESPECIALIDAD,COD_PERSONAL,NOM_ESPECIALIDAD,MON_ESPECIALIDAD} = req.body;
    const P_ins_especialidad = `call P_ins_especialidad(${COD_ESPECIALIDAD},${COD_PERSONAL},'${NOM_ESPECIALIDAD}',${MON_ESPECIALIDAD},CURDATE(), CURDATE(),001,001)`;
  
    await pool.query(P_ins_especialidad, (err, rows) => {
      if(err) {
        res.json(err);
      }
      res.redirect('/especialidad');
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
      const P_elim_especialidad = `call P_elim_especialidad(${id})`;
      await pool.query(P_elim_especialidad, [data, id],(err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/especialidad');
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
        await pool.query('SELECT * FROM GP_ESPECIALIDAD WHERE COD_ESPECIALIDAD = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
       res.render('especialidad/especialidad_edit', { tasks });
      });
   // });
  }
  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
   // req.getConnection((err, conn) => {
    const { COD_ESPECIALIDAD,COD_PERSONAL,NOM_ESPECIALIDAD,MON_ESPECIALIDAD} = req.body;
    const P_updt_especialidad = `call P_updt_especialidad(${COD_ESPECIALIDAD},${COD_PERSONAL},'${NOM_ESPECIALIDAD}',${MON_ESPECIALIDAD},CURDATE(), 001)`;
 
    await pool.query(P_updt_especialidad, [data, id],(err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/especialidad');
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