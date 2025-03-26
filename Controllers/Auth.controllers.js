import RegisterModel from "../Models/Register.model.js";

// Register by admin Controller
export const registerAdmin = async (req, res) => {
  try {
    const { name, email } = req.body;

    console.log(req.body);

    const existingUser = await RegisterModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: "failure", message: "User Already exists." });
    }

    const newUser = new RegisterModel({ name, email });

    await newUser.save();
    res.status(201).json({
      Status: "success",
      message: "Account created successfully.",
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: "Account can't be created. Please try again later.",
    });
  }
};

// Register by candidate Controller
export const register = async (req, res) => {
  try {
    const { name, email } = req.body;

    const existingUser = await RegisterModel.findOne({ email });

    if (existingUser) {
      return res.status(200).json({
        status: "success",
        message: "Login successfully.",
        data: existingUser,
      });
    } else {
      return res
        .status(404)
        .json({ status: "failed", message: "User does not exist." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error." });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await RegisterModel.findOne({ email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ status: "failure", message: "Please use registered email." });
    }

    res.status(200).json({
      status: "success",
      message: "Login successfully.",
      existingUser,
    });
  } catch (err) {
    res.status(500).json({
      status: "failure",
      message:
        "User cannot be authenticated at this time. Please try again later.",
    });
  }
};
