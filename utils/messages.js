const moment = require('moment');

function formatMessage(username, text, file) {
  return {
    username,
    text,
    file,
    time: moment().format('   h:mm a')
  };
}

module.exports = formatMessage;
