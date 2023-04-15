const moment = require('moment');

function formatMessage(username, text, file, room) {
  return {
    username,
    text,
    file,
    room,
    time: moment().format('   h:mm a')
  };
}



const messages = []

function addMessage(username, text, file, room) {
  const message = { username, text, file, room, time:moment().format('   h:mm a')};
  messages.push(message);
}

function getRoomMessages(room) {
  return messages.filter(message => message.room === room);
}

module.exports = {
  formatMessage,
  addMessage,
  getRoomMessages
};