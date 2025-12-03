//Express's Request type does not have a "user" property by default in TypeScript.
// To fix this me must extend the Express Request interface so TypeScript knows that "req.user" exists.

import { User } from "../../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
