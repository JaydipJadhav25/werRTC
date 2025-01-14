import { useSocket } from './context/SocketContext'
import './App.css'
import { useEffect } from 'react';
import {Routes , Route } from "react-router-dom"
import Home from './pages/Home';
import Room from './pages/Room';


function App() {
 
  return (
    
      <div className='app'>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/room/:roomid' element={<Room/>} />
          </Routes>
      </div>
    
  )
}

export default App
