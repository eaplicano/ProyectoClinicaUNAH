const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index (req, res) {
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_OPERACION', (err, tasks) => {
        if(err) {
          res.json(err);
        }
        //console.log(tasks);
        res.render('Operacion/index', { tasks });
      });
    // });
  }
  
  function create(req, res) {
  
    res.render('Operacion/operacion_create');
  }
  
  async function store(req, res) {
    const data = req.body;
  
    // req.getConnection((err, conn) => {
    const { COD_OPERACION, DOC_OPERACION, TIP_OPERACION, CAN_OPERACION} = req.body;
    const INS_GP_OPERACION = `call INS_GP_OPERACION(${COD_OPERACION},'${DOC_OPERACION}', '${TIP_OPERACION}' 
    ${CAN_OPERACION})`;
   
    await pool.query(INS_GP_OPERACION, (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Operacion');
        console.log(req.body);
        console.log(rows);
        console.log(data);
      });
    // });
  }
  
  async function destroy(req, res) {
    const id = req.body.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('DELETE FROM GP_OPERACION WHERE COD_OPERACION = ?', [id], (err, rows) => {
        res.redirect('/Operacion');
      });
    // })
  }
  
  async function edit(req, res) {
    const id = req.params.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_OPERACION WHERE COD_OPERACION = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
        res.render('Operacion/operacion_edit', { tasks });
      });
    // });
  }
  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    // req.getConnection((err, conn) => {
      await pool.query('UPDATE GP_OPERACION SET ? WHERE COD_OPERACION = ?', [data, id], (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Operacion');
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