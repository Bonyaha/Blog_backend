const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => response.json(blogs))
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

blogsRouter.post('/', (request, response, next) => {
  const body = request.body
  if (!body.title) {
    return response.status(400).json({ error: 'title is missing' })
  } else if (!body.author) {
    return response.status(400).json({ error: 'author is missing' })
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  blog
    .save()
    .then((result) => {
      response.status(201).json(result)
    })
    .catch((error) => next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

module.exports = blogsRouter
