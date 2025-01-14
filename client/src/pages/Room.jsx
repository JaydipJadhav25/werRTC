import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext"
import Reactplayer from "react-player";
import peer from "../services/peer";


import "./room.css"


function Room() {
const [remotuser , setRemotuser] = useState(null);
const[mystream , setmystream] = useState(null);
const[remotStream , setRemoteStream] = useState(null)
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
    // console.log("my stream : " , stream);
    const offer = await peer.getOffer();
    //send to user they are persent in room
    socket.emit("user:call" , { to : remotuser , offer});
    setmystream(stream);

  },[remotuser, socket]);


const handleUserIncominCall =useCallback(async(data)=>{
  const {form , offer} = data;
  console.log("user incoming call : " , form , offer);
   setRemotuser(form);

   const stream = await navigator.mediaDevices.getUserMedia({
    audio : true,
    video : true ,
  });

  setmystream(stream);

  //send answer
   const ans = await peer.getAnswer(offer);
   //send to user
   socket.emit("accecpted:call" , { to : form  , ans});

} ,[socket]);



const sendStream =useCallback(async()=>{
  for (const track of mystream.getTracks()) {
    console.log("track:", track);

    //add in peer 
    peer.peer.addTrack(track , mystream);
  }
},[mystream]);

const handleUserCallAccpeted = useCallback(async({form  , ans})=>{
  await peer.setLocalDiscription(ans);
  console.log("call accpted and user answer : " ,form , ans );
    sendStream();
  //send to track 
  // console.log("mystream : " , mystream);




},[sendStream]);



//
const handlNegotiationneeded = useCallback(async()=>{

  console.log("negostation call.................!" );

  const offer = await peer.getOffer();
  socket.emit("peer:nego" , {to : remotuser , offer});


},[remotuser, socket]);

const handleNegoIncoming = useCallback(async({form , offer})=>{

 //set in satet
 const ans = await peer.getAnswer(offer);
 socket.emit("peer:nego:done" , { to : form , ans}); 


},[socket]);

//

const handleNegoDone = useCallback(async( {form  , ans})=>{

  //set 
  await peer.setLocalDiscription(ans);
  console.log("Done negostation.................!" , form , ans);

},[])

  useEffect(()=>{
    
    socket.on("user:joined" , handleNewUserJoin);
    socket.on("incoming:call" , handleUserIncominCall);
    socket.on("accecpted:call" , handleUserCallAccpeted);
    socket.on("peer:nego" , handleNegoIncoming );
    socket.on("peer:nego:done" , handleNegoDone)
    

    return () =>{
      socket.off("user:joined" , handleNewUserJoin);
      socket.off("incoming:call" , handleUserIncominCall);
      socket.off("accecpted:call" , handleUserCallAccpeted);
      socket.off("peer:nego" , handleNegoIncoming );
      socket.off("peer:nego:done" , handleNegoDone);

    }

  },[handleNegoDone, handleNegoIncoming, handleNewUserJoin, handleUserCallAccpeted, handleUserIncominCall, socket])

//
useEffect(()=>{
    peer.peer.addEventListener('negotiationneeded' , handlNegotiationneeded);


return ()=>{
  peer.peer.removeEventListener('negotiationneeded' , handlNegotiationneeded)
}
},[handlNegotiationneeded]);


  //peer event
  useEffect(()=>{
    peer.peer.addEventListener("track" , async(ev)=>{
      const userStream = ev.streams;
      console.log("remote stream incoming : " , userStream);
      setRemoteStream(userStream[0]);
    });
  },[]);

  console.log("myStream : " , mystream);
  console.log("remote stream incoming : " , remotStream , remotuser);


  return (
    <div className="room">
      <h1>Room</h1>
      <h2>{remotuser ? `Connected ${remotuser}`  : "User Is Not Connected"}</h2>
      <button onClick={()=>handleCallUser()} >Call</button>
      <button onClick={()=>sendStream()} >Send-Stream</button>
      {
        mystream &&  <>
        <h1>My Stream</h1>
        <Reactplayer height="100px" width="200px" url={mystream} muted playing />
        </>
      }
        {
        remotStream &&  <>
        <h1>Remote Stream</h1>
        <Reactplayer height="100px" width="200px" url={remotStream} muted playing />
        </>
      }
    </div>
  )
}

export default Room