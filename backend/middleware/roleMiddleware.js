// Check if user has one of the allowed roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied: insufficient role" });
    }
    next();
  };
};

module.exports = { authorizeRoles };
