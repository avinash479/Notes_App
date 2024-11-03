require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const { authenticationToken } = require("./utilities")
const User = require("./models/user.model")
const Note=require("./models/note.model")
const port=process.env.PORT ||8000;

app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.json({ data: "hello" })
})

//Create Account
app.post("/create-account", async (req, res) => {
    const { name:fullName, email, mobile:phone, password } = req.body;
    console.log(`${fullName} ${email} ${phone} ${password}`)
    if (!fullName) {
        return res.status(400).json({ error: true, message: "Full Name is Required" })
    }
    if (!email) {
        return res.status(400).json({ error: true, message: "Email is Required" })
    }
    if (!password) {
        return res.status(400).json({ error: true, message: " password is Required" })
    }
    if (!phone) {
        return res.status(400).json({ error: true, message: "Phone number is required" });
    }

    try {
        const isuser = await User.findOne({ email:email });
        if (isuser) {
            return res.status(400).json({ error: true, message: "User Already Exist" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
    
    try{
        const isphone=await User.findOne({phone:phone});
        if(isphone)
        {
            return res.status(400).json({error:true , message :"User Already Exist with this phone numer "})
        }
    } catch(error){
        cons.log("Error Fetching user:",error);
    }

    const user = new User({
        fullName,
        email,
        phone,
        password,
    });
    await user.save();
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3600m",
    });
    return res.json({
        error: false,
        user,
        accessToken,
        message: "Register Successfull",
    });
});
//add-note
app.post("/add-note",authenticationToken,async(req,res)=>{
    const {title,content,tags}=req.body;
    const{user}=req.user;
    if(!title)
    {
        return res.status(400).json("Title is Required");
    }
    if(!content)
    {
        return res.status(400).json("Content is Required");
    }

    try{
        const note =new Note({
            title,
            content,
            tags:tags || [],
            userId:user._id
        })
        await note.save();
        return res.json({
            error:false,
            note,
            message:"Note added sucessfully"
        });
    }
    catch(error)
    {
        return res.status(500).json({error:true,message:"Internal Server Error"})
    }
})

//Login Account
app.post("/login", async (req,res)=>{
  const {email,password}=req.body;
   if(!email)
   {
    return res.status(400).json({message:"email is required"});
   }
   if(!password)
   {
    return res.status(400).json({message:"password is required"});
   }
   const userInfo=await User.findOne({email:email});
   if(!userInfo)
   {
    return res.status(400).json({message:"User not found"});
   }
   if(userInfo.email==email && userInfo.password==password)
   {
    const user={user:userInfo};
    const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"3600m",
    });
    return res.json({
        error:false,
        message:"Login Successful",
        email,
        accessToken,
    });

   }else
   {
    return res.status(400).json({
        error:true,
        message:"Invalid Credentials",

    })
   }
})

//edit-note
app.put("/edit-note/:noteId", authenticationToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;

    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: "No Changes Provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: req.user.user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (typeof isPinned !== "undefined") note.isPinned = isPinned; // Allow `false` for unpinning
        
        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note was updated successfully",
        });
    } catch (error) {
        console.error("Error updating note:", error); // Log error details for debugging
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// get all notes
app.get("/get-all-notes",authenticationToken,async(req,res)=>{
    
    const {user}=req.user;
    try{
        const notes=await Note.find({userId: user._id}).sort({isPinned:-1});
        return res.json({
            error:false,
            notes,
            message:"All notes retrived successfully ",
        })
    }catch(error)
    {
        return res.status(500).json({
            error:true,
            message:"Internal Server Error",
        })  
    }   
})

//delete notes
app.delete("/delete-note/:noteId",authenticationToken, async(req,res)=>{
     const noteId=req.params.noteId;
     const {user}=req.user;
     try{
        const note=await Note.findOne({_id:noteId,userId:user._id});
        if(!note)
        {
            return res.status(404).json({error:true,message:"Note not found"});
        }
        await note.deleteOne({_id:noteId,userId:user._id});
        return res.json({
            error:false,
            message:"Note deleted succesfully",
        })
     }catch(error)
     {
        return res.status(500).json({
            error:true,
            message:"Internal Server Error",
        })

     }
});

//Update isPinned
app.put("/update-note-pinned/:noteId",authenticationToken,async(req,res)=>{
    const noteId = req.params.noteId;
    const {isPinned } = req.body;

    try {
        const note = await Note.findOne({ _id: noteId, userId: req.user.user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }
        if (typeof isPinned !== "undefined") note.isPinned = isPinned; 
        
        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note was updated successfully",
        });
    } catch (error) {
        console.error("Error updating note:", error); // Log error details for debugging
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
})

//Get User
app.get("/get-user",authenticationToken, async(req,res)=>{
    const { user }=req.user;
    const isuser=await User.findOne({_id:user._id});
    if(!isuser)
    {
        res.sendStatus(401);
    }
    return res.json({
        user:{fullName:isuser.fullName, email:isuser.email,user_id:isuser._id,phone:isuser.phone,password:isuser.password},
        message:"",
    })
})

//Search  note
app.get("/search-notes/",authenticationToken,async(req,res)=>{
   const{user}=req.user;
   const{query}=req.query;
   if(!query)
   {
    return res.status(400).json({error:true,message:"Search query is required"})
   }
   try{
    const matchingNotes=await Note.find({
        userId:user._id,
        $or : [
            {title:{$regex: new RegExp(query,"i")}},
            {content:{$regex :new RegExp(query,"i")}},
        ]       
    });
    return res.json({
        error:false,
        notes:matchingNotes,
        message:"Notes matching the search query retrived successfully ",
    })
   }catch(error)
   {
    return res.status(500).json({
        error:true,
        message:"Internal Server Error",
    })
   }
})
app.listen(port);
module.exports = app;