import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Cookies from 'js-cookie';
import {ColorRing} from "react-loader-spinner"

const Homepage = () => {
  const [todos, setTodos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTodos = async () => {
      try {
        const response = await fetch('https://claw-backend-z4ph.onrender.com/api/todos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        setTodos(data.todos);
        setLoading(false);
      } catch (error) {
        setErrorMessage(error.message);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchTodos();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch('https://claw-backend-z4ph.onrender.com/api/auth/logout', {
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
      {loading ? (
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
      ) : (
        <div>
          {todos.length === 0 ? (
            <p>No todos Found</p>
          ) : (
            <ul className="list-group">
              {todos.map((todo) => (
                <li key={todo._id} className="list-group-item">
                  {todo.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Homepage;
