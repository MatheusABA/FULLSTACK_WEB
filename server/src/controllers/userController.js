import userModel from "../models/userModel.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/responseHandler.js";

// Função para registrar um novo usuário
const signup = async (req, res) => {
  try {
    const { username, password, displayName, email } = req.body;

    // Verifica se o email já está cadastrado
    const checkUser = await userModel.findOne({ email });
    if (checkUser) return responseHandler.badrequest(res, "Email já cadastrado!");

    // Cria um novo usuário
    const user = new userModel({ username, displayName, email });
    user.setPassword(password); // Define a senha do usuário
    
    await user.save(); // Salva o usuário no banco de dados

    // Gera um token JWT
    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    // Retorna o token e os dados do usuário
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

// Função para login de usuário
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca o usuário pelo email
    const user = await userModel.findOne({ email }).select("+password +salt");
    if (!user) return responseHandler.badrequest(res, "Email não cadastrado!");

    // Verifica se a senha é válida
    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Senha ou email inválidos!");

    // Gera um token JWT
    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    // Retorna o token e os dados do usuário
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

// Função para atualizar a senha do usuário
const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    // Busca o usuário pelo ID
    const user = await userModel.findById(req.user.id).select("password id salt");
    if (!user) return responseHandler.unauthorize(res);

    // Verifica se a senha atual é válida
    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Senha incorreta");

    // Define a nova senha
    user.setPassword(newPassword);

    await user.save(); // Salva a nova senha no banco de dados

    responseHandler.ok(res); // Resposta de sucesso
  } catch (error) {
    console.error(error); // Registrar o erro para depuração
    responseHandler.error(res);
  }
};

// Função para obter informações do usuário
const getInfo = async (req, res) => {
  try {
    // Busca o usuário pelo ID
    const user = await userModel.findById(req.user.id);
    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user); // Retorna as informações do usuário
  } catch (error) {
    console.error(error); // Registrar o erro para depuração
    responseHandler.error(res);
  }
};

// Exporta as funções como um objeto
export default {
  signup,
  signin,
  getInfo,
  updatePassword
};
