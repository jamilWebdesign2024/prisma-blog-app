import { Request, Response } from "express";
import { PostService } from "./post.service";

const createPost = async(req:Request, res:Response)=>{
    try{
      const user = req.user

      if(!user){
        return res.status(400).json({
        error: "unauthorized",
         })
      }
      
        const result = await PostService.createPost(req.body, user.id as string)
        res.status(201).json(result)
    }catch(err){
      res.status(400).json({
        error: "Post creation failed",
        details: err
      })
    }
    
}


export const PostController = {
    createPost
}