const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
]
beforeEach(async () => {
  await Blog.deleteMany({})
  let noteObject = new Blog(blogs[0])
  await noteObject.save()
  noteObject = new Blog(blogs[1])
  await noteObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(blogs.length)
})

test('the first blog is about Mongo', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map((r) => r.title)
  expect(contents).toContain('React patterns')
})

test('there is a property named id', async () => {
  const response = await api.get('/api/blogs')

  const ids = response.body.map((r) => r.id)
  expect(ids[0]).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Phyton',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map((r) => r.title)

  expect(response.body).toHaveLength(blogs.length + 1)
  expect(titles).toContain('Phyton')
})

test('blog without title or url are not added', async () => {
  const newBlog = {
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
  }
  await api.post('/api/blogs').send(newBlog).expect(400)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(blogs.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})
