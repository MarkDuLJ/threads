import { currentUser } from "@clerk/nextjs";

import ThreadCard from "@/components/cards/ThreadCard"
import { fetchPostById, fetchPosts } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

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
        </section>
        
    )
}

export default Page