const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index (req, res) {
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_DETALLE_ORDEN', (err, tasks) => {
        if(err) {
          res.json(err);
        }
        //console.log(tasks);
        res.render('Detalle_Orden/index', { tasks });
      });
    // });
  }
  
  function create(req, res) {
  
    res.render('Detalle_Orden/DetOrden_create');
  }
  
  async function store(req, res) {
    const data = req.body;
  
    // req.getConnection((err, conn) => {
    const { COD_DETALLE_ORDEN, COD_ORDEN_COMPRA, COD_ARTICULO, CAN_ARTICULO, MON_ARTICULO, FEC_VENCIMIENTO} = req.body;
    const INS_GP_DETALLE_ORDEN = `call INS_GP_DETALLE_ORDEN(${COD_DETALLE_ORDEN},'${COD_ORDEN_COMPRA}', ${COD_ARTICULO} 
    '${CAN_ARTICULO}',${MON_ARTICULO}, ${FEC_VENCIMIENTO} )`;
   
    await pool.query(INS_GP_PROVEEDOR, (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Detalle_Orden');
        console.log(req.body);
        console.log(rows);
        console.log(data);
      });
    // });
  }
  
  async function destroy(req, res) {
    const id = req.body.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('DELETE FROM GP_DETALLE_ORDEN WHERE COD_DETALLE_ORDEN = ?', [id], (err, rows) => {
        res.redirect('/Detalle_Orden');
      });
    // })
  }
  
  async function edit(req, res) {
    const id = req.params.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_DETALLE_ORDEN WHERE COD_DETALLE_ORDEN = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
        res.render('Detalle_Orden/DetOrden_edit', { tasks });
      });
    // });
  }
  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    // req.getConnection((err, conn) => {
      await pool.query('UPDATE GP_DETALLE_ORDEN SET ? WHERE COD_DETALLE_ORDEN = ?', [data, id], (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Detalle_orden');
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