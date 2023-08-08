import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";



async function Page() {
    const user = await currentUser()
    if(!user) return null

    const userInfo = await fetchUser(user.id)
    console.log(userInfo);

    if(!userInfo?.onboarded) redirect("/onboarding")
    
    return (
        <>
            <h1 className="text-light-3">new thread is coming</h1>
            <PostThread userId=""/>
        </>
    ) 
}

export default Page