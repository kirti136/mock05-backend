require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db")
const { userRouter } = require("./routes/user.route")
const { employeeRouter } = require("./routes/employee.route")

const app = express();

app.use(express.json());
app.use("/user", userRouter)
app.use("/employees", employeeRouter)


app.get("/", (req, res) => {
    res.send("Welcome to Employee Management System")
})

let PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    connectDB()
    console.log(`Server running on port ${PORT}`);
});
