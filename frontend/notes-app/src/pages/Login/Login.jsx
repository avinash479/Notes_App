import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import ValdiateEmail from "../../../utils/helper";
import axiosInstance from "../../../utils/axiosInstance";
import Navbar1 from "../../components/Navbar/Navbar1";
const Login =()=>{
    const[email,setemail]=useState("");
    const[password,setpassword]=useState("");
    const[error,seterror]=useState(null);
     
    const navigate=useNavigate();
    const Handlelogin = async (e) => {
     e.preventDefault();
     if(!email && !password)
     {
        seterror("Please enter email and password");
        return;
     }
    if(!ValdiateEmail(email))
    {
        seterror("Please Enter Valid Email");
        return;
    }
    if(!password)
    {
        seterror("Please enter the password");
        return
    }
    seterror("");
     
    //Login API Call
    try {
        const response = await axiosInstance.post("/login", { email, password });
        
        // Handle successful login response
        if (response.data && response.data.accessToken) {
            localStorage.setItem("token", response.data.accessToken);
            navigate("/dashboard");
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            seterror(error.response.data.message);
        } else {
            seterror("An unexpected error occurred");
        }
    }
};
    return(
        <>
            <Navbar1 />

           {/* <h1>hello</h1> */}
            <div className="flex items-center justify-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={Handlelogin}>
                        <h4 className="text-2xl mb-7">Login</h4>
                        <input type="text" placeholder="Email" className="input-box"
                        value={email}
                        onChange={(e)=>{setemail(e.target.value)}} 
                         />

                        <PasswordInput 
                        value={password}
                        onChange={(e)=>{setpassword(e.target.value)}}
                        />
                        {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
                        <button type="submit" className="btn-primary">
                            Login
                        </button>
                        <p className="text-sm text-center mt-4">
                            Not Registered yet?{" "}
                            <Link to="/signup" className="font-medium text-primary underline">
                            Create an account
                            </Link>
                        </p>
                        </form>
                </div>
            </div>
        </>
    )
}
export default Login;
