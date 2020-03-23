const express = require('express')
const {
  getTodo,
  getAllTodo,
  createTodo,
  deleteTodo
} = require('./controller')

const app = express()
app.locals.dataFilePath = "./data.json"

const port = 3000

app.use(express.json())
app.get('/', (req, res) => res.send('<h1>Hi！This is Stang！</h1>'))

app.get("/todo/:id", getTodo)
app.get("/todo", getAllTodo)

app.post("/todo", createTodo)

app.delete("/todo/:id", deleteTodo)

app.listen(port, () => console.log(`Restful API app listening on port ${port}!`))

exports.app = app
