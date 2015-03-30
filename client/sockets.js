var socket = io();

function notify_name(){
  socket.emit('setName',$('name').value || 'Guest');
}
