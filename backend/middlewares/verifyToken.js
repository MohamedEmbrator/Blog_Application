const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decodedPayload;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid Token, Access Denied" });
    }
  } else {
    return res.status(401).json({ message: "No Token Provided, Access Denied" });
  }
}

function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Not Allowed, Only Admin"});
    }
  })
};

function verifyTokenAndOnlyUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res.status(403).json({ message: "Not Allowed, Only User Himself"});
    }
  })
};

function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Not Allowed, Only User Himself Or Admin"});
    }
  })
};

module.exports = { verifyToken, verifyTokenAndAdmin, verifyTokenAndOnlyUser, verifyTokenAndAuthorization };