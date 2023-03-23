const jwt = require('jsonwebtoken')
const JWT_SECRET=process.env.JWT_SECRET||'passwordscret'; //TODO : 😎


const tokenSign = async (user) => { //TODO: Genera Token
    return jwt.sign(
        {
            _id: user.COD_USUARIO, //TODO: <---
            role: user.ROL
        }, //TODO: Payload ! Carga útil
        JWT_SECRET, //TODO ENV 
        {
            expiresIn: "2h", //TODO tiempo de vida
        }
        
    );
}


const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        return null
    }
}

const decodeSign = (token) => { //TODO: Verificar que el token sea valido y correcto
    return jwt.decode(token, null)
}



module.exports = { tokenSign, decodeSign, verifyToken }