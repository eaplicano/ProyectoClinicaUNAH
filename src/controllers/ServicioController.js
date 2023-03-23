const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index (req, res) {
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_SERVICIO', (err, tasks) => {
        if(err) {
          res.json(err);
        }
        //console.log(tasks);
        res.render('Servicio/index', { tasks });
      });
    // });
  }
  
  function create(req, res) {
  
    res.render('Servicio/servicio_create');
  }
  
  async function store(req, res) {
    const data = req.body;
  
    // req.getConnection((err, conn) => {
    const { COD_SERVICIO, COD_TIP_SERVICIO, NOM_SERVICIO, MON_SERVICIO} = req.body;
    const INS_GP_SERVICIO = `call INS_GP_SERVICIO(${COD_SERVICIO}, ${COD_TIP_SERVICIO}, '${NOM_SERVICIO}' 
    ${MON_SERVICIO})`;
   
    await pool.query(INS_GP_SERVICIO, (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Servicio');
        console.log(req.body);
        console.log(rows);
        console.log(data);
      });
    // });
  }
  
  async function destroy(req, res) {
    const id = req.body.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('DELETE FROM GP_SERVICIO WHERE COD_SERVICIO = ?', [id], (err, rows) => {
        res.redirect('/Servicio');
      });
    // })
  }
  
  async function edit(req, res) {
    const id = req.params.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM SERVICIO WHERE COD_SERVICIO = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
        res.render('Servicio/servicio_edit', { tasks });
      });
    // });
  }
  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    // req.getConnection((err, conn) => {
      await pool.query('UPDATE GP_SERVICIO SET ? WHERE COD_SERVICIO = ?', [data, id], (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Servicio');
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