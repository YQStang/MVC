const {
    app
  } = require('../src/app');

const{
    asyncReadFile,
    asyncWriteFile
} = require('../src/readwrite')

const request = require('supertest');

describe("app", () => {
    describe("get request", () => {
      it("should get todo list when request url pattern is '/todo'", (done) => {
        app.locals.dataFilePath = "./test/testapp.json"
        request(app).get('/todo').expect(200).expect([{
            "id": 1,
            "content": "Restful API homework",
            "createdTime": "2020-03-20T00:00:00Z"     
        },
        {
            "id": 2,
            "content": "MVC homework",
            "createdTime": "2020-03-22T00:00:00Z"
        }
        ]).end((err, res) => {
          if (err) throw err;
          done()
        })
      })
  
      it("should get specific todo when request url patten is '/todo/:id'", (done) => {
        request(app).get('/todo/1').expect(200).expect({
            "id": 1,
            "content": "Restful API homework",
            "createdTime": "2020-03-20T00:00:00Z"
        }).end((err, res) => {
          if (err) throw err;
          done()
        })
      })
    })
  
    describe("post request", () => {
      afterEach(async function () {
        await asyncWriteFile(JSON.stringify([{
            "id": 1,
            "content": "Restful API homework",
            "createdTime": "2020-03-20T00:00:00Z"     
        },
        {
            "id": 2,
            "content": "MVC homework",
            "createdTime": "2020-03-22T00:00:00Z"
        }
        ]), "./test/testapp.json")
      })
      it("should create a todo when the id does not exist in the datasource", (done) => {
        request(app).post('/todo').send({
            "id": 3,
            "content": "Git homework",
            "createdTime": "2020-03-22T00:00:00Z"
        }).expect(201).expect([{
            "id": 1,
            "content": "Restful API homework",
            "createdTime": "2020-03-20T00:00:00Z"     
        },
        {
            "id": 2,
            "content": "MVC homework",
            "createdTime": "2020-03-22T00:00:00Z"
        },
          {
            "id": 3,
            "content": "Git homework",
            "createdTime": "2020-03-22T00:00:00Z"
          }
        ]).end((err, res) => {
          if (err) throw err;
          done()
        })
      })
  
      it("should not create the todo when its id has already existed in the datasource", (done) => {
        request(app).post('/todo').send({
            "id": 1,
            "content": "Homework",
            "createdTime": "2020-03-22T00:00:00Z"
        }).expect(400).end((err, res) => {
          if (err) throw err;
          done()
        })
      })
    })

    describe("delete request", () => {
        afterEach(async function () {
          await asyncWriteFile(JSON.stringify([{
              "id": 1,
              "content": "Restful API homework",
              "createdTime": "2020-03-20T00:00:00Z"     
          },
          {
              "id": 2,
              "content": "MVC homework",
              "createdTime": "2020-03-22T00:00:00Z"
          }
          ]), "./test/testapp.json")
        })
        it("should delete a todo when the id existed in the datasource", (done) => {
          request(app).delete('/todo/2').expect([{
            "id": 1,
            "content": "Restful API homework",
            "createdTime": "2020-03-20T00:00:00Z"     
        }]).end((err, res) => {
            if (err) throw err;
            done()
          })
        })
    
        it("should not delete the todo when its id does not exist in the datasource", (done) => {
          request(app).post('/todo/3').expect(404).end((err, res) => {
            if (err) throw err;
            done()
          })
        })
      })
  })