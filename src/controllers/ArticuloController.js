const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index (req, res) {
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_ARTICULO', (err, tasks) => {
        if(err) {
          res.json(err);
        }
        //console.log(tasks);
        res.render('Articulo/index', { tasks });
      });
    // });
  }
  
  function create(req, res) {
  
    res.render('Articulo/articulo_create');
  }
  
  async function store(req, res) {
    const data = req.body;
  
    // req.getConnection((err, conn) => {
    const { COD_ARTICULO, COD_TIP_ARTICULO,NOM_ARTICULO,MON_UNITARIO,DET_ARTICULO} = req.body;
    const INS_GP_ARTICULO = `call INS_GP_ARTICULO(${COD_ARTICULO},${COD_TIP_ARTICULO},'${NOM_ARTICULO}',
    ${MON_UNITARIO},'${DET_ARTICULO}',001,001)`;
   
    await pool.query(INS_GP_ARTICULO, (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Articulo');
      });
    // });
  }
  
  async function destroy(req, res) {
    const id = req.body.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('DELETE FROM GP_ARTICULO WHERE COD_ARTICULO = ?', [id], (err, rows) => {
        res.redirect('/Articulo');
      });
    // })
  }
  
  async function edit(req, res) {
    const id = req.params.id;
    const data = req.body;
    // req.getConnection((err, conn) => {
      await pool.query('UPDATE GP_ARTICULO SET ? WHERE COD_ARTICULO = ?', [data, id], (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.render('Articulo/articulo_edit', { tasks });
      });
    // });
  }
  
  async function update(req, res) {
    const id = req.params.id;
    const user = req.params.user;
    // const data = req.body;
    // const user = data.user_session;
    console.log(id);
    console.log(user);

    // const token = req.query.token;
    // console.log(token);
    // req.getConnection((err, conn) => {
      await pool.query('UPDATE GP_ARTICULO SET ? WHERE COD_ARTICULO = ?', [data, id], (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Articulo');
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
    // createSigVital: createSigVital,
  }