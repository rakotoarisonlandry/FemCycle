const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");

exports.registerValidation = [
  body("email")
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Format d'email invalide")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
];

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    // 2. Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Un compte avec cet email existe déjà" });
    }

    // 3. Hasher le mot de passe et créer l'utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    res
      .status(201)
      .json({
        message: "Compte créé avec succès",
        user: { id: user.id, email: user.email },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Générer token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    res.json({
      msg: "Reset token generated",
      resetToken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpire = null;

    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Wrong password" });

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  user.refreshToken = refreshToken;
  await user.save();

  res.json({ accessToken, refreshToken });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ msg: "No token" });

  const user = await User.findOne({ refreshToken });
  if (!user) return res.status(403).json({ msg: "Invalid token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ msg: "Expired token" });
  }
};

exports.logout = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.refreshToken = null;
  await user.save();

  res.json({ msg: "Logged out" });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
