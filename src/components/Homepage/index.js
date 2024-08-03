import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import "./index.css"
import Cookies from 'js-cookie';

const Homepage = () => {
  const [todos, setTodos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('https://claw-backend-z4ph.onrender.com/api/todos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchTodos();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({ sessionId: Cookies.get('sessionId') }),
      });
      if (!response.ok) {
        throw new Error('Failed to logout');
      }
      Cookies.remove('token');
      Cookies.remove('sessionId');
      navigate('/login');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="main-container">
      <h1>To-Do List</h1>
      <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      <ul className="list-group">
        {todos.map((todo) => (
          <li key={todo._id} className="list-group-item">
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Homepage;
