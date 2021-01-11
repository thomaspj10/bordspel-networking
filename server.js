var net = require('net');

var server = net.createServer(function(socket) {});

function jsonToStr(json) {
	return JSON.stringify(json)
}

function strToJson(str) {
	return JSON.parse(str)
}

users = []

challengeUsers = []
challenge = ""

// Steekspel variables.
player1 = ""
player2 = ""
scorePlayer1 = -1
scorePlayer2 = -1

server.on('connection', function(socket) {
    console.log('A new connection has been established.');
	
    socket.on('data', function(chunk) {
		message = chunk.toString()
		messages = message.split("||")

		for (message of messages) {
			if (message != "") {
				json = strToJson(message.toString())
				type = json.type
				id = json.id
				room = json.room
				
				switch(type) {
					case "handshake": {
						users.push({
							"id": id,
							"room": room,
							"socket": socket
						})
						
						socket.write(jsonToStr({"type": "handshake", "success": true}));
						break
					}
					case "exit": {
						for (user of users) {
							if (user.id == id) {
								users.splice(users.indexOf(user), 1)
							}
						}
			
						break
					}
			
					case "challenge": {
						user1 = data.user1
						user2 = data.user2
						challenge = data.challenge
			
						challengeUsers = [user1, user2]
			
						break
					}
			
					case "steekspel": {
						score = json.score
			
						if (scorePlayer1 == -1) {
							scorePlayer1 = score
			
							player1 = id
						}
						else if (scorePlayer2 == -1) {
							scorePlayer2 = score
							player2 = id
			
							// Calculate who won.
							winner = ""
			
							if (scorePlayer1 > scorePlayer2) {
								winner = player1
							} else if (scorePlayer2 > scorePlayer1) {
								winner = player2
							} else {
								winner = "NONE"
							}
							
							// Send the winner to all the challengeUsers.
							for (user of challengeUsers) {
								user.socket.write(jsonToStr({"type": "steekspel", "winner": winner}))
							}
			
							// Reset the minigame.
							player1 = ""
							player2 = ""
							scorePlayer1 = -1
							scorePlayer2 = -1
						}
			
						break
					}
			
					case "mario": {
						if (json.action == "position") {
							var player = json.player
							var x = json.x
							var y = json.y
							var xOffset = json.xOffset
							var direction = json.direction
							var moving = json.moving
			
							// Send the data to the other player.
							for (user of users) {
								user.socket.write(jsonToStr({"type": "mario", "action": "position", "player": player, "x": x, "y": y, "xOffset": xOffset, "direction": direction, "moving": moving}))
							}
						}
			
						if (json.action == "win") {
							for (user of users) {
								player = json.player
			
								user.socket.write(jsonToStr({"type": "mario", "action": "win", "player": player}))
							}
						}
			
						break
					}
				}
				
				// console.log("Data received from client: " +  message.toString());
			}
		}
    });

    // When the client requests to end the TCP connection with the server, the server
    // ends the connection.
    socket.on('end', function() {
        console.log('Closing connection with the client');
	});
		
	socket.on('error', function(err) {
		console.log("Error: " + err);
    });
});

let port = 8080;
server.listen(port);
console.log(`listening on port ${port}`);
