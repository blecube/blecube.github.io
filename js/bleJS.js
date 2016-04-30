var cubeUUID = 'a6c31338-6c07-453e-961a-d8a8a41bf368';
var txUUID = 'a6c32000-6c07-453e-961a-d8a8a41bf368';
var rxUUID = 'a6c32001-6c07-453e-961a-d8a8a41bf368';

var isConnecting = false;
var isConnected = false;

var sInterval;
var sTimeout;
var sServer
var bleService;
var sCharacteristicRX;
var sCharacteristicTX;
var aCharacteristic;

var data;

var chosenGame;

var solution = [];
var solutionA = [];
var solutionB = [];
var solutionC = [];
var solutionD = [];
var cubeData = [];
var testholder;

document.querySelector('#connect').addEventListener('click', connect);
document.querySelector('#disconnect').addEventListener('click', disconnectDevice);
document.querySelector('#foldit').addEventListener('touchstart', function() { displayGame('foldit'); });
document.querySelector('#simon').addEventListener('touchstart', function() { displayGame('simon'); });
//document.querySelector('#left').addEventListener('touchstart', function(e) { move(e, "left"); });
//document.querySelector('#left').addEventListener('touchend', function(e) { stop(e); });
document.querySelector('#randomize').addEventListener('touchstart', function(e) { move(e, "randomize"); });


var cubes = [];
cubes[0] = "images/rng/1.png"
cubes[1] = "images/rng/2.png"
cubes[2] = "images/rng/3.png"
cubes[3] = "images/rng/4.png"
cubes[4] = "images/rng/5.png"
cubes[5] = "images/rng/6.png"
cubes[6] = "images/rng/7.png"
cubes[7] = "images/rng/8.png"
cubes[8] = "images/rng/9.png"
cubes[9] = "images/rng/10.png"


function randomCube() {
	var rng = Math.floor(Math.random()*10);
	var cube = cubes[rng];
		
	document.getElementById("cubeImage").src = cube;


	switch(rng) {
		case 0:
			solutionA = [0, 0, 0, 1, 0, 1];
			break;
		case 1:
			solutionA = [0, 0, 0, 1, 0, 1];
			break;
		case 2:
			solutionA = [0, 0, 0, 0, 1, 0];
			break;
		case 3:
			solutionA =[0, 0, 0, 1, 1, 1];
			break;
		case 4:
			solutionA = [3, 1, 6, 2, 4, 5]; //!
			solutionB = [3, 4, 1, 6, 2, 5]; //!
			solutionC = [3, 2, 4, 1, 6, 5]; //!
			solutionD = [3, 6, 2, 4, 1, 5]; //!
			break;
		case 5:
			solutionA = [5, 3, 1, 5, 2, 6]; //!
			solutionB = [5, 2, 3, 1, 5, 6]; //!
			solutionC = [5, 5, 2, 3, 1, 6]; //!
			solutionD = [5, 1, 5, 2, 3, 6]; //!
			break;
		case 6:
			solutionA = [2, 6, 1, 3, 6, 5]; //!
			solutionB = [2, 6, 6, 1, 3, 5]; //!
			solutionC = [2, 3, 6, 6, 1, 5]; //!
			solutionD = [2, 1, 3, 6, 6, 5]; //!
			break;
		case 7:
			solutionA = [2, 4, 5, 1, 5, 3]; //!
			solutionB = [2, 5, 4, 5, 1, 3]; //!
			solutionC = [2, 1, 5, 4, 5, 3]; //!
			solutionD = [2, 5, 1, 5, 4, 3]; //!
			break;
		case 8:
			solutionA = [5, 1, 6, 3, 4, 2]; //!
			solutionB = [5, 4, 1, 6, 3, 2]; //!
			solutionC = [5, 3, 4, 1, 6, 2]; //!
			solutionD = [5, 6, 3, 4, 1, 2]; //!
			break;
		case 9:
			solutionA = [3, 5, 4, 2, 1, 6]; //!
			solutionB = [3, 1, 5, 4, 2, 6]; //!
			solutionC = [3, 2, 1, 5, 4, 6]; //!
			solutionD = [3, 4, 2, 1, 5, 6]; //!
			
			break;				
		
		
	}
	log('' + solutionA);
}

