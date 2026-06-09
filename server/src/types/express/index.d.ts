// Express's Request type does not have a "user" property by default in TypeScript.
// To fix this we must extend the Express Request interface so TypeScript knows that "req.user" exists.

import { RegisterUser } from "../../models/User.model";

declare global {
  namespace Express {
    interface Request {
      user?: RegisterUser;
    }
  }
}
