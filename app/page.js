"use client"

import { signOut, useSession } from "next-auth/react";



export default function Home() {


  const {data: session} = useSession()
  
    return(
      <div>

      <div className=" flex justify-between">

        <h1 className="text-2xl"> Welcome to Dashboard, <span className="text-blue-900">
        {session?.user?.name}
        </span>
        </h1>
      
        <div className="flex gap-1">
        <img src={session?.user?.image} className="w-8 h-8 rounded-md"></img>
        <button onClick={signOut} className="bg-red-500 px-2 rounded-lg">LogOut</button>

        </div>      
      </div>
 






      </div>

  );
}
