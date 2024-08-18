// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

test('sanity', () => {
  expect(true).toBe(true)
})
beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})


describe('[POST] "/auth/register"', () => {
  test('responds with 201 status code',  async () => {
      const user = {username: 'fii', password: 'bar'}
      const response = await request(server).post('/api/auth/register').send(user)
      expect(response.status).toBe(201)
  })
  test('responds with new user',  async () => {
      const user = {username: 'fii', password: 'bar'}
      const response = await request(server).post('/api/auth/register').send(user)
      expect(response.body).toMatchObject({username:'fii', id: 1})
  })
})
describe('[POST] "/auth/login"', () => {
  test('responds with 200 status code',  async () => {
      const user = {username: 'fii', password: 'bar'}
      await request(server).post('/api/auth/register').send(user)
      let response = await request(server).post('/api/auth/login').send(user)
      expect(response.status).toBe(200)
  })
  test('responds with proper welcome message',  async () => {
      const user = {username: 'fii', password: 'bar'}
      await request(server).post('/api/auth/register').send(user)
      let response = await request(server).post('/api/auth/login').send(user)
      expect(response.body).toMatchObject({message: 'welcome, fii'})
  })
})
describe('[GET] "/jokes"', () => {
  test('responds with 401 status code on  unauthorized attempt',  async () => {
      let jokesResponse = await request(server).get('/api/jokes')
      expect(jokesResponse.status).toBe(401)
  })
  test('responds with proper unauthorized message',  async () => {
    let jokesResponse = await request(server).get('/api/jokes')
    expect(jokesResponse.body).toMatchObject({message: 'token required'})
  })
})