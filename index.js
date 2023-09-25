require("dotenv").config()
const express = require("express")
const app = express()

app.get("/", (req, res) => {
    res.send("Hello mock-5")
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})