const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
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
  if (!body.title) {
    return response.status(400).json({ error: 'title is missing' })
  } else if (!body.author) {
    return response.status(400).json({ error: 'author is missing' })
  } else if (!body.url) {
    return response.status(400).json({ error: 'url is missing' })
  }

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  console.log('start of deletion')
  const user = request.user
  console.log('user is: ', user.id)
  console.log('request.params.id:', request.params.id)

  const blog = await Blog.findById(request.params.id)
  console.log('after I found a blog')
  console.log('blog is: ', blog.user.toJSON())

  console.log(blog.user.toJSON() === user.id)

  if (blog && blog.user.toJSON() === user.id) {
    user.blogs = user.blogs.filter(
      (blogId) => blogId.toString() !== request.params.id
    )
    await user.save()
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()
  }
  return response.status(401).json({
    error: 'Unauthorized to access the blog',
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
  response.json(updatedBlog)
})

module.exports = blogsRouter
