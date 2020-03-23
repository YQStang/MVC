const fs = require("fs")

const {
  asyncReadFile,
  asyncWriteFile
} = require('./readwrite')

exports.getTodo = async (req, res) => {
  const id = parseInt(req.params.id) 
  const file = await asyncReadFile(req.app.locals.dataFilePath)
  const todo_list = JSON.parse(file).filter(v => v.id === id)
  todo_list.length == 0 ? res.status(404).send() : res.send(todo_list[0])
}

exports.getAllTodo = (req, res) => fs.readFile(req.app.locals.dataFilePath, "utf-8", (err, data) => {
  if (err) {
    return res.status(500).send()
  }
  res.send(JSON.parse(data))
})

exports.createTodo = async (req, res) => {
  const newTodo = req.body
  const file = await asyncReadFile(req.app.locals.dataFilePath)
  const todo_list = JSON.parse(file)
  if (todo_list.filter(v => v.id === newTodo.id).length != 0) {
    res.status(400).send()
  } else {
    todo_list.push(newTodo)
    await asyncWriteFile(JSON.stringify(todo_list), req.app.locals.dataFilePath)
    res.status(201).send(todo_list)
  }
}

exports.deleteTodo = async (req, res) => {
  const id = parseInt(req.params.id)
  const file = await asyncReadFile(req.app.locals.dataFilePath)
  const todo_list = JSON.parse(file)
  const newTodo = todo_list.filter(v => v.id !== id)
  if (newTodo.length === todo_list.length) {
    res.status(404).send()
  } else {
    await asyncWriteFile(JSON.stringify(newTodo), req.app.locals.dataFilePath)
    res.send(newTodo)
  }
}
