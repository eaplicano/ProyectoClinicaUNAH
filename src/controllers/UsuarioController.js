const express = require('express');
const { session } = require('passport');
const passport = require('passport');
const pool = require('../database');

async function index(req, res) {   
  // const consulta = `call CON_GP_USUARIO('NULL')`; 
  // await pool.query('consulta', (err, tasks) => {
  // console.log(id);
  // // console.log(p_sessionid);
  // // console.log(session.arguments)
  // // console.log(passport.use(Validarid));
  // await pool.query('SELECT COD_USUARIO FROM GP_USUARIO WHERE USUARIO = ?', [id], (err, users)=> {
  //   if(err) {
  //     res.json(err);
  //   }
  //   console.log(users);
  // });
  await pool.query('SELECT * FROM GP_USUARIO', (err, tasks) => {
    if(err) {
      res.json(err);
    }
    res.render('auth/index', { tasks });
  });
  // });
}

async function destroy(req, res) {
  const COD_USUARIO = req.body.COD_USUARIO;
  console.log(COD_USUARIO);
  const DEL_GP_USUARIO = `call DEL_GP_USUARIO(${COD_USUARIO})`; 
  await pool.query('DEL_GP_USUARIO', (err, tasks) => {
    // await pool.query('DELETE FROM GP_USUARIO WHERE COD_USUARIO = ?', [id], (err, rows) => {
    res.redirect('/auth');
  });
}

async function edit(req, res) {
  const id = req.params.id;
  const user = req.params.user;

  const token = req.query.token;
  console.log(token);

  console.log(user);
  await pool.query('SELECT COD_USUARIO FROM GP_USUARIO WHERE USUARIO = ?', [user], (err, users)=> {
    if(err) {
      res.json(err);
    }
    console.log(users);
  });
  // const COD_USUARIO = req.body.COD_USUARIO;
  // const DEL_GP_USUARIO = `call DEL_GP_USUARIO(${COD_USUARIO})`; 

  await pool.query('SELECT * FROM GP_USUARIO WHERE COD_USUARIO = ?', [id], (err, tasks) => {
    if(err) {
      res.json(err);
    }
    res.render('auth/signup_edit', { tasks });
  });
  // });
}

function update(req, res) {
  const id = req.params.id;
  const user_session = req.body.user_session;
  const data = req.body;
  console.log(user_session);

  req.getConnection((err, conn) => {
    conn.query('UPDATE GP_USUARIO SET ? WHERE COD_USUARIO = ?', [data, id], (err, rows) => {
      if(err) {
        res.json(err);
      }
      res.redirect('/auth');
    });
  });
}


module.exports = {
  index: index,
  // create: create,
  // store: store,
  destroy: destroy,
  edit: edit,
  update: update,
}