const { Router } = require("express");
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("user");
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new UserModel({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: `User Signup Successfully`, newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: `Invalid Credentials` });

    const convertedPassword = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ userID: user._id }, "user", { expiresIn: "1h" });

    if (convertedPassword) {
      return res
        .status(201)
        .json({ message: `User LogIn Successfully`, token });
    } else {
      return res.status(401).json({ message: `Invalid Credentials` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { userRouter };
