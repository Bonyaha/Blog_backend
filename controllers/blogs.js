const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  })

  const savedBlog = await blog.save()
  await savedBlog.populate('user', { username: 1, name: 1 })

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/', userExtractor, async (request, response) => {
  console.log('request is ', request)
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (blog && blog.user.toJSON() === user.id) {
    user.blogs = user.blogs.filter(
      (blogId) => blogId.toString() !== request.params.id
    )
    await user.save()
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()
  }
  return response.status(404).json({
    error: 'Not found such blog',
  })
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })

  await updatedBlog.populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

module.exports = blogsRouter
