import React from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import { useEffect } from 'react';
import { io } from "socket.io-client";
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []); //when state value changes the socket is getting changed(component is rerendering) so useMemo so that only on refresh or rerun socket may change

  const [message, setMessage] = useState("")
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket Connected", socket.id);
      
    })

    socket.on("welcome", (s) => {
      console.log(s);
      
    })

    return () => {
      socket.disconnect()
    }
    
  },[])

   
  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit("message", message)
    setMessage("")
    
  };


  return (
 
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
       Welcome To my ChatBot
      </Typography>
      <Box component="form" noValidate autoComplete="off">
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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </Box>
    </Container>
  );


  
}

export default App
