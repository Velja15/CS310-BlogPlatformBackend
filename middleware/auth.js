import jwt from "jsonwebtoken";

// protect: dozvoljava pristup samo ako je u zaglavlju prosleđen ispravan JWT token.
// Iz tokena se rekonstruiše req.user (id, role, username).
export const protect = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Nije prosleđen token. Pristup odbijen." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "tajni_kljuc_dev");
    req.user = decoded; // { id, role, username }
    next();
  } catch {
    return res.status(401).json({ message: "Nevažeći ili istekao token." });
  }
};

// adminOnly: RBAC — dozvoljava pristup samo korisnicima sa ulogom "admin".
// Mora se koristiti nakon protect middleware-a.
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Pristup dozvoljen samo administratoru." });
  }
  next();
};
