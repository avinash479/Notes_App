import React from 'react';
import GetIntials from '../../../utils/GetIntials';
const ProfileInfo = ({userInfo,onlogout}) => {
  // console.log(userInfo," ",userInfo.fullName);
  return (
    <div className='flex items-center gap-3'>
      <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
        {GetIntials(userInfo.fullName)} 

      </div>
      <div>
        <p className='text-sm font-medium '>
         {userInfo.fullName} </p>
         <button className='text-sm text-slate-700 underline' onClick={onlogout}>Logout</button>
      </div>
    </div>
  )
}

export default ProfileInfo;
