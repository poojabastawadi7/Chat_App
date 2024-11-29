import React from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import { useEffect } from 'react';
import { io } from "socket.io-client";
import { Container, Typography, TextField, Button, Box, Stack } from '@mui/material';

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000", {
    withCredentials: true,
  }), []); //when state value changes the socket is getting changed(component is rerendering) so useMemo so that only on refresh or rerun socket may change

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("")


  console.log(messages);
  
  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id)
      console.log("Socket Connected", socket.id);
      
    })

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data])
      
    })

    socket.on("welcome", (s) => {
      console.log(s);
      
    })

    return () => {
      socket.disconnect()
    }
    
  },[])

  const roomJoinHandler = (e) => {
    e.preventDefault();
    socket.emit("room-join", roomName);
    
    
    setRoomName("")
    
  };
   
  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit("message", {message, room});
    
    
    setMessage("")
    setRoom("")
    
  };


  return (
 
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
       Welcome To my ChatBot
      </Typography>

      <Box component="form" noValidate autoComplete="off">
        <Typography variant="h6" gutterBottom>
       {socketId}
        </Typography>
        <TextField
          label="Room Name"
          placeholder="Write room name..."
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          sx={{ mb: 3 }}
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={roomJoinHandler}
        >
          Join 
        </Button>
       
      </Box>

      <Box component="form" noValidate autoComplete="off">
        <Typography variant="h6" gutterBottom>
       {socketId}
        </Typography>
        <TextField
          label="Type your message"
          placeholder="Write something..."
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          sx={{ mb: 3 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          label="Room No."
          placeholder="Type room no here..."
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          sx={{ mb: 3 }}
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSendMessage}
        >
          Send
        </Button>
       
      </Box>
      <Stack>
      {messages && messages.map((m, i) => 
      <Typography variant="h6" key={i}  gutterBottom>
       {m}
      </Typography>
      )}
      </Stack>
      
    </Container>
  );


  
}

export default App
