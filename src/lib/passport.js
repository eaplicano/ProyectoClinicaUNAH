const { validationResult } = require('express-validator/check');
const { deserializeUser } = require('passport');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { tokenSign } = require('../helpers/generateToken');

const pool = require('../database');
const helpers = require('./helpers');


// login
passport.use('local.signin', new LocalStrategy({
  usernameField: 'USUARIO',
  passwordField: 'CONTRASEÑA',
  passReqToCallback: true
}, async (req, USUARIO, CONTRASEÑA, res) => {
  const rows = await pool.query('select COD_USUARIO,USUARIO,CONTRASEÑA,ROL from GP_USUARIO INNER JOIN GP_ROLES ON GP_USUARIO.COD_ROL = GP_ROLES.COD_ROL WHERE USUARIO = ?', [USUARIO]);
  
  if (rows.length > 0) {
    const user = rows[0];
    // console.log(user.USUARIO, user.CONTRASEÑA);
    const validPassword = await helpers.matchPassword(CONTRASEÑA, user.CONTRASEÑA)
    // console.log(validPassword);
    
    const tokenSession = await tokenSign(user)
    

    // const data={
    //   token:await tokenSign(user),
    //   user:user
    // }
    
    console.log(req.headers.authorization);

   

    if (validPassword) {
      // console.log('exitoso');
      res(null,user, tokenSession);

      
    } else {
      // console.log('incorrecto');
      res(null, false, req.flash('message', 'Incorrect Password'));
    }
  } else {
    // console.log('no existe');
    return res(null, false, req.flash('message', 'The Username does not exists.'));
  }
}));


// NUEVO USUARIO
passport.use('local.signup', new LocalStrategy({
  usernameField: 'USUARIO',
  passwordField: 'CONTRASEÑA',
  passReqToCallback: true
}, async (req, USUARIO, CONTRASEÑA, done) => {

  const {
    NOM_USUARIO,
    EST_USUARIO,
    DIR_CORREO_ELECTRONICO,
    FEC_ULT_CONEXION,
    PRIMER_INGRESO,
    FEC_CREACION,
    FEC_MODIFICACION,
    CREADO_POR,
    MODIFICADO_POR,
    COD_ROL } = req.body;
  // const {CREADO_POR}='001';
  // const {MODIFICADO_POR}='001';

  let newUser = {
    USUARIO,
    NOM_USUARIO,
    CONTRASEÑA,
    EST_USUARIO,
    DIR_CORREO_ELECTRONICO,
    FEC_ULT_CONEXION,
    PRIMER_INGRESO,
    FEC_CREACION,
    FEC_MODIFICACION,
    CREADO_POR,
    MODIFICADO_POR,
    COD_ROL };
  

  newUser.CONTRASEÑA = await helpers.encryptPassword(CONTRASEÑA);

  // const { USUARIO,
  // NOM_USUARIO,
  // CONTRASEÑA,
  // EST_USUARIO,
  // DIR_CORREO_ELECTRONICO,
  // FEC_ULT_CONEXION,
  // PRIMER_INGRESO,
  // COD_ROL} = req.body;

  // CONTRASEÑA= await helpers.encryptPassword(password);
  
  // const INS_GP_USUARIO = `call INS_GP_USUARIO('
  // ${newUser.USUARIO}',
  // '${newUser.NOM_USUARIO}',
  // '${newUser.CONTRASEÑA}',
  // '${newUser.EST_USUARIO}',
  // '${newUser.DIR_CORREO_ELECTRONICO}',
  // '${newUser.FEC_ULT_CONEXION}',
  // ${newUser.PRIMER_INGRESO}, 
  // 001,
  // 001,
  // ${newUser.COD_ROL})`;
  // // Saving in the Database
  // const result = await pool.query(INS_GP_USUARIO);
  const result = await pool.query('INSERT INTO GP_USUARIO SET ? ', newUser);
  
  newUser.id = result.insertId;
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  // console.log(user.COD_USUARIO);
  done(null, user.COD_USUARIO);
});

// const activo=validacioncodigo();

passport.deserializeUser(async (id, done) => {
  // console.log(id);
  const rows = await pool.query('SELECT COD_USUARIO,USUARIO,CONTRASEÑA FROM GP_USUARIO WHERE COD_USUARIO = ?', [id]);
  done(null, rows[0]);
});



// module.exports={
//   "validacion":validacioncodigo
// }
// module.exports = function(){
//     if(user!=""){
//       return user.COD_USUARIO;
//     }
//     else{
//       return 0;
//     }
    
//   }
// function Validarid(){
//   console.log("entro");
//   return user;
// }


// module.exports = {
//     Validarid: Validarid
//   }