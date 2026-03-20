const { errorResponse } = require("../utils/helpers");

module.exports = (roles) => {
  return (req, res, next) => {
    try {
     
      if (!Array.isArray(roles)) {
        roles = [roles];
      }

      if (!req.user || !req.user.role) {
        return errorResponse(res, "Unauthorized.", 401);
      }

      const userRole = req.user.role.toUpperCase();

      const isAllowed = roles
        .map(r => r.toUpperCase())
        .includes(userRole);

      if (!isAllowed) {
        return errorResponse(res, "Access denied.", 403);
      }

      return next();
    } catch (error) {
      console.error("Role middleware error:", error);
      return errorResponse(res, "Something went wrong.", 500);
    }
  };
};