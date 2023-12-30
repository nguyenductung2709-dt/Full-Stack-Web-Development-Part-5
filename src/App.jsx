import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import PropTypes from 'prop-types'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [nameOfCreator, setNameOfCreator] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes); 
      setBlogs(sortedBlogs);
    });
  }, []);
  

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    
    try {
      window.localStorage.removeItem('loggedBlogappUser') 
      blogService.setToken(null);
      setUser(null)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Error logging out')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
    )
      
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()  
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setNameOfCreator(user.name)
        setBlogs(blogs.concat(returnedBlog))
        setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      })
  }

  const handleLike = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }; 
  
    blogService
      .update(updatedBlog)
      .then(returnedBlog => {
        setNameOfCreator(user.name);
        setBlogs(blogs.map(blogItem => (blogItem.id === returnedBlog.id ? returnedBlog : blogItem)));
        setErrorMessage(`Liked blog: ${returnedBlog.title} by ${returnedBlog.author}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      })
      .catch(error => {
        setErrorMessage('Failed to like the blog');
      });
  };

  const deleteBlog = (blogToDelete) => {
    blogService
      .remove(blogToDelete.id) 
      .then(() => {
        const updatedBlogs = blogs.filter(blog => blog.id !== blogToDelete.id);
        setBlogs(updatedBlogs);
        setErrorMessage(`Deleted blog: ${blogToDelete.title} by ${blogToDelete.author}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      })
      .catch(error => {
        setErrorMessage('Failed to delete the blog');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };
  
  
  if (user === null) {
    return(
      <>
      <Notification message={errorMessage} />      
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          placeholder = "Username"
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          placeholder = "Password"
        />
      </div>
      <button type="submit">login</button>
    </form>      
    </>
    )
  }
  else {
    return(
    <div>
      <Notification message={errorMessage} />
      <h2>blogs</h2>
      <p>{user.name} logged in</p> <button onClick = {handleLogout}>logout</button>  
      {blogForm()}
      <Blog blogs={blogs} increaseLike={handleLike} deleteBlog={deleteBlog} nameOfCreator={nameOfCreator} />
    </div>
    )
  }
}

export default App