function index(req, res) {
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM GP_ARTICULO', (err, tasks) => {
      if(err) {
        res.json(err);
      }
      //console.log(tasks);
      res.render('tasks/index', { tasks });
    });
  });
}

function create(req, res) {

  res.render('tasks/create');
}

function store(req, res) {
  const data = req.body;

  req.getConnection((err, conn) => {
    conn.query('INSERT INTO GP_ARTICULO SET ?', [data], (err, rows) => {
      if(err) {
        res.json(err);
      }
      res.redirect('/tasks');
      console.log(req.body);
      console.log(rows);
      console.log(data);
    });
  });
}

function destroy(req, res) {
  const id = req.body.id;

  req.getConnection((err, conn) => {
    conn.query('DELETE FROM GP_ARTICULO WHERE COD_ARTICULO = ?', [id], (err, rows) => {
      res.redirect('/tasks');
    });
  })
}

function edit(req, res) {
  const id = req.params.id;

  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM GP_ARTICULO WHERE COD_ARTICULO = ?', [id], (err, tasks) => {
      if(err) {
        res.json(err);
      }
      res.render('tasks/edit', { tasks });
    });
  });
}

function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  req.getConnection((err, conn) => {
    conn.query('UPDATE GP_ARTICULO SET ? WHERE COD_ARTICULO = ?', [data, id], (err, rows) => {
      if(err) {
        res.json(err);
      }
      res.redirect('/tasks');
    });
  });
}


module.exports = {
  index: index,
  create: create,
  store: store,
  destroy: destroy,
  edit: edit,
  update: update,
}