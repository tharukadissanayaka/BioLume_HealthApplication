import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./AuthForm.css";
import { FaGoogle, FaApple } from "react-icons/fa";


function SignIn() {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/signin", formData);
            navigate('/main');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("Invalid username or password.");
            } else {
                alert("An error occurred during sign-in.");
            }
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Sign In</h2>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    onChange={handleChange}
                />
                <button type="submit">Sign In</button>
                <div className="divider">OR</div>
                <div className="social-signin">
                    <button type="button" className="social-btn google-btn">
                        <FaGoogle /> Sign In with Google
                    </button>
                    <button type="button" className="social-btn apple-btn">
                        <FaApple /> Sign In with Apple
                    </button>
                </div>
                <div className="form-footer">
                    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                </div>
            </form>
        </div>
    );
}

export default SignIn;