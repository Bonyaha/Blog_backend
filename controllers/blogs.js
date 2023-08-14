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
    checked: body.checked,
    comments: []
  })

  const savedBlog = await blog.save()
  await savedBlog.populate('user', { username: 1, name: 1 })

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id/comments', async (request, response) => {
  const body = request.body
  console.log('body in /:id/comments', body)


  const blog = await Blog.findById(request.params.id)
  if (blog) {
    blog.comments.push(body.comments)
    const savedBlog = await blog.save()
    await savedBlog.populate('user', { username: 1, name: 1 })

    response.status(201).json(savedBlog)
  } else {
    response.status(404).json({ error: 'Blog not found' })
  }

})


blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  console.log('body is ', body)
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    checked: body.checked,
    comments: body.comments
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  console.log('updated blog is ', updatedBlog)
  if (updatedBlog) {
    await updatedBlog.populate('user', { username: 1, name: 1 })
    response.json(updatedBlog)
  }
  return response.status(401).json({
    error: 'Blog has been removed',
  })
})

blogsRouter.delete('/', userExtractor, async (request, response) => {
  const user = request.user

  const blogIds = request.body.ids
  console.log('blogIds are ', blogIds)
  const result = await Blog.deleteMany({ _id: { $in: blogIds }, user: user.id })

  if (result.deletedCount > 0) {
    // Remove deleted blogs from the user's blogs array
    user.blogs = user.blogs.filter(
      (blogId) => !blogIds.includes(blogId.toString())
    )
    await user.save()

    return response.status(204).end()
  }
  return response.status(404).json({
    error: 'Blog has been removed',
  })
})
module.exports = blogsRouter