//Function for checking whether the provided answer is correct or not.
function solver() {
	let counter = 0;
	
	//Since there's four different possible solutions, we do a sample to find out which the user has provided.
	switch(solutionA[1]) {
		case cubeData[1]:
			solution = solutionA;
			break;
		
		case cubeData[2]:
			solution = solutionB;
			break;
			
		case cubeData[3]:
			solution = solutionC;
			break;
			
		case cubeData[4]:
			solution = solutionD;
			break;
	
	}
	
	//Here we loop through the solution and cross reference is with the cubeData.
	for(let m = 0; m < solution.length; m++) {
		if(cubeData[m] == solution[m]) { //Check if the light on the cube is the correct one.
			counter += 1;
			log(counter);
		}
	}
	
	//If the loop reached 6 successful iteration, the user has won. Display winning image.
	if (counter == 6) {
		log('win');
		document.getElementById("cubeImage").src = "images/rng/win.png";
		sCharacteristicTX.writeValue(new Uint8Array([0, 0, 0, 0, 0, 0, 1, 0]));
	}
}
//Function for logging data to the screen. This is used for development.
function log(text) {
	document.querySelector('#log').textContent += '> ' + text + '\n';
}

//Function for clearing the logged data of the above function.
function clearLog() {
	log('clearing log');
	document.querySelector('#log').textContent = "";
}

//Function for keeping track of whether or not the application is connecting to a bluetooth device
function setConnecting(connecting) {
	isConnecting = connecting;
	if (connecting) {
		document.querySelector('#connect').src = "images/connecting.png";
	} else {
		document.querySelector('#connect').src = "images/connect2.png";
	}
}

function displayGame(chosenGame) {
		if(chosenGame == 'foldit') {
			document.querySelector('#button').style.display = "none";	
			document.querySelector('#simonGame').style.display = "none";
			document.querySelector('#folditGame').style.display = "flex";
			document.querySelector('#chooseGame').style.display = "none";						
		} else if (chosenGame == 'simon') {												//Generate a random unfolded cube when a bluetooth device is connected
			document.querySelector('#button').style.display = "none";	
			document.querySelector('#simonGame').style.display = "flex";
			document.querySelector('#folditGame').style.display = "none";
			document.querySelector('#chooseGame').style.display = "none";	
		} else {
			randomCube(); 
			document.querySelector('#button').style.display = "none";
			document.querySelector('#folditGame').style.display = "none";
			document.querySelector('#simonGame').style.display = "none";
			document.querySelector('#chooseGame').style.display = "flex";
		}
}

//Function for keeping track of whether or not the application is connected to a bluetooth device
function setConnected(connected) {
	isConnected = connected;
	if (connected) {			
		document.querySelector('#button').style.display = "none";
		document.querySelector('#folditGame').style.display = "none";
		document.querySelector('#simonGame').style.display = "none";
		document.querySelector('#chooseGame').style.display = "flex";
		
		//Initiate a timer and show count down on screen
		sTimeout = 1000;
		document.querySelector('#timeout').textContent = sTimeout;
		sInterval = setInterval(function() {
			sTimeout -= 1;
			
			//If timer reaches zero, disconnect device.
			if (sTimeout <= 0) {
				setConnected(false);
				clearInterval(sInterval);
			} else {
				document.querySelector('#timeout').textContent = sTimeout;
			}
		}, 1000);
	} else {
		document.querySelector('#button').style.display = "flex";
		document.querySelector('#chooseGame').style.display = "none";
		document.querySelector('#simon').style.display = "none";
		document.querySelector('#foldit').style.display = "none";
		
		//Disconnect from bluetooth server.
		sServer.disconnect();
	}
}
	
