import express from "express";
import {
  login,
  register,
  getProfile,
  logout,
  getOtherUsers,
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  denyFriendRequest,
  unfriendUser,
} from "../controllers/userController.js"; // ✅ Import correctly
import { isAuthenticated } from "../middlewares/authMiddlware.js";
const router = express.Router();

router.post("/register", register); // ✅ Use imported function
router.post("/login", login); // ✅ Use imported function
router.post("/logout", isAuthenticated, logout); // ✅ Use imported function
router.get("/get-profile", isAuthenticated, getProfile); // ✅ Use imported function
router.get("/get-other-users", isAuthenticated, getOtherUsers); // ✅ Use imported function
router.post("/friend-request/:userId/send", isAuthenticated, sendFriendRequest);
router.post(
  "/friend-request/:userId/cancel",
  isAuthenticated,
  cancelFriendRequest,
);
router.post(
  "/friend-request/:userId/accept",
  isAuthenticated,
  acceptFriendRequest,
);
router.post("/friend-request/:userId/deny", isAuthenticated, denyFriendRequest);
router.post("/friend/:userId/unfriend", isAuthenticated, unfriendUser);

export default router; // ✅ Correct ES module export
