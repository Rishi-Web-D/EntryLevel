const mongoose = require("mongoose");

mongoose
    .connect("mongodb+srv://rishisharma3034:rishirishi@task-management-db.xxkt9j6.mongodb.net/?retryWrites=true&w=majority&appName=Task-management-db")
    .then(()=> console.log("Database connected!"))
    .catch((err)=> console.log(err));