//Function for connecting to bluetooth device. This function calls when user presses "Connect"
function connect() {
	'use strict';

	//Check whether or not the browser supports web bluetooth
	if (!navigator.bluetooth) {
		log('Web Bluetooth API is not available.\n' +
			'Please make sure the Web Bluetooth flag is enabled.');
		return;
	}

	//Log that we're connecting if we are
	if (isConnecting) {
		log('Connecting. Please wait.');
		return;
	}
	
	//Requesting bluetooth device with specified UUID
	log('Requesting Bluetooth Device...');
	setConnecting(true);
	navigator.bluetooth.requestDevice({
		filters: [
		{services:[cubeUUID]},
		{services:[txUUID]}
		]
	})
	.then(device => device.connectGATT())
	.then(server => {
		log('Got server');
		sServer = server;
		return server.getPrimaryService(cubeUUID);
	})
	.then(service => {
		log('Got service');
		bleService = service;
		return service.getCharacteristic(rxUUID)
	})	
		
	.then(characteristic => {
		sCharacteristicRX = characteristic;
		setConnecting(false);
		setConnected(true);
		log('>! Got characteristic');	
		return characteristic.startNotifications();
	})
	.then(() => {
		log('getting TX-char');
		return bleService.getCharacteristic(txUUID)
	})
	.then(characteristic => {
		sCharacteristicTX = characteristic;
		log('>! Got characteristic');
	})
	.then(() => {
		log('Connection Established');
		sCharacteristicTX.writeValue(new Uint8Array([solutionA[0], 0, 0, 0, 0, 0, 0, 1]));
		sCharacteristicRX.addEventListener('characteristicvaluechanged', handleNotifyCubeSolution);
	})
	.catch(error => {
		setConnecting(false);
		log(error);
	});
}

/*
function move(event, direction) {
	try {
		switch (direction) {
		case "clear":
			
			break;
		case "randomize":
			log("Randomizing cube");
			randomCube();
			writeValue();
			break;
		}
		event.preventDefault();
	} catch (error) {
		setConnected(false);
		log(error);
	}
}
*/
function writeValue() {
	sCharacteristicTX.writeValue(new Uint8Array([solutionA[0], 0, 0, 0, 0, 0, 0, 1]));
}

function handleNotifyCubeSolution(event) {
	let value = event.target.value;
	value = value.buffer ? value : new DataView(value);
	cubeData[0] = value.getUint8(0);
	cubeData[1] = value.getUint8(1);
	cubeData[2] = value.getUint8(2);
	cubeData[3] = value.getUint8(3);
	cubeData[4] = value.getUint8(4);
	cubeData[5] = value.getUint8(5);
	testholder = value.getUint8(6);		//Ekstra
	log('Data fra kube: ' + cubeData[0] + ', ' + cubeData[1] + ', ' + cubeData[2] + ', ' + cubeData[3] + ', ' + cubeData[4] + ', ' + cubeData[5]);
	log(testholder);
	
	switch(testholder) {
		case 0:
			log('cubedata: ' + cubeData);
			log('solution: ' + solutionA);
			solver();
			break;
		case 1:
			randomCube();
			writeValue();
			break;
		case 2:

			break;
	}
		
	
}
function stop(event) {
	log("stop(" + event + ")");
	try {
		log("Sender nullere")
		sCharacteristicTX.writeValue(new Uint8Array([0, 0, 0, 0, 0, 0]));

		event.preventDefault();
	} catch (error) {
		log(error);
	}
	if(sCharacteristicRX) {
		sCharacteristicRX.stopNotifications().then(() => {
			sCharacteristicRX.removeEventListener('characteristicvaluechanged', handleCubeSolution);
		});
	}
}

function disconnectDevice(){
	if(sCharacteristicRX) {
		sCharacteristicRX.stopNotifications().then(() => {
			sCharacteristicRX.removeEventListener('characteristicvaluechanged', handleCubeSolution);
		});
	}
	document.querySelector('#button').style.display = "flex";
	document.querySelector('#chooseGame').style.display = "none";
	document.querySelector('#foldit').style.display = "none";
	document.querySelector('#simon').style.display = "none";
	log("Disconnected.");
	clearLog();
	sServer.disconnect();

}	