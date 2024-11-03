import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo';
import {useNavigate} from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar';
const Navbar1 = () => {
//   const[SearchQuery,setSearchQuery]=useState("");
//   const navigate=useNavigate();
//   const onLogout=()=>{
//     localStorage.clear();
//     navigate("/login");
//   }
//   const handleSearch=()=>{
//   }
//   const clearSearch=()=>{
//     setSearchQuery("");
//   };
  return (
    <div>
      <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
        <h2 className='text-xl font-medium text-black py-2'>Notes</h2>
        <p className="text-gray-500 text-sm italic">Write. Remember. Rediscover.</p>
      </div>
    </div>

  )
}

export default Navbar1;
