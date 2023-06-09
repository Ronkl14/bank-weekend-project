import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import router from "./routes/router.js";
import cors from "cors";

import connectDB from "./config/db.js";

dotenv.config({ path: "./config/config.env" });

// connectDB();

const app = express();

app.use(cors());

app.use(express.json());

if (process.env_NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => res.json({ message: "products" }));

app.use("/api/v1", router);

const PORT = process.env.PORT || 5000;

// app.listen(
//   PORT,
//   console.log(`Server running in ${process.env.NODE_ENV}
// mode on port ${PORT}`)
// );

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
