import UserModel from "../Models/User.js";

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, userName } = req.body;
    console.log(req.body);
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "failure", message: "User Already exists." });
    }
    const password = Buffer.from(req.body.password).toString('base64');
    const newUser = new UserModel({ firstName, lastName, email, userName, password });
    await newUser.save();
    res.status(201).json({
      Status: "success",
      message: "Account created successfully.",
      data: newUser,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error." });
  }
};


export const userLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ status: "failure", message: "Please use registered email." });
    }

    if(existingUser.password !== Buffer.from(req.body.password).toString('base64')){
        return res
        .status(401)
        .json({ status: "failure", message: "Invalid credentials." });
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
