"use client"

interface Props {
    user:{
        id:string,
        objectId:string,
        username:string,
        name:string,
        bio:string,
        image:string
    },
    btnTitle:string;
}

function AccountProfile({user, btnTitle}){
    return (
        <h3>profile</h3>
    )
}

export default AccountProfile