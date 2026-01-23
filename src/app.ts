import express from "express";
import { postRouter } from "./moules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentRouter } from "./moules/comment/comment.router";
import errorHandler from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";

const app = express();


app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000", //client side url
    credentials: true
}))


app.all("/api/auth/*splat", toNodeHandler(auth));


app.use(express.json())

app.use("/posts", postRouter);
app.use("/comments", commentRouter);





app.get("/", (req, res)=>{
    res.send("Hello, World!")
});

app.use(notFound)


app.use(errorHandler);




export default app;