const http = require('http');
const socketIO = require('socket.io');
const { ExpressPeerServer } = require('peer');
const app = require('./app');
const Room = require('./models/Room');
const Message = require('./models/Message');
const Filter = require('bad-words');

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

const filter = new Filter();

io.on('connection', async socket => {
  const id = socket.handshake.query.id;

  socket.on('video-join', async (meetingId, userId) => {
    console.log('JOINED');

    socket.join(meetingId);
    socket.to(meetingId).broadcast.emit('user-connected', userId);

    socket.on('video-disconnected', () => {
      socket.to(meetingId).broadcast.emit('user-disconnected', userId);
    });

    socket.on('disconnect', () => {
      socket.to(meetingId).broadcast.emit('user-disconnected', userId);
    });
  });

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

  socket.on('render-messages-request', async ({ roomId }) => {
    const messages = await Message.find({
      room: roomId,
    }).populate(['from', 'to']);

    socket.emit('render-messages-response', {
      messages,
    });
  });

  socket.on('send-message', async ({ text, roomId }) => {
    const cleanMessage = filter.clean(text);

    const createdMessage = await Message.create({
      from: id,
      body: cleanMessage,
      room: roomId,
    });

    const message = await createdMessage.populate(['from']).execPopulate();

    io.in(roomId).emit('receive-message', { message, roomId });
  });
});

module.exports = server;
