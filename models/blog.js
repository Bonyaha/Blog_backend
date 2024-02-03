const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: String,
  likes: Number,
  checked: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  /* comments: [{ type: String }] */
  comments: [
    {
      content: { type: String },
      date: { type: Date, default: Date.now }
    }
  ]
})
/* toJSON method is used then to convert object to String, just like toString method of JS */
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Blog', blogSchema)
