/* This discord bot will send an alert message to a specified
** channel when a player is starting a specified game.
**
** How to :
** 1. Make sure nodejs is installed in the system
** 2. Create a folder, put this file in it
** 3. Open a terminal, access the new folder directory
** 4. Run 'npm init -y'
** 5. Run 'npm install discord.js -y'
** 6. Create a discord developer account, click New application
** 7. Go to Bot, click Add Bot, and copy the token
** 8. Inside the same folder, create auth.json file, add the token
** 9. Right click on the desired channel where you want the bot to send the alerts, click Copy ID
** 10.Paste the ID inside the '' on line 33
** 11. Run 'node discord_player_alert.js' on the terminal
*/

const Discord = require('discord.js');
const client = new Discord.Client();

/*create auth.json with the authorization token. 
**To get a token, sign up here https://discord.com/developers/applications
*/
const AUTH = require('./auth.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(AUTH.token);

const GAME_NAME = '';		//change this to the game name
const CHANNEL_ID = ''; 	//right click the channel, copy the ID, and paste it here
let userName, alertChannel;
let playersArray = [];

client.on('presenceUpdate', (_, newPresence) => {

alertChannel = client.channels.cache.get(CHANNEL_ID);

if(newPresence.activities[0] == GAME_NAME) {
	if (userName != newPresence.user.username) {
		userName = newPresence.user.username;
		let gamePlaying = newPresence.activities[0];

		if(playersArray.includes(userName) == false) {
			playersArray.push(userName);

			if(playersArray.length > 1) {
				alertChannel.send(playersArray.toString() + " are playing " + gamePlaying);
			} else if(playersArray.length < 2) {
				alertChannel.send(playersArray.toString() + " is playing " + gamePlaying); 
			}
		}
	}
} else if(newPresence.activities[0] != GAME_NAME &&
	playersArray.includes(newPresence.user.username) == true) {
	userName = newPresence.user.username;
	for(let index = 0; index < playersArray.length; index += 1) {
		if(playersArray[index] == userName) {
			playersArray.splice(index, 1);
			let statusReport = (userName + " left");
			if (playersArray.length > 0) {
				alertChannel.send(statusReport + ", remaining player(s) : " + playersArray);
			} else if (playersArray.length < 1) {
				alertChannel.send(statusReport + ", no player is on");
			}
			userName = null;
		}
	}
}
});
