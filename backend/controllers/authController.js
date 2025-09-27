const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, role, region } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // Derive preferredLanguage from region
    const preferredLanguage = region ? User.deriveLanguageFromRegion(region) : "English";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      region,
      preferredLanguage
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      region: user.region,
      preferredLanguage: user.preferredLanguage,
      token: generateToken(user.id, user.role)
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      region: user.region,
      preferredLanguage: user.preferredLanguage,
      token: generateToken(user.id, user.role)
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update user region/language
exports.updateRegionLanguage = async (req, res) => {
  const userId = req.user.id;
  const { region } = req.body;
  try {
    const preferredLanguage = region ? User.deriveLanguageFromRegion(region) : "English";
    const user = await User.findByIdAndUpdate(
      userId,
      { region, preferredLanguage },
      { new: true }
    );
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      region: user.region,
      preferredLanguage: user.preferredLanguage
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
