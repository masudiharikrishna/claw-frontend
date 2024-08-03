import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Cookies from 'js-cookie';

class Login extends Component {
    state = {
        email: '',
        password: '',
        errorMessage: '',
    }

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    validateLogin = async (event) => {
        event.preventDefault();
        const { email, password } = this.state;
        try {
            const response = await fetch('https://claw-backend-z4ph.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error('Invalid credentials');
            }
            const data = await response.json();
            Cookies.set('token', data.token, { expires: 7 });
            this.props.navigate('/');
        } catch (error) {
            this.setState({ errorMessage: 'Invalid credentials. Please try again.' });
        }
    };

    render() {
        const { email, password, errorMessage } = this.state;
        return (
            <div className='main-container'>
                <h1>LOGIN</h1>
                <div className="login-container">
                    <form onSubmit={this.validateLogin}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">EMAIL</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={email}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">PASSWORD</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={password}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Login
                        </button>
                    </form>
                    <p id="error-message" className="text-danger">{errorMessage}</p>
                </div>
            </div>
        );
    }
}

// Custom wrapper to use the navigate hook with class components
function withNavigate(Component) {
    return function WrappedComponent(props) {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

export default withNavigate(Login);
