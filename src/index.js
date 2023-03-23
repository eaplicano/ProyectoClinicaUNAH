const express = require("express");
const morgan = require("morgan");
const path = require("path");
const exphbs = require("express-handlebars");
const session = require("express-session");
const validator = require("express-validator");
const passport = require("passport");
const flash = require("connect-flash");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const { config } = require("dotenv").config();

const { database } = require("./keys");

// Intializations
const app = express();
require("./lib/passport");

// Settings
app.set("port", process.env.PORT || 3005);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars"),
  })
);
app.set("view engine", ".hbs");

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "mysqlnodemysql",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash("message");
  app.locals.success = req.flash("success");
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require("./routes/index"));
app.use(require("./routes/authentication"));

// app.use('/links', require('./routes/links'));

app.use("/", require("./routes/Pacientes.routes"));

app.use("/", require("./routes/Usuarios.routes"));
app.use("/", require("./routes/Rol.routes"));

app.use("/", require("./routes/Inventario.routes"));
app.use("/", require("./routes/Articulo.routes"));

app.use("/", require("./routes/Consulta.routes"));
app.use("/", require("./routes/Antecedentes.routes"));
app.use("/", require("./routes/Diagnostico.routes"));
app.use("/", require("./routes/Receta.routes"));

app.use("/", require("./routes/Expediente.routes"));
app.use("/", require("./routes/Factura.routes"));

app.use("/", require("./routes/Clinica.routes"));
app.use("/", require("./routes/Tipo_consulta.routes"));
app.use("/", require("./routes/TipServicio.routes"));
app.use("/", require("./routes/TipArt.routes"));
app.use("/", require("./routes/Servicio.routes"));

// Public
app.use(express.static(path.join(__dirname, "public")));

// Starting
app.listen(app.get("port"), () => {
  console.log("Server is in port", app.get("port"));
});
