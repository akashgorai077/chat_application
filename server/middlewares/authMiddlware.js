import { asyncHandler } from "../utilities/asyncHandlerUtility.js";
import { errorHandler } from "../utilities/errorHandlerUtility.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.token || req.headers["authorization"]?.replace("Bearer", "");
  console.log(token);
  if (!token) {
    return next(new errorHandler("Invalid token", 400));
  }
  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  console.log(tokenData);
  req.user = tokenData;
  next();
});
