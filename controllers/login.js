const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!user) {
    return response.status(401).json({
      error: 'invalid username',
    })
  }

  if (!passwordCorrect) {
    return response.status(401).json({
      error: 'invalid password',
    })
  }
  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const expirationTime = 60 * 60 // Expiration time in seconds
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: expirationTime,
  })

  response.status(200).send({
    token,
    username: user.username,
    name: user.name,
    expirationTime: Date.now() + expirationTime * 1000, // Calculate expiration time on the server
  })
})

module.exports = loginRouter
