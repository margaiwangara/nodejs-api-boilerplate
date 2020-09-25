const axios = require('axios');

function getMessages(socket) {
  axios
    .get('/api/messages')
    .then(({ data }) => {
      socket.emit('messages', data);
    })
    .catch((error) => console.log(error));
}

module.exports = {
  getMessages,
};
