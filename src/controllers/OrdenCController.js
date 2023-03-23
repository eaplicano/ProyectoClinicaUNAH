const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index (req, res) {
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_ORDEN_COMPRA', (err, tasks) => {
        if(err) {
          res.json(err);
        }
        //console.log(tasks);
        res.render('Orden_Compra/index', { tasks });
      });
    // });
  }
  
  function create(req, res) {
  
    res.render('Orden_Compra/ordenC_create');
  }
  
  async function store(req, res) {
    const data = req.body;
  
    // req.getConnection((err, conn) => {
    const { COD_ORDEN_COMPRA, FEC_INGRESO, COD_PROVEEDOR, COD_CLINICA, DOC_OPERACION} = req.body;
    const INS_GP_ORDEN_COMPRA = `call INS_GP_ORDEN_COMPRA(${COD_ORDEN_COMPRA},${FEC_INGRESO}, '${COD_PROVEEDOR}' 
    ${COD_CLINICA}, '${DOC_OPERACION}')`;
   
    await pool.query(INS_GP_ORDEN_COMPRA, (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Orden_Compra');
        console.log(req.body);
        console.log(rows);
        console.log(data);
      });
    // });
  }
  
  async function destroy(req, res) {
    const id = req.body.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('DELETE FROM GP_ORDEN_COMPRA WHERE COD_ORDEN_COMPRA = ?', [id], (err, rows) => {
        res.redirect('/Orden_Compra');
      });
    // })
  }
  
  async function edit(req, res) {
    const id = req.params.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_ORDEN_COMPRA WHERE COD_ORDEN_COMPRA = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
        res.render('Orden_Compra/ordenC_edit', { tasks });
      });
    // });
  }
  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    // req.getConnection((err, conn) => {
      await pool.query('UPDATE GP_ORDEN_COMPRA SET ? WHERE COD_ORDEN_COMPRA = ?', [data, id], (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Orden_Compra');
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