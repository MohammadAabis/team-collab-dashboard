import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import type { RegisterFormData as LoginData } from "../../types/auth";
import { LoginUser } from "../../api/auth.api";
import { AuthContext } from "../../context/AuthContext";

import "./login.css";

const Login = () => {
  const auth = useContext(AuthContext)
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit = (data: LoginData) => {
    console.log(data);
    if (!data.email || !data.password) {
      setMessage("Please fill all required fields!");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } else {
      LoginUser(data.email, data.password)
        .then((resp) => {
          setMessage(resp.message);
          setTimeout(() => {
            setMessage("");
          }, 3000);

          auth.login(resp.accessToken, resp.user);

          navigate("/dashboard")
        })
        .catch((err) => {
          setMessage(err.response.data.message);
          setTimeout(() => {
            setMessage("");
          }, 3000);
        });
    }
  };

  return (
    <div className="login">
      <form className="login-content" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="login-text">Login</h2>

        <label>Email</label>
        <input
          className={`${errors.email ? "input-error" : ""}`}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^@]+@[^@]+\.[^@]+$/,
              message: "Invalid email format",
            },
          })}
          placeholder="you@example.com"
        />
        {errors.email && <p className="error-text">{errors.email.message}</p>}

        <label>Password</label>
        <input
          className={`${errors.password ? "input-error" : ""}`}
          type="password"
          {...register("password", {
            required: "Password is required",
          })}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="error-text">{errors.password.message}</p>
        )}

        <div className="remember-area col-12 col-md-10">
          <input type="checkbox" className="signin-checkbox" />
          <p className="remember-me">Remember me</p>
        </div>

        <button type="submit" className="btn-outline">
          Login
        </button>

        <div className="message-container">
          {message && <p className="message">{message}</p>}
        </div>

        <div className="not-member">
          <p>
            Not a member?
            <a href="register">&nbsp;Sign up</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
