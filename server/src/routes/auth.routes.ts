import express from "express";

import { register, login } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login)
// router.get("/profile", authMiddleware, getProfile);

export default router;


// import express from "express";

// import { register, login, logout, refreshToken } from "../controllers/auth.controller";

// const router = express.Router();


// router.post("/register", register);
// router.post("/login", login);
// router.post("/logout", logout)
// router.get("/refresh", refreshToken);

// export default router;
