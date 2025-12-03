import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db"

// import routes
import userRoutes from "./routes/auth.routes"

// connect to MongoDB
connectDB();


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// User routes
app.use("/api/auth", userRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})