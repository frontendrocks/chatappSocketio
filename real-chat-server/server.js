const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",  // use specific origin for production
    methods: ["GET", "POST"]
  }
});

const upload = multer({ dest: 'uploads/' });

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('send_message', (data) => {
    console.log(data);
    socket.broadcast.emit('receive_message', data);
  });
  socket.on('file-upload', (fileData) => {
    const buffer = Buffer.from(fileData.data);
    const filePath = path.join(__dirname, 'uploads', fileData.name);

    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error('File save error:', err);
        socket.emit('upload-error', 'Failed to save file');
      } else {
        console.log(`File ${fileData.name} saved`);
        socket.emit('upload-success', fileData.name);
        socket.broadcast.emit('new-file', {
        name: fileData.name,
        url: `http://localhost:3000/uploads/${fileData.name}`,
      });
      }
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});





server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
