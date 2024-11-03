import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo';
import {useNavigate} from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar';
const Navbar = ({userInfo,onSearchNote,handleClearSearch}) => {
  const[SearchQuery,setSearchQuery]=useState("");
  const navigate=useNavigate();
  const onLogout=()=>{
    localStorage.clear();
    navigate("/login");
  }
  const handleSearch=()=>{
    if(SearchQuery)
      {
        onSearchNote(SearchQuery)
      }
  }
  const clearSearch=()=>{
    setSearchQuery("");
    handleClearSearch();
  };
 
  return (
    <div>
      <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
        <h2 className='text-xl font-medium text-black py-2'>Notes</h2>
        <SearchBar 
        value={SearchQuery} 
        onChange={(e)=>{
          setSearchQuery(e.target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={clearSearch}
        />
        <ProfileInfo userInfo={userInfo} onlogout={onLogout} />
      </div>
    </div>

  )
}

export default Navbar;
