import { Request, Response } from "express"
import { CommentService } from "./comment.service"

const createComment= async(req:Request, res:Response)=>{
    try{
      const user = req.user;
      req.body.authorId = user?.id;
    const result = await CommentService.createComment(req.body)
    res.status(201).json(result)
    }catch(err){
      res.status(400).json({
        error: "Comment creation failed",
        details: err
      })
    }
    
}


const getCommentById= async(req:Request, res:Response)=>{
    try{

    const {commentId} = req.params as {commentId:string};
    const result = await CommentService.getCommentById(commentId)
    res.status(200).json(result)


    }catch(err){
      res.status(400).json({
        error: "Comment fatched failed",
        details: err
      })
    }
    
}


const getCommentsByAuthor= async(req:Request, res:Response)=>{
    try{

    const {authorId} = req.params as {authorId:string};
    const result = await CommentService.getCommentsByAuthor(authorId)
    res.status(200).json(result)


    }catch(err){
      res.status(400).json({
        error: "Comment fatched failed",
        details: err
      })
    }
    
}


const deleteComment= async(req:Request, res:Response)=>{
    try{
      const user = req.user;
      const {commentId} = req.params as {commentId:string};
      
      const result = await CommentService.deleteComment(commentId as string, user?.id as string)
    res.status(200).json(result)


    }catch(err){
      res.status(400).json({
        error: "Comment deletion failed",
        details: err
      })
    }
    
}

const updateComment= async(req:Request, res:Response)=>{
    try{
      const user = req.user;
      const {commentId} = req.params as {commentId:string};
      
      const result = await CommentService.updateComment(commentId as string, req.body, user?.id as string)
    res.status(200).json(result)


    }catch(err){
      res.status(400).json({
        error: "Comment update failed",
        details: err
      })
    }
    
}


const moderateCommnet= async(req:Request, res:Response)=>{
    try{
      const {commentId} = req.params as {commentId:string};


      const result = await CommentService.moderateCommnet(commentId as string, req.body)
    res.status(200).json(result)


    }catch(err){
      const errorMessage = (err instanceof Error )? err.message : "Comment update failed"
      res.status(400).json({
        error: errorMessage,
        details: err
      })
    }
    
}


export const CommentController = {
    createComment,
    getCommentById,
    getCommentsByAuthor,
    deleteComment,
    updateComment,
    moderateCommnet
}