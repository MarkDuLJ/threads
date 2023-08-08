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