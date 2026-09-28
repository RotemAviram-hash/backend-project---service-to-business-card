import express from "express";
import userController from "../controllers/userController.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import {
  userValidation,
  businessStatusValidation,
} from "../validations/userValidation.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import userAuthorizationMiddleware from "../middleware/userAuthorizationMiddleware.js";
const router = express.Router();

router.post(
  "/",
  validationMiddleware(userValidation),
  userController.createUser,
);

router.get("/", authMiddleware, adminMiddleware, userController.getUsers);
router.get(
  "/:id",
  authMiddleware,
  userAuthorizationMiddleware,
  userController.getUserById,
);

router.put(
  "/:id",
  authMiddleware,
  userAuthorizationMiddleware,
  validationMiddleware(userValidation),
  userController.updateUser,
);

router.patch(
  "/:id",
  authMiddleware,
  userAuthorizationMiddleware,
  validationMiddleware(businessStatusValidation),
  userController.updateBusinessStatus,
);

router.delete(
  "/:id",
  authMiddleware,
  userAuthorizationMiddleware,
  userController.deleteUser,
);
export default router;
