import React from 'react';
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Blog from './Blog'; 
import userEvent from '@testing-library/user-event'


describe('Blog component', () => {
  test('renders title and author by default', () => {
    const blogs = [
      {
        id: 1,
        title: 'Test Blog Title 1',
        author: 'Test Author 1',
        url: 'http://test-url.com/1',
        likes: 10,
      },
      {
        id: 2,
        title: 'Test Blog Title 2',
        author: 'Test Author 2',
        url: 'http://test-url.com/2',
        likes: 5,
      },
    ];

    render(<Blog blogs={blogs} />);

    blogs.forEach(blog => {
      const titleElement = screen.getByText(`${blog.title} by ${blog.author}`);
      expect(titleElement).toBeInTheDocument();
    });

    blogs.forEach(blog => {
      const urlElement = screen.queryByText(blog.url);
      const likesElement = screen.queryByText(blog.likes.toString());

      expect(urlElement).not.toBeInTheDocument();
      expect(likesElement).not.toBeInTheDocument();
    });
  });

  test('blog URL and number of likes are shown when the button is clicked', () => {
    const blogs = [
      {
        id: 1,
        title: 'Test Blog Title 1',
        author: 'Test Author 1',
        url: 'http://test-url.com/1',
        likes: 10,
      }
    ]
    render(<Blog blogs={blogs} />);

    blogs.forEach(blog => {
      const titleElement = screen.getByText(`${blog.title} by ${blog.author}`);
      expect(titleElement).toBeInTheDocument();
    });

    blogs.forEach(blog => {
      const urlElement = screen.queryByText(blog.url);
      const likesElement = screen.queryByText(blog.likes.toString());

      expect(urlElement).not.toBeInTheDocument();
      expect(likesElement).not.toBeInTheDocument();
    });

    const button = screen.getByText('view');
    userEvent.click(button);
    
    blogs.forEach(blog => {
      const urlElement = screen.queryByText(blog.url);
      const likesElement = screen.queryByText(blog.likes.toString());

      expect(urlElement).toBeDefined();
      expect(likesElement).toBeDefined();
    });
  })
})
