// import React from "react";
const GetIntials = (name) => {
    if (!name || typeof name !== "string") return "";  
    const words = name.split(" ");
    let initials = "";
    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }
    // console.log(initials); 
    return initials.toUpperCase();
};
export default GetIntials;