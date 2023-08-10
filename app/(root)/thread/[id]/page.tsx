import { currentUser } from "@clerk/nextjs";

import ThreadCard from "@/components/cards/ThreadCard"
import { fetchPostById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/Comment";

async function Page({params}:{params:{id:string}}){
    if(!params.id) return null

    const user = await currentUser()
    if(!user) return null

    const userInfo = await fetchUser(user.id)
    if(!userInfo?.onboarded) redirect("/onboarding")

    const post = await fetchPostById(params.id)
   
    

    return (
        <section className="relative">
            <div>
                <ThreadCard key={post._id} id={post._id} 
            currentUserId={user?.id || ""} 
            parentId={post.parentId} 
            content={post.text} 
            author={post.author}
            community={post.community}
            createdAt={post.createdAt}
            comments={post.children}/>
            </div>

            <div className="mt-7">
                <Comment  threadId={post.id} currentUserImg={user.imageUrl} currentUserId={JSON.stringify(userInfo._id)}/>
            </div>

            <div className="mt-7">
                {post.children.map((post:any)=>(
                    <ThreadCard key={post._id} id={post._id} 
                    currentUserId={user?.id || ""} 
                    parentId={post.parentId} 
                    content={post.text} 
                    author={post.author}
                    community={post.community}
                    createdAt={post.createdAt}
                    comments={post.children}
                    isComment/>
                ))}
            </div>
        </section>
        
    )
}

export default Page