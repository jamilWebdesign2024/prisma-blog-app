import { Request, Response } from "express";
// import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { PostService } from "./post.service";
import { UserRole } from "../../middlewares/auth";

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

const getAllPost = async(req: Request, res:Response)=>{
  try{
      const {search} = req.query
      const searchString = typeof search === 'string' ? search : undefined
      
      const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

      // true or false
      const isFeatured = req.query.isFeatured 
      ? req.query.isFeatured === 'true' 
      ? true : req.query.isFeatured === 'false' 
      ? false : undefined
      : undefined

      const status = req.query.status as PostStatus | undefined
      
      const authorId = req.query.authorId as string | undefined

    
      
      const {page, limit, skip, sortBy, sortOrder} = paginationSortingHelper(req.query)

     
      

      const result = await PostService.getAllPost({search:searchString, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder})
      
      res.status(200).json(result)
  }catch(err){
      res.status(400).json({
        error: "Post creation failed",
        details: err
      })
    }
}

const getPostById=async(req:Request, res:Response)=>{
    try{
      const { postId } = req.params as { postId: string };
      if(!postId){
        throw new Error("Post ID is required");
      }
      
      const result =await PostService.getPostById(postId);
      res.status(200).json(result)
  }catch(err){
      res.status(400).json({
        error: "Post creation failed",
        details: err
      })
    }
}


const getMyPosts=async(req:Request, res:Response)=>{
    try{
      const user = req.user as {id:string};
        
      if(!user){
        throw new Error("You are Unauthorized");
      }
     

      const result =await PostService.getMyPosts(user?.id);
        console.log("User data:", user);
      res.status(200).json(result)
  }catch(err){
    console.log(err)
      res.status(400).json({
        error: "Post fetched failed",
        details: err
      })
    }
}


const updatePost=async(req:Request, res:Response)=>{
    try{
      const user = req.user;
      if(!user){
        throw new Error("You are Unauthorized");
      }
     
      const {postId} = req.params as {postId:string};

      const isAdmin = user.role === UserRole.ADMIN;
           

      const result =await PostService.updatePost(postId, req.body, user.id, isAdmin );
       
      res.status(200).json(result)
  }catch(err){
      const errorMessage = (err instanceof Error )? err.message : "Post update failed"
      res.status(400).json({
        error: errorMessage,
        details: err
      })
    }
}


const deletePost=async(req:Request, res:Response)=>{
    try{
      const user = req.user;
      if(!user){
        throw new Error("You are Unauthorized");
      }
     
      const {postId} = req.params as {postId:string};

      const isAdmin = user.role === UserRole.ADMIN;
           

      const result =await PostService.deletePost(postId, user.id, isAdmin );
       
      res.status(200).json(result)
  }catch(err){
      const errorMessage = (err instanceof Error )? err.message : "Post delete failed"
      res.status(400).json({
        error: errorMessage,
        details: err
      })
    }
}



export const PostController = {
    createPost,
    getAllPost,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost
}