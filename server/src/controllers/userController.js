import userModel from "../models/userModel.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/responseHandler.js";

const signup = async (req, res) => {
  try {
    const { username, password, displayName, email } = req.body;

    const checkUser = await userModel.findOne({ email });

    if (checkUser) return responseHandler.badrequest(res, "Email já cadastrado!");

    const user = new userModel({
      username,
      displayName,
      email,
    });

    // user.displayName = displayName;
    // user.username = username;
    user.setPassword(password);
    
    await user.save();

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    });
  } catch (error) {
    console.error(error); // Registrar o erro para depuração
    responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password +salt");

    if (!user) return responseHandler.badrequest(res, "Email não cadastrado!");

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Senha ou email inválidos!");

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );


    return responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    });
  } catch (error) {
    console.error(error); // Registrar o erro para depuração
    responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await userModel.findById(req.user.id).select("password id salt");

    if (!user) return responseHandler.unauthorize(res);

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Senha incorreta");

    user.setPassword(newPassword);

    await user.save();

    responseHandler.ok(res);
  } catch (error) {
    console.error(error); // Registrar o erro para depuração
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch (error) {
    console.error(error); // Registrar o erro para depuração
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  updatePassword
};
