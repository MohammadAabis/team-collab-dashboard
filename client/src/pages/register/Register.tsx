import { useState } from "react";
import { useForm } from "react-hook-form";

import "./register.css";
// form control k liye formik and validation k liye yup

type RegisterFormData = {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = (data: RegisterFormData) => {
    console.log(data);
    if (
      !data.first_name ||
      !data.last_name ||
      !data.email ||
      !data.phone ||
      !data.address ||
      !data.password ||
      !data.confirmPassword
    ) {
      setMessage("Please fill all required fields!");
      setTimeout(function () {
        setMessage("");
      }, 3000);
    } else {
      if (data.password !== data.confirmPassword) {
        setMessage("Password and confirm password are different!");
        setTimeout(function () {
          setMessage("");
        }, 3000);
      }
      //   else {
      //     Signup(formData).then((res) => {
      //       setMessage(res.data.msg);
      //       setTimeout(function () {
      //         setMessage("");
      //       }, 3000);
      //     });
    }
  };

  return (
    <div className="signup">
      <form className="signup-content" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="signup-text">Sign Up</h2>

        <label>First Name</label>
        <input
          type="text"
          {...register("first_name")}
          required
          placeholder="John"
        />

        <label>Last Name</label>
        <input
          type="text"
          {...register("last_name")}
          required
          placeholder="Doe"
        />

        <label>Email</label>
        <input
          className={`${errors.email ? "errorInput" : ""}`}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^@]+@[^@]+\.[^@]+$/,
              message: "Invalid email format",
            },
          })}
          placeholder="you@example.com"
        />

        <label>Address</label>
        <textarea rows={3}  {...register("address")} />

        <label>Phone Number</label>
        <input
          type="tel"
          {...register("phone")}
          pattern="^[0-9]{10,15}$"
          required
        />

        <label>Password</label>
        <input
          type="password"
          {...register("password")}
          placeholder="Enter your password"
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm your password"
          required
        />

        <button type="submit" className="btn-outline">
          Sign Up
        </button>

        <div className="message-container">
          {message && <p className="message">{message}</p>}
        </div>

        <div className="already-have-account">
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
