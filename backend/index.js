import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";

dotenv.config({
    path:".env"
})
databaseConnection();
const app = express(); 

// middlewares
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    // allow both frontend dev origins (CRA default 3000 and alternate 3001)
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}
app.use(cors(corsOptions));

// serve uploaded files
import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'uploads')));

// api
app.use("/api/v1/user",userRoute);
app.use("/api/v1/tweet", tweetRoute);
 

app.listen(process.env.PORT,() => {
    console.log(`Server listen at port ${process.env.PORT}`);
})

// error handler (must be after routes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.message) {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
});