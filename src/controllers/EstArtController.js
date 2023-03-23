const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index (req, res) {
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_EST_ARTICULO', (err, tasks) => {
        if(err) {
          res.json(err);
        }
        //console.log(tasks);
        res.render('Estado_Articulo/index', { tasks });
      });
    // });
  }
  
  function create(req, res) {
  
    res.render('Estado_Articulo/EstArt_create');
  }
  
  async function store(req, res) {
    const data = req.body;
  
    // req.getConnection((err, conn) => {
    const { COD_EST_ARTICULO, NOM_EST_ARTICULO} = req.body;
    const INS_GP_EST_ARTICULO = `call INS_GP_EST_ARTICULO(${COD_EST_ARTICULO},'${NOM_EST_ARTICULO}')`;
   
    await pool.query(INS_GP_EST_ARTICULO, (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Estado_Articulo');
        console.log(req.body);
        console.log(rows);
        console.log(data);
      });
    // });
  }
  
  async function destroy(req, res) {
    const id = req.body.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('DELETE FROM GP_EST_ARTICULO WHERE COD_EST_ARTICULO = ?', [id], (err, rows) => {
        res.redirect('/Estado_Articulo');
      });
    // })
  }
  
  async function edit(req, res) {
    const id = req.params.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_EST_ARTICULO WHERE COD_EST_ARTICULO = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
        res.render('Estado_Articulo/EstArt_edit', { tasks });
      });
    // });
  }
  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    // req.getConnection((err, conn) => {
      await pool.query('UPDATE GP_EST_ARTICULO SET ? WHERE COD_EST_ARTICULO = ?', [data, id], (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Estado_Articulo');
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