import React, { useState } from 'react';
import PasswordInput from "../../components/Input/PasswordInput";
import ValidateEmail from "../../../utils/helper";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Navbar1 from '../../components/Navbar/Navbar1';
import axiosInstance from '../../../utils/axiosinstance';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState(null);
  const [reenterPassword, setReenterPassword] = useState("");
  const navigate = useNavigate();


  const handleSignup = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (!name) {
      setError("Please enter a name.");
      return;
    }
    if (!ValidateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password !== reenterPassword) {
      setError("The password and re-entered password must be the same.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }
  
    setError("");  // Clears the error if all validations pass
  
    try {
      const response = await axiosInstance.post("/create-account", { name, email, mobile, password });
  
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate('/dashboard');
      } else {
        setError(response.data.message || "Unexpected error during signup.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An unexpected error occurred");
    }
  }

  return (
    <>
      <Navbar1 />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl mb-7">Signup</h4>
            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Mobile Number"
              pattern="[0-9]{10}"  // Ensures only 10-digit numbers for validation
              maxLength="10"       // Sets a limit for 10 digits
              className="input-box"
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <PasswordInput
              value={reenterPassword}
              onChange={(e) => setReenterPassword(e.target.value)}
              placeholder="Re-Enter Password"
            />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              Create Account
            </button>
            <p className="text-sm text-center mt-4">
              Already Have an Account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
