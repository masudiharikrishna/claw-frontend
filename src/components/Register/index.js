import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

class Register extends Component {
    state = {
        email: '',
        password: '',
        confirmPassword: '',
        errorMessage: '',
    };

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    validateRegister = async (event) => {
        event.preventDefault();
        const { email, password, confirmPassword } = this.state;

        if (password !== confirmPassword) {
            this.setState({ errorMessage: 'Passwords do not match' });
            return;
        }

        try {
            const response = await fetch('https://claw-backend-z4ph.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            this.props.navigate('/login');
        } catch (error) {
            this.setState({ errorMessage: 'Registration failed. Please try again.' });
        }
    };

    render() {
        const { email, password, confirmPassword, errorMessage } = this.state;
        return (
            <div className='main-container'>
                <h1>REGISTER</h1>
                <div className="register-container">
                    <form onSubmit={this.validateRegister}>
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
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">CONFIRM PASSWORD</label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Register
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

export default withNavigate(Register);
