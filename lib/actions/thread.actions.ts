"use server"

import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

interface Params{
    text:string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createThread({text,author,communityId,path}:Params) {
    connectToDB()

    try {
        const createdThread = await Thread.create({
            text,author,community:null
        })
    
        // update user model, push new thread id into user.threads[]
        await User.findByIdAndUpdate(author,{
            $push:{threads: createdThread._id}
        })
    
        revalidatePath(path)
        
    } catch (error) {
        throw new Error(`creat thread failed, ${error}`)
    }

    
}

export async function fetchPosts(pageNumber=1, pageSize=20) {
    connectToDB()

    // cal how many posts to skip
    const skipAmount = pageSize*(pageNumber-1)

    //fetch the top level posts, which means no parents
    const postsQuery = Thread.find({parentId:{$in:[null, undefined]}})
                        .sort({createdAt:'desc'})
                        .skip(skipAmount)
                        .populate({path:"author", model:User})
                        .populate({
                            path:"children",
                            populate:{
                                path:"author",
                                model:User,
                                select:"_id name parentId image"
                            }
                        })

    const totalPostCount = await Thread.countDocuments({parentId:{$in:[null, undefined]}})

    const posts = await postsQuery.exec()

    const isNext = totalPostCount > skipAmount +posts.length
    
    return {posts,isNext}
}

export async function fetchPostById(id: string){
    connectToDB()

    try {
        const thread = await Thread.findById(id)
        .populate({
            path:"author",
            model:User,
            select:" _id id name image"
        })
        .populate({
            path: "children", // Populate the children field
            populate: [
              {
                path: "author", // Populate the author field within children
                model: User,
                select: "_id id name parentId image", // Select only _id and username fields of the author
              },
              {
                path: "children", // Populate the children field within children
                model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
                populate: {
                  path: "author", // Populate the author field within nested children
                  model: User,
                  select: "_id id name parentId image", // Select only _id and username fields of the author
                },
              },
            ],
          })
        .exec()

          
          return thread
    } catch (error) {
        console.error("error while fetching thread",error)
        throw new Error("unable to fetch thread")
        
    }
}

export async function addCommentToThread(threadId: string, commentText: string, useId: string, path: string){
    connectToDB()

    try {
        const orignalThread = await Thread.findById(threadId)
        if(!orignalThread) throw new Error(`Thread ${threadId} not found`)

        const newComment = new Thread({
            text:commentText,
            author: useId,
            parentId:threadId,
        })

        // save new created comment as a thread
        const savedComment = await newComment.save()
        // update orignal thread to include the new comment
        orignalThread.children.push(savedComment._id)
        // save updated original thread
        await orignalThread.save()

        revalidatePath(path)        
    } catch (error:any) {
        throw new Error("Unable to add comment", error);
  }
    
}
