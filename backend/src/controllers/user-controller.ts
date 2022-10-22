import { userSchema } from "../schema/user-schema";
import { Request, Response, NextFunction } from "express";
import UserController from "../modules/user/controller";

const userControl: UserController = new UserController("user");

export const getUserViaId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await userControl.get(req, res, next);
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await userControl.create(req, res, next, userSchema);
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await userControl.passwordReset(req, res, next);
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await userControl.login(req, res, next);
};

export const deleteUser = async (req: Request, res: Response) => {
  return await userControl.closeAccount();
};
