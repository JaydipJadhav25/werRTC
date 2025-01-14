import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext"
import "./room.css"


function Room() {
const [remotuser , setRemotuser] = useState(null);
const[mystream , setmystream] = useState(null);
  const socket = useSocket();


  const handleNewUserJoin = useCallback((data) =>{
    const {email , id} = data;
    console.log("new user joined : " , email , id);
      setRemotuser(id);
  } , [setRemotuser])


const handleCallUser = useCallback(async()=>{

    const stream = await navigator.mediaDevices.getUserMedia({
      audio : true,
      video : true ,
    });

    //set into mystream
    console.log("my stream : " , stream);
    setmystream(stream);

  },[])



  useEffect(()=>{
    
    socket.on("user:joined" , handleNewUserJoin)
    


    return () =>{
      socket.off("user:joined" , handleNewUserJoin)
    }

  },[handleNewUserJoin, socket])



  return (
    <div className="room">
      <h1>Room</h1>
      <h2>{remotuser ? `Connected ${remotuser}`  : "User Is Not Connected"}</h2>
      <button onClick={()=>handleCallUser()} >Call</button>
    </div>
  )
}

export default Room