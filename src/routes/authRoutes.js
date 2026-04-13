const express = require("express");
const router = express.Router();
const { register, login , refreshToken , logout , forgotPassword , resetPassword , getAllUsers ,deleteUser } = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", auth, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
module.exports = router;