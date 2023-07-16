// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

module.exports = {
  dummy,
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  const reducer = (maxBlogLikes, currentBlog) => {
    if (currentBlog.likes > maxBlogLikes.likes) {
      return currentBlog
    } else {
      return maxBlogLikes
    }
  }
  const { title, author, likes } = blogs.reduce(reducer)
  const obj = {
    title,
    author,
    likes,
  }
  return obj
}

const mostBlogs = (blogs) => {
  const blogsCount = {}

  for (let i = 0; i < blogs.length; i++) {
    let author = blogs[i].author
    if (blogsCount[author]) {
      blogsCount[author]++
    } else {
      blogsCount[author] = 1
    }
  }
  let topAuthor = ''
  let mostBlogs = 0

  for (let key in blogsCount) {
    if (blogsCount[key] > mostBlogs) {
      topAuthor = key
      mostBlogs = blogsCount[key]
    }
  }
  return {
    author: topAuthor,
    blogs: mostBlogs,
  }
}

const mostLikes = (blogs) => {
  const blogsCount = {}

  for (let i = 0; i < blogs.length; i++) {
    let author = blogs[i].author
    let likes = blogs[i].likes
    if (blogsCount[author]) {
      blogsCount[author] += likes
    } else {
      blogsCount[author] = likes
    }
  }
  let topAuthor = ''
  let mostLikes = 0

  for (let key in blogsCount) {
    if (blogsCount[key] > mostLikes) {
      topAuthor = key
      mostLikes = blogsCount[key]
    }
  }
  return {
    author: topAuthor,
    likes: mostLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}
