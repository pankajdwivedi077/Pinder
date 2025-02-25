import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import { createServer } from "http"
import { initializedSocket } from "./socket/socket.server.js";

// routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import messageRoutes from "./routes/messageRoute.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

const httpServer = createServer(app)

const PORT = process.env.PORT || 5000;

initializedSocket(httpServer)

// app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/matches", matchRoutes)
app.use("/api/messages", messageRoutes)

// app.listen(PORT, () => {
//     console.log("Listing on " + PORT);
//     connectDB();
// });

httpServer.listen(PORT, () => {
    console.log("Listing on " + PORT);
    connectDB();
});