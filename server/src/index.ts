import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db"

// connect to MongoDB
connectDB();


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Basic Route
app.get('/', (req, res) => {
  res.send('Server is running smoothly');
});


app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})