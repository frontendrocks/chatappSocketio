const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
app.use(cors());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",  // use specific origin for production
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

async function getUnsplashImage(term) {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        Authorization: "Client-ID dfdf"
      },
      params: {
        query: term,
        per_page: 1
      }
    });

    const results = response.data.results;
    if (results.length > 0) {
      return results[0].urls.regular;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Unsplash API Error:', error.message);
    return null;
  }
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('send_message', async (data) => {
    console.log(data);
    
    console.log('Message received:', data);

    // Step 1: Broadcast the message to all other clients
    socket.broadcast.emit('receive_message', data);

    // Step 2: Check API if the message matches a prompt
    const imageUrl = await getUnsplashImage(data.message);
    if (imageUrl) {
      io.emit('image_message', {
        user: 'Bot',
        prompt: data.message,
        url: imageUrl
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});



server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
