var express = require('express');
var router = express.Router();
var db = require('../db');


router.use((req, res, next) => {
  req.db = db;
  next();
});


router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/todos', async (req, res) => {
  try {
    const [todos] = await req.db.query('SELECT id, title, content FROM todos');
    res.json({ error: false, todos });
  } catch (e) {
    res.json({ error: true, message: e.message });
  }
});

router.get('/api/todos/:id', async (req, res) => {
  try {
    const [todos] = await req.db.query('SELECT id, title, content FROM todos WHERE id = ?', [req.params.id]);
    if (todos.length === 0) {
      return res.json({ error: true, message: "Todo not found" });
    }
    res.json({ error: false, todo: todos[0] });
  } catch (e) {
    res.json({ error: true, message: e.message });
  }
});

module.exports = router;
