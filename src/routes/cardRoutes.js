import express from "express";
import cardController from "../controllers/cardController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import businessMiddleware from "../middleware/businessMiddleware.js";
import cardValidation from "../validations/cardValidation.js";
import validationMiddleware from "../middleware/validationMiddleware.js";

const router = express.Router();

// Get all cards
router.get("/", cardController.getAll);

// Get user's cards
router.get("/my-cards", authMiddleware, cardController.getByUserId);

// Get card by ID
router.get("/:id", cardController.getById);

// Create new card - registered business user
router.post(
  "/",
  authMiddleware,
  businessMiddleware,
  validationMiddleware(cardValidation),
  cardController.create,
);
// Update card - only card owner
router.put(
  "/:id",
  authMiddleware,
  validationMiddleware(cardValidation),
  cardController.update,
);
// Like / unlike card - registered user
router.patch("/:id", authMiddleware, cardController.like);

// Delete card - owner or admin
router.delete("/:id", authMiddleware, cardController.remove);

export default router;
