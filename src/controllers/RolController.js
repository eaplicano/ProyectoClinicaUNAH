const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

async function index (req, res) {
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_ROLES', (err, tasks) => {
        if(err) {
          res.json(err);
        }
        //console.log(tasks);
        res.render('Rol/Rol_Resumen', { tasks });
      });
    // });
  }
  
  function create(req, res) {
  
    res.render('Rol/Rol');
  }
  
  async function store(req, res) {
    const data = req.body;
  
    // req.getConnection((err, conn) => {
    const { ROL, DES_ROL} = req.body;
    const INS_GP_ROLES = `call INS_GP_ROLES('${ROL}','${DES_ROL}',001,001)`;
   
    await pool.query(INS_GP_ROLES, (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Rol/Rol_Resumen');
      });
    // });
  }
  
  async function destroy(req, res) {
    const id = req.body.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('DELETE FROM GP_ROLES WHERE COD_ROL = ?', [id], (err, rows) => {
        res.redirect('/Rol/Rol_Resumen');
      });
    // })
  }
  
  async function edit(req, res) {
    const id = req.params.id;
  
    // req.getConnection((err, conn) => {
      await pool.query('SELECT * FROM GP_ROLES WHERE COD_ROL = ?', [id], (err, tasks) => {
        if(err) {
          res.json(err);
        }
        res.render('Rol/Rol_edit', { tasks });
      });
    // });
  }
  
  async function update(req, res) {
    const id = req.params.id;
    const user = req.params.user;
    const data = req.body;
    // const user = data.user_session;
    console.log(id);
    console.log(user);

    // const token = req.query.token;
    // console.log(token);

    // await pool.query('SELECT COD_USUARIO FROM GP_ROLES WHERE USUARIO = ?', [user], (err, users)=> {
    //   if(err) {
    //     res.json(err);
    //   }
    //   console.log(users);
    // });
    // req.getConnection((err, conn) => {
      await pool.query('UPDATE GP_ROLES SET ? WHERE COD_ROL = ?', [data, id], (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Rol/Rol_Resumen');
      });
    // });
  }
  
  async function indexpermiso (req, res) {
    // req.getConnection((err, conn) => {
      const id = req.params.id;
      console.log(id);  
      await pool.query('SELECT * FROM GP_OBJETO', (err, tasks) => {
        if(err) {
          res.json(err);
        }
        //console.log(tasks);
        res.render('Rol/Permiso_create', { tasks });
      });
    // });
  }

  async function storepermiso(req, res) {
    const data = req.body;
  
    // req.getConnection((err, conn) => {
    const { COD_ROL, COD_OBJETO,PERMISO_INSERCION,PERMISO_ELIMINACION,PERMISO_ACTUALIZACION,PERMISO_CONSULTAR} = req.body;
    const INS_GP_ROL_OBJETO = `call INS_GP_ROL_OBJETO(${COD_ROL},${COD_OBJETO},'${PERMISO_INSERCION}','${PERMISO_ELIMINACION}','${PERMISO_ACTUALIZACION}','${PERMISO_CONSULTAR}',001,001)`;
   
    await pool.query(INS_GP_ROL_OBJETO, (err, rows) => {
        if(err) {
          res.json(err);
        }
        res.redirect('/Rol/Rol_Resumen');
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
    indexpermiso:indexpermiso,
    storepermiso: storepermiso,
  }