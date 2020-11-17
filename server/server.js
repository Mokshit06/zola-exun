const http = require('http');
const socketIO = require('socket.io');
const { ExpressPeerServer } = require('peer');
const app = require('./app');
const Room = require('./models/Room');

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use('/peerjs', peerServer);

io.on('connection', async socket => {
  const id = socket.handshake.query.id;

  socket.on('send-rooms', async () => {
    const rooms = await Room.find({
      users: id,
    }).populate({
      path: 'users',
    });

    socket.emit('get-rooms', {
      rooms,
    });
  });

  socket.on('join', async ({ roomId, users }) => {
    let room = await Room.findById(roomId);

    if (!room) {
      room = await Room.create({ users });

      const rooms = await Room.find({
        users: id,
      }).populate({
        path: 'users',
      });

      socket.emit('get-rooms', {
        rooms,
      });
    }

    socket.join(room.id);
  });
});

module.exports = server;
