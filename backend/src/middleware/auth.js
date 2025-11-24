import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  //Se debe ingresar "Bearer token"
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id, email: decoded.email };

    next();
  } catch (err) {
    console.error("Error in auth middleware:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
