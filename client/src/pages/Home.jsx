import {  useCallback, useEffect, useState } from "react";

import {useNavigate} from "react-router-dom"
import { useSocket } from "../context/SocketContext";


function Home() {
const navigate = useNavigate();
const socket = useSocket();
const[email , setemailId] = useState(null);
const[room , setroomId] = useState(null);


const handleUserJoinRoom  = useCallback(()=>{
    console.log(email , room);
    socket.emit("user:join" , { email, room});



} , [email, room, socket]);


const handleJoinedRoom = useCallback((data) =>{
  const {email , room} = data;
  console.log("joined sucessfully : " , email , "and romm" , room);
  navigate(`/room/${room}`);

},[navigate])


useEffect(()=>{

    socket.on("user:join" , handleJoinedRoom);



    return () =>{
    socket.off("user:join" , handleJoinedRoom);
      
    }


},[handleJoinedRoom, socket]);


  return (
    <div>
          <div className='conatiner'>
        <div className='box'>
          <h1>Lobby</h1>
          <input  onChange={(e)=>setemailId(e.target.value)} type="email"  placeholder='Enter a Eamil' />
          <input  onChange={(e)=> setroomId(e.target.value)} type="text" placeholder='enter romm id' />
          <button onClick={()=>handleUserJoinRoom()}>Connect</button>
        </div>
        
      </div> 
    </div>
  )
}



export default Home;
