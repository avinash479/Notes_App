 const ValdiateEmail=(email)=>{
const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return regex.test(email);
}

export default ValdiateEmail;
 