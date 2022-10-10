import { Request, Response, NextFunction } from "express";
import ErrorObject from "../../schema/error";
import { supabaseServer } from "../../db/init";
import { FarmRoles, IRoles } from "../../schema/enums";

const authenticator = (user_type?: IRoles[], user_Roles?: FarmRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const jwtToken = req.get("Authorization");
    if (!jwtToken) {
      const error: ErrorObject = {
        message: "Invalid request, access token missing",
        code: 404,
      };
      return next(error);
    }

    const { data, error } = await supabaseServer.auth.api.getUser(jwtToken);
    if (error) {
      const err: ErrorObject = { message: error.message, code: error.status };
      return next(err);
    }

    if (data) {
      req.user = data;
      const errorObj: ErrorObject = {
        message: "You are unauthorized to access this resource",
        code: 403,
      };
      if (user_type && !user_type.includes(data.user_metadata.user_role)) {
        return next(errorObj);
      }
      if (user_Roles) {
        let currentUserRoles = data.user_metadata.roles as FarmRoles[];
        if (!currentUserRoles) {
          return next(errorObj);
        } else {
          user_Roles.forEach((i) => {
            if (!currentUserRoles.includes(i)) {
              return next(errorObj);
            }
          });
        }
      }
    } else {
      const err: ErrorObject = {
        message: "Access token failed to authenticate",
        code: 400,
      };
      return next(err);
    }
    next();
  };
};

export default authenticator;
