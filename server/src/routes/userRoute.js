import express from "express";
import { body } from "express-validator";
import favoriteController from "../controllers/favoriteController.js";
import userController from "../controllers/userController.js";
import requestHandler from "../handlers/requestHandler.js";
import userModel from "../models/userModel.js";
import tokenMiddleware from "../middlewares/tokenMiddleware.js";

const router = express.Router();

// Rota para cadastro de usuário
router.post(
  "/signup",
  // Valida o nome de usuário
  body("username")
    .exists().withMessage("O nome de usuário é obrigatório")
    .isLength({ min: 8 }).withMessage("O nome de usuário deve ter no mínimo 8 caracteres"),
  // Valida a senha
  body("password")
    .exists().withMessage("A senha é obrigatória")
    .isLength({ min: 8 }).withMessage("A senha deve ter no mínimo 8 caracteres"),
  // Valida a confirmação da senha e garante que coincide com a senha
  body("confirmPassword")
    .exists().withMessage("A confirmação da senha é obrigatória")
    .isLength({ min: 8 }).withMessage("A confirmação da senha deve ter no mínimo 8 caracteres")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("A confirmação da senha não coincide");
      return true;
    }),
  // Valida o nome de exibição
  body("displayName")
    .exists().withMessage("O nome de exibição é obrigatório")
    .isLength({ min: 8 }).withMessage("O nome de exibição deve ter no mínimo 8 caracteres"),
  requestHandler.validate,
  userController.signup
);

// Rota para login de usuário
router.post(
  "/signin",
  // Valida o email
  body("email")
    .exists().withMessage("O email é obrigatório")
    .isLength({ min: 8 }).withMessage("O email deve ter no mínimo 8 caracteres"),
  // Valida a senha
  body("password")
    .exists().withMessage("A senha é obrigatória")
    .isLength({ min: 8 }).withMessage("A senha deve ter no mínimo 8 caracteres"),
  requestHandler.validate,
  userController.signin
);

// Rota para atualização de senha do usuário
router.put(
  "/update-password",
  tokenMiddleware.auth,
  // Valida a senha atual
  body("password")
    .exists().withMessage("A senha atual é obrigatória")
    .isLength({ min: 8 }).withMessage("A senha atual deve ter no mínimo 8 caracteres"),
  // Valida a nova senha
  body("newPassword")
    .exists().withMessage("A nova senha é obrigatória")
    .isLength({ min: 8 }).withMessage("A nova senha deve ter no mínimo 8 caracteres"),
  // Valida a confirmação da nova senha e garante que coincide com a nova senha
  body("confirmNewPassword")
    .exists().withMessage("A confirmação da nova senha é obrigatória")
    .isLength({ min: 8 }).withMessage("A confirmação da nova senha deve ter no mínimo 8 caracteres")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error("A confirmação da nova senha não coincide");
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword
);

// Rota para obter informações do usuário
router.get(
  "/info",
  tokenMiddleware.auth,
  userController.getInfo
);

// Rota para obter os favoritos do usuário
router.get(
  "/favorites",
  tokenMiddleware.auth,
  favoriteController.getFavoritesOfUser
);

// Rota para adicionar um favorito
router.post(
  "/favorites",
  tokenMiddleware.auth,
  // Valida o tipo de mídia
  body("mediaType")
    .exists().withMessage("O tipo de mídia é obrigatório")
    .custom(type => ["movie", "tv"].includes(type)).withMessage("Tipo de mídia inválido"),
  // Valida o ID da mídia
  body("mediaId")
    .exists().withMessage("O ID da mídia é obrigatório")
    .isLength({ min: 1 }).withMessage("O ID da mídia não pode estar vazio"),
  // Valida o título da mídia
  body("mediaTitle")
    .exists().withMessage("O título da mídia é obrigatório"),
  // Valida o poster da mídia
  body("mediaPoster")
    .exists().withMessage("O poster da mídia é obrigatório"),
  // Valida a avaliação da mídia
  body("mediaRate")
    .exists().withMessage("A avaliação da mídia é obrigatória"),
  requestHandler.validate,
  favoriteController.addFavorite
);

// Rota para remover um favorito pelo ID
router.delete(
  "/favorites/:favoriteId",
  tokenMiddleware.auth,
  favoriteController.removeFavorite
);

export default router;
