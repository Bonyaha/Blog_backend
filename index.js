const express = require('express')

const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const url =
  'mongodb+srv://Roman:5dT2Z37kDLZxx0dW@cluster1.d7mltpu.mongodb.net/blogApp?retryWrites=true&w=majority'

mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: String,
})

const Blog = mongoose.model('Blog', blogSchema)

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

const generateId = () => {
  const maxId = blogs.length > 0 ? Math.max(...blogs.map((blog) => blog.id)) : 0
  return maxId + 1
}

let blogs = [
  {
    title: 'HTML is easy',
    author: 'Jack Daniels',
    url: 'www.bla-bla',
    likes: 3,
    id: 1,
  },
  {
    title: 'Lorem ipsum',
    author: 'Steve Daniels',
    url: 'www.bla-bla4654',
    likes: 8,
    id: 2,
  },
  {
    title: 'NodeJs is cool',
    author: 'Jack Sparrow',
    url: 'www.bla-bla/sdfs',
    likes: 5,
    id: 3,
  },
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => response.json(blogs))
})

app.get('/api/blogs/:id', (request, response) => {
  const id = Number(request.params.id)
  const blog = blogs.find((blog) => blog.id === id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).send('<h3>There is no such page!</h3>')
  }
})
app.post('/api/blogs/', (request, response) => {
  const body = request.body
  if (!body.title) {
    return response.status(400).json({ error: 'title is missing' })
  }
  //console.log(request.headers)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    id: generateId(),
  })

  blog.save().then((savedBlog) => response.json(savedBlog))
  response.json(blog)
})

app.delete('/api/blogs/:id', (request, response) => {
  const id = Number(request.params.id)
  blogs = blogs.filter((blog) => blog.id !== id)
  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3003
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
