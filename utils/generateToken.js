const jwt = require("jsonwebtoken");

module.exports = function generateToken(user) {
  const payload = { id: user._id, role: user.role };
  const secret = process.env.JWT_SECRET || "devsecret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn });
};
