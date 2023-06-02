const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await helper.blogsInDb()

    expect(response).toHaveLength(helper.initialBlogs.length)
  })

  test('the first blog is about React patterns', async () => {
    const response = await helper.blogsInDb()

    const contents = response.map((r) => r.title)
    expect(contents).toContain('React patterns')
  })

  test('there is a property named id', async () => {
    const response = await helper.blogsInDb()

    const ids = response.map((r) => r.id)
    expect(ids[0]).toBeDefined()
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual(blogToView)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()
    await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api.get(`/api/blogs/${invalidId}`).expect(400)
  })
})

describe('addition of a new blog', () => {
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

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map((r) => r.title)

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain('Phyton')
  })

  test('blog without title or url are not added', async () => {
    const newBlog = {
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    }
    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('missing property "likes" default to 0', async () => {
    const newBlog = {
      title: 'Phyton + NodeJS',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    }
    await api.post('/api/blogs').send(newBlog)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toEqual(0)
  })
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map((r) => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('modifying of blog', () => {
  test('blog can be modified', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToModify = blogsAtStart[0]
    console.log(`from start: ${blogToModify.likes}`)

    blogToModify.likes = 777

    console.log(`after change: ${blogToModify.likes}`)

    blogToModify.url = 'https://pornhub.com/'
    await api
      .put(`/api/blogs/${blogToModify.id}`)
      .send(blogToModify)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    console.log(`at the end: ${blogsAtEnd[0].likes}`)

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    expect(blogsAtEnd[0].likes).toBe(777)
    expect(blogsAtEnd[0].url).toContain('https://pornhub.com/')
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('dNX3sTE3', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Roman',
      name: 'Roman',
      password: 'dNX3sTE3',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'dNX3sTE3',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
