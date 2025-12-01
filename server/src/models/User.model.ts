import mongoose, { Document, Schema } from "mongoose";

export interface RegisterUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  password: string;
}

const userSchema = new Schema<RegisterUser>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model<RegisterUser>("User", userSchema)

export default User;
