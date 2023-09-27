require("dotenv").config();
const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors")
const { connectDB } = require("./config/db")
const { userRouter } = require("./routes/user.route")
const { employeeRouter } = require("./routes/employee.route")

const app = express();


// Swagger definition
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Employee Management System",
            version: "1.0.0",
            description: "API for Employee Management System",
        },
        servers: [
            {
                url: "http://localhost:8080/",
            },
        ],
    },
    apis: ["./routes/*.js"],
};

// Swagger specification
const swaggerSpec = swaggerJsdoc(options);

app.use(express.json());
app.use(cors())
app.use("/user", userRouter)
app.use("/employees", employeeRouter)
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.send("Welcome to Employee Management System")
})

let PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    connectDB()
    console.log(`Server running on port ${PORT}`);
});
