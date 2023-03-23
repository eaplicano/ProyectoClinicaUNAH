const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index (req, res) {
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_PROVEEDOR', (err, tasks) => {
        if(err) {
          res.json(err);
        }
        //console.log(tasks);
        res.render('Proveedor/index', { tasks });
      });
    // });
  }
  
  function create(req, res) {
  
    res.render('Proveedor/proveedor_create');
  }
  
  async function store(req, res) {
    const data = req.body;
  
    // req.getConnection((err, conn) => {
    const { COD_PROVEEDOR, NOM_PROVEEDOR, NUM_RTN, DIR_ESTABLECIMIENTO, NUM_TELEFONO, DIR_CORREO_ELECTR} = req.body;
    const INS_GP_PROVEEDOR = `call INS_GP_PROVEEDOR(${COD_PROVEEDOR},'${NOM_PROVEEDOR}', ${NUM_RTN} 
    '${DIR_ESTABLECIMIENTO}',${NUM_TELEFONO}, '${DIR_CORREO_ELECTR}' )`;
   
    await pool.query(INS_GP_PROVEEDOR, (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Proveedor');
        console.log(req.body);
        console.log(rows);
        console.log(data);
      });
    // });
  }
  
  async function destroy(req, res) {
    const id = req.body.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('DELETE FROM GP_PROVEEDOR WHERE COD_PROVEEDOR = ?', [id], (err, rows) => {
        res.redirect('/Proveedor');
      });
    // })
  }
  
  async function edit(req, res) {
    const id = req.params.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM PROVEEDOR WHERE COD_PROVEEDOR = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
        res.render('Proveedor/proveedor_edit', { tasks });
      });
    // });
  }
  
  async function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    // req.getConnection((err, conn) => {
      await pool.query('UPDATE GP_PROVEEDOR SET ? WHERE COD_PROVEEDOR = ?', [data, id], (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Proveedor');
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