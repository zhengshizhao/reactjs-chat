// Keep track of which names are used so that there are no duplicates
var userNames = (function () {
  var names = {};

  var claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };
  // find the lowest unused "guest" name and claim it
  var getGuestName = function () {
    var name,
      nextUserId = 1;
     do {
      name = 'User' + nextUserId;
      nextUserId += 1;
     } while (!claim(name));

    return name;
  };

  // serialize claimed names as an array
  var get = function () {
    var res = [];
    for (user in names) {
      res.push(user);
    }
    return res;
  };

  var free = function (name) {
    if (names[name]) {
      delete names[name];
    }
  };
  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
}());

// export function for listening to the socket
module.exports = function (socket) {
  var name = userNames.getGuestName();

  // send the new user their name and a list of inline users
  socket.emit('init', {
    name: name,
    users: userNames.get()
  });

  // notify other clients that a new user is online
  socket.broadcast.emit('user:join', {
    name: name
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
      socket.broadcast.emit('send:message', {
        user: name,
        text: data.text
      });
      socket.emit('send:message', {
        user: 'Me',
        text: data.text
      });
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', {
      name: name
    });
    userNames.free(name);
  });

  // broadcast to other users when a user is typing
  socket.on('user:typing', function() {
    socket.broadcast.emit('user:typing', {typing: name + " is typing..."});
  })
  
};
