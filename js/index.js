

$(document).ready(function() {
		"use strict";

		// UTILITY
		function getRandomInt(min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
		}
		// END UTILITY

		// COMMANDS
		function clear() {
				terminal.text("");
		}

		function help() {
				terminal.append("Available commands : \n");
				commands.forEach(function(e) {
					terminal.append(e.name + '\n');
				});
		}

		function echo(args) {
				var str = args.join(" ");
				terminal.append(str + "\n");
		}

		function fortune() {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', 'https://cdn.rawgit.com/bmc/fortunes/master/fortunes', false);
				xhr.send(null);

				if (xhr.status === 200) {
						var fortunes = xhr.responseText.split("%");
						var fortune = fortunes[getRandomInt(0, fortunes.length)].trim();
						terminal.append(fortune + "\n");
				}
		}
		// END COMMANDS

		var title = $(".title");
		var terminal = $(".terminal");
		var prompt = "➜";
		var path = "~";

		var close = $(".close");
		var minimize = $(".minimize");
		var maximize = $(".maximize");
		var message = $(".message");
		var terminalWindow = $(".window");
		var button = $(".openbtn");
		var handle = $(".handle");
		var dockItem = $(".dock-item")
		var closeChecker = false;

		// Declaring home variables
		var home = $(".home")
		var closeHome = $(".close-home");
		var minimizeHome = $(".minimize-home");
		var maximizeHome = $(".maximize-home");
		var homeWindow = $(".window-home");
		var handleHome = $(".handle-home");
		var dockHome = $(".dock-home");
		var titleHome = $(".title-home");
		var closeCheckerHome = true;

		// Declaring about variable
		var about = $(".about")
		var closeAbout = $(".close-about");
		var minimizeAbout = $(".minimize-about");
		var maximizeAbout = $(".maximize-about");
		var aboutWindow = $(".window-about");
		var handleAbout = $(".handle-about");
		var homeAbout = $(".home-about");
		var titleAbout = $(".title-about");
		var closeCheckerAbout = true;
		// dockItem.addClass("item-selected");

		close.bind("click", function()
		{
			clear();
			closeChecker = true;
			terminal.append("Welcome\n"+prompt+path);
			terminalWindow.addClass("item-minimized");
			dockItem.removeClass("item-selected");
		});

		closeHome.bind("click", function()
		{
			clear();
			closeCheckerHome = true;
			homeWindow.addClass("item-minimized");
			dockHome.removeClass("item-selected");
		});

		closeAbout.bind("click", function()
		{
			clear();
			closeCheckerAbout = true;
			aboutWindow.addClass("item-minimized");
			homeAbout.removeClass("item-selected");
		});

		maximize.bind("click", function()
		{
			terminal.css("display", "block");
		});

		maximizeHome.bind("click", function()
		{
			home.css("display", "block");
		});

		maximizeAbout.bind("click", function()
		{
			about.css("display", "block");
		});

		minimize.bind("click", function()
		{
			terminalWindow.addClass("item-minimized");
			dockItem.addClass("item-selected");
		});

		minimizeHome.bind("click", function()
		{
			homeWindow.addClass("item-minimized");
			dockHome.addClass("item-selected");
		});

		minimizeAbout.bind("click", function()
		{
			aboutWindow.addClass("item-minimized");
			homeAbout.addClass("item-selected");
		});

		button.bind("click", function()
		{
			message.css("display", "none");
			terminalWindow.css("display", "block");
			terminal.css("display", "block");
			terminal.append("Welcome\n"+prompt+path);
		});

		dockItem.bind("click", function()
		{
			terminalWindow.toggleClass("item-minimized");
			if(closeChecker)
				terminalWindow.removeClass("item-closed");
			dockItem.addClass("item-selected");
			closeChecker = false;
		});

		dockHome.bind("click", function()
		{
			homeWindow.toggleClass("item-minimized");
			if(closeCheckerHome)
				homeWindow.removeClass("item-closed");
			dockHome.addClass("item-selected");
			closeCheckerHome = false;
		});

		homeAbout.bind("click", function()
		{
			aboutWindow.toggleClass("item-minimized");
			if(closeCheckerAbout)
				aboutWindow.removeClass("item-closed");
			homeAbout.addClass("item-selected");
			closeCheckerAbout = false;
		});

		var commandHistory = [];
		var historyIndex = 0;

		var command = "";
		var commands = [{
						"name": "clear",
						"function": clear
				}, {
						"name": "echo",
						"function": echo
				}, {
						"name": "fortune",
						"function": fortune
				}, {
						"name": "help",
						"function": help
				}];

function processCommand() {
		var isValid = false;

		// Create args list by splitting the command
		// by space characters and then shift off the
		// actual command.

		var args = command.split(" ");
		var cmd = args[0];
		args.shift();

		// Iterate through the available commands to find a match.
		// Then call that command and pass in any arguments.
		for (var i = 0; i < commands.length; i++) {
				if (cmd === commands[i].name) {
						commands[i].function(args);
						isValid = true;
						break;
				}
		}

		// No match was found...
		if (!isValid) {
				terminal.append("OpenTerm: command not found: " + command + "\n");
		}

		// Add to command history and clean up.
		commandHistory.push(command);
		historyIndex = commandHistory.length;
		command = "";
}

function displayPrompt() {
		terminal.append("<span class=\"prompt\">" + prompt + "</span> ");
		terminal.append("<span class=\"path\">" + path + "</span> ");
}

// Delete n number of characters from the end of our output
function erase(n) {
		command = command.slice(0, -n);
		terminal.html(terminal.html().slice(0, -n));
}

function clearCommand() {
		if (command.length > 0) {
				erase(command.length);
		}
}

function appendCommand(str) {
		terminal.append(str);
		command += str;
}

/*
	//	Keypress doesn't catch special keys,
	//	so we catch the backspace here and
	//	prevent it from navigating to the previous
	//	page. We also handle arrow keys for command history.
	*/

$(document).keydown(function(e) {
		e = e || window.event;
		var keyCode = typeof e.which === "number" ? e.which : e.keyCode;

		// BACKSPACE
		if (keyCode === 8 && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
				e.preventDefault();
				if (command !== "") {
						erase(1);
				}
		}

		// UP or DOWN
		if (keyCode === 38 || keyCode === 40) {
				// Move up or down the history
				if (keyCode === 38) {
						// UP
						historyIndex--;
						if (historyIndex < 0) {
								historyIndex++;
						}
				} else if (keyCode === 40) {
						// DOWN
						historyIndex++;
						if (historyIndex > commandHistory.length - 1) {
								historyIndex--;
						}
				}

				// Get command
				var cmd = commandHistory[historyIndex];
				if (cmd !== undefined) {
						clearCommand();
						appendCommand(cmd);
				}
		}
});

$(document).keypress(function(e) {
		// Make sure we get the right event
		e = e || window.event;
		var keyCode = typeof e.which === "number" ? e.which : e.keyCode;

		// Which key was pressed?
		switch (keyCode) {
				// ENTER
				case 13:
						{
								terminal.append("\n");

								processCommand();
								displayPrompt();
								break;
						}
				default:
						{
								appendCommand(String.fromCharCode(keyCode));
						}
		}
});

// Set the window title
title.text("Open Code Terminal");
titleHome.text("Home");

// Get the date for our fake last-login
var date = new Date().toString(); date = date.substr(0, date.indexOf("GMT") - 1);

// Display last-login and promt
terminal.append("Welcome\n"); displayPrompt();
});
