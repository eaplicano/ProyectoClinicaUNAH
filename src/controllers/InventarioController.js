const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index (req, res) {
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_INVENTARIO', (err, tasks) => {
        if(err) {
          res.json(err);
        }
        //console.log(tasks);
        res.render('Inventario/index', { tasks });
      });
    // });
  }
  
  function create(req, res) {
  
    res.render('Inventario/inventario_create');
  }
  
  async function store(req, res) {
    const data = req.body;
  
    // req.getConnection((err, conn) => {
      // const P_ins_sig_vitales = `call P_ins_sig_vitales(${COD_SIG_VITALES},'${TIP_SIGNO_VITAL}','${DES_SIGNO_VITAL}',CURDATE(), CURDATE(), 001,001)`;
      await pool.query('INSERT INTO GP_INVENTARIO SET ?', [data], (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.render('Inventario/index', { tasks });

      });
    // });
  }
  
  async function destroy(req, res) {
    const id = req.body.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('DELETE FROM GP_INVENTARIO WHERE COD_INVENTARIO = ?', [id], (err, rows) => {
        res.redirect('/Invetario');
      });
    // })
  }
  
  async function edit(req, res) {
    const id = req.params.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_INVENTARIO WHERE COD_INVENTARIO = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
        res.render('Inventario/inventario_edit', { tasks });
      });
    // });
  }
  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    // req.getConnection((err, conn) => {
      await pool.query('UPDATE GP_INVENTARIO SET ? WHERE COD_INVENTARIO = ?', [data, id], (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Inventario');
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