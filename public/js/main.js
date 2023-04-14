const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// get URL params - username and room
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// user join room
socket.emit('joinRoom', { username, room });

// get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);
  if(message.text == "is typing...") {
    document.getElementById('not2').textContent = `${message.username} is typing...`
  }

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  msg = msg.trim();
  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  document.getElementById('not2').textContent = ``
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  if(message.username == username) {
    div.style.background = "#9cb7dd"
    div.style.marginLeft = "200px"
  }else {
    div.style.marginRight = "200px"
  }

  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);

  let file = document.getElementById('my_file').files[0]
  console.log(file)
  if(file != null) {
    message.file = file
    let url = file
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.width = "200px"
    img.height = "200px"//URL.createObjectURL(new Blob([file]))
    console.log(url)
    const f = document.createElement('p')
    f.classList.add('meta')
    f.innerHTML += `<img src="${img.src}" style="width:200px;height:200px"/>`
    div.append(f)
  }
  
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//user leaves chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  window.location = '../index.html';
});

var typing=false;
var timeout=undefined;

function typingTimeout(){
  typing=false
  //socket.emit('typing', {user:user, typing:false})
}


document.getElementById('msg').addEventListener('click', () => {
   // if(e.which!=13){
      typing=true
      socket.emit('typing', {user:username, typing:true})
      clearTimeout(timeout)
      timeout=setTimeout(typingTimeout, 3000)
  //  }else{
    //  clearTimeout(timeout)
    //  typingTimeout()
      //sendMessage() function will be called once the user hits enter
    //  sendMessage()
 //   }
  });
  

  //code explained later
  socket.on('display', (data)=>{
    if(data.typing==true){
      console.log(` is typing...`)
      document.getElementById('not2').text(`is typing...`)
      console.log(document.getElementById('not2').value)
      outputMessage(data)
    }
     // $('.typing').text(`${data.username} is typing...`)
   // else
    //  $('.typing').text("")
  });


  socket.on('notification', (message) => {
    console.log(message);
    //outputMessage(message);
    if(message.text == "is typing...") {
      document.getElementById('not2').textContent = `${message.username} is typing...`
    }
  });

  
