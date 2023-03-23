const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index (req, res) {
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_TIP_ARTICULO', (err, tasks) => {
        if(err) {
          res.json(err);
        }
        //console.log(tasks);
        res.render('Tipo_Articulo/index', { tasks });
      });
    // });
  }
  
  function create(req, res) {
  
    res.render('Tipo_Articulo/TipArt_create');
  }
  
  async function store(req, res) {
    const data = req.body;
  
    // req.getConnection((err, conn) => {
    const { COD_TIP_ARTICULO, NOM_TIP_ARTICULO} = req.body;
    const INS_GP_TIP_ARTICULO = `call INS_GP_TIP_ARTICULO(${COD_TIP_ARTICULO},'${NOM_TIP_ARTICULO}')`;
   
    await pool.query(INS_GP_TIP_ARTICULO, (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Tipo_Articulo');
        console.log(req.body);
        console.log(rows);
        console.log(data);
      });
    // });
  }
  
  async function destroy(req, res) {
    const id = req.body.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('DELETE FROM GP_TIP_ARTICULO WHERE COD_TIP_ARTICULO = ?', [id], (err, rows) => {
        res.redirect('/Tipó_Articulo');
      });
    // })
  }
  
  async function edit(req, res) {
    const id = req.params.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_TIP_ARTICULO WHERE COD_TIP_ARTICULO = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
        res.render('Tipo_Articulo/TipArt_edit', { tasks });
      });
    // });
  }
  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    // req.getConnection((err, conn) => {
      await pool.query('UPDATE GP_TIP_ARTICULO SET ? WHERE COD_TIP_ARTICULO = ?', [data, id], (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Tipo_Articulo');
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