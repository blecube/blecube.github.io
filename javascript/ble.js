
		var cubeUUID = 'a6c31338-6c07-453e-961a-d8a8a41bf368';
		var txUUID = 'a6c32000-6c07-453e-961a-d8a8a41bf368';
		var rxUUID = 'a6c32001-6c07-453e-961a-d8a8a41bf368';

		var isConnecting = false;
		var isConnected = false;

		var sInterval;
		var sTimeout;
		var sServer;
		var bleService;
		var sCharacteristicRX;
		var sCharacteristicTX;
		var aCharacteristic;

		var data;

		var chosenGame;
		var lastPage = 0;
		
		var testholder;
		

		//Add Event Listener to all the buttons
		document.querySelector('#connect').addEventListener('click', connect);
		document.querySelector('#disconnect').addEventListener('click', disconnectDevice);
		document.querySelector('#aboutbackbtn').addEventListener('click', function() {displayPage(0)});
		document.querySelector('#aboutbtn').addEventListener('click', function() {displayPage(1)});
		document.querySelector('#backbtn').addEventListener('click', function() {displayPage(2)});
		document.querySelector('#folditChoice').addEventListener('click', function() {displayPage(3)});
		document.querySelector('#lightChoice').addEventListener('click', function() {displayPage(4)});
		//document.querySelector('#randomize').addEventListener('click', randomize);


		
		//Function for displaying the correct page
		function displayPage(lastPage) {
			switch(lastPage) {
				case 0:
					//Display connect button
					document.querySelector('#header').style.display = "flex";
					document.querySelector('#button').style.display = "flex";	
					document.querySelector('#lightShow').style.display = "none";
					document.querySelector('#folditGame').style.display = "none";
					document.querySelector('#chooseGame').style.display = "none";
					document.querySelector('#disconnect').style.display = "none";
					document.querySelector('#about').style.display = "none";
					document.querySelector('#aboutbtn').style.display = "flex";
					document.querySelector('#timer').style.display = "none";
					document.querySelector('#backbtn').style.display = "none";	
					document.querySelector('#aboutFooter').style.display = "none";
					document.querySelector('#aboutbackbtn').style.display = "none";
					break;
					
				case 1:
					//Display about pop up
					document.querySelector('#header').style.display = "flex";
					document.querySelector('#button').style.display = "none";	
					document.querySelector('#lightShow').style.display = "none";
					document.querySelector('#folditGame').style.display = "none";
					document.querySelector('#chooseGame').style.display = "none";
					document.querySelector('#disconnect').style.display = "none";
					document.querySelector('#about').style.display = "flex";
					document.querySelector('#aboutbtn').style.display = "none";
					document.querySelector('#backbtn').style.display = "none";
					document.querySelector('#timer').style.display = "none";
					document.querySelector('#aboutFooter').style.display = "flex";
					document.querySelector('#aboutbackbtn').style.display = "flex";
					break;
				
				case 2:
					//Display menu to choose game
					document.querySelector('#header').style.display = "flex";
					document.querySelector('#button').style.display = "none";	
					document.querySelector('#lightShow').style.display = "none";
					document.querySelector('#folditGame').style.display = "none";
					document.querySelector('#chooseGame').style.display = "flex";
					document.querySelector('#disconnect').style.display = "flex";
					document.querySelector('#about').style.display = "none";
					document.querySelector('#aboutbtn').style.display = "none";
					document.querySelector('#backbtn').style.display = "none";
					document.querySelector('#timer').style.display = "flex";
					document.querySelector('#aboutFooter').style.display = "none";
					document.querySelector('#aboutbackbtn').style.display = "none";
					break;
					
				case 3:
					//Display the game 'Fold it'
					document.querySelector('#header').style.display = "flex";
					document.querySelector('#button').style.display = "none";	
					document.querySelector('#lightShow').style.display = "none";
					document.querySelector('#folditGame').style.display = "flex";
					document.querySelector('#chooseGame').style.display = "none";
					document.querySelector('#disconnect').style.display = "flex";	
					document.querySelector('#about').style.display = "none";
					document.querySelector('#aboutbtn').style.display = "none";
					document.querySelector('#backbtn').style.display = "flex";
					document.querySelector('#timer').style.display = "flex";
					document.querySelector('#aboutFooter').style.display = "none";
					document.querySelector('#aboutbackbtn').style.display = "none";
					randomize();	
					break;
				
				case 4:
					//Play a light show
					document.querySelector('#header').style.display = "flex";											//Generate a random unfolded cube when a bluetooth device is connected
					document.querySelector('#button').style.display = "none";	
					document.querySelector('#lightShow').style.display = "flex";
					document.querySelector('#folditGame').style.display = "none";
					document.querySelector('#chooseGame').style.display = "none";	
					document.querySelector('#disconnect').style.display = "flex";	
					document.querySelector('#about').style.display = "none";
					document.querySelector('#aboutbtn').style.display = "none";
					document.querySelector('#backbtn').style.display = "flex";
					document.querySelector('#timer').style.display = "flex";
					document.querySelector('#aboutFooter').style.display = "none";
					document.querySelector('#aboutbackbtn').style.display = "none";
					lightShow();
					sCharacteristicTX.writeValue(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 3]));
					break;
			}
		}
		
		function lightShow() {
			var rngMatrix = [];
			while(lightShow) {
				for(let i = 0; i > 6; i++) {
					var rng = Math.floor(Math.random()*6);
					rngMatrix[i] = rng;
				}
				log(rngMatrix);
				
			//sCharacteristicTX.writeValue(new Uint8Array([rngMatrix[0], rngMatrix[1], rngMatrix[2], rngMatrix[3], rngMatrix[4], rngMatrix[5], 0, 3]))
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
				document.querySelector('#connect').src = "images/cubelogo.png";
				document.querySelector('#disconnect').style.display = "none";
				document.querySelector('#aboutbtn').style.display = "flex";	
			}
		}

		//Function for keeping track of whether or not the application is connected to a bluetooth device
		function setConnected(connected) {
			isConnected = connected;
			if (connected) {
				displayPage(2);		
				
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
				displayPage(0);
				
				//Disconnect from bluetooth server.
				sServer.disconnect();
			}
		}
			
		//Function for connecting to bluetooth device. This function calls when user presses "Connect"
		function connect() {
			'use strict';

			//Check whether or not the browser supports web bluetooth
			if (!navigator.bluetooth) {
				log('Web Bluetooth API is not available.');
				log('Please make sure the Web Bluetooth flag is enabled.');
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

		//Randomize assignment and use write function to notify cube
		function randomize() {
			randomCube();
			sCharacteristicTX.writeValue(new Uint8Array([solutionA[0], 0, 0, 0, 0, 0, 0, 0]));
		}
		
		//Function for handling the bluetooth notifications from cube
		function handleNotifyCubeSolution(event) {
			let value = event.target.value;
			value = value.buffer ? value : new DataView(value);
			
			//Save the data array from the bluetooth buffer
			cubeData[0] = value.getUint8(0);
			cubeData[1] = value.getUint8(1);
			cubeData[2] = value.getUint8(2);
			cubeData[3] = value.getUint8(3);
			cubeData[4] = value.getUint8(4);
			cubeData[5] = value.getUint8(5);
			testholder = value.getUint8(6);		//Ekstra
			
			
			/*
			log('Data fra kube: ' + cubeData[0] + ', ' + cubeData[1] + ', ' + cubeData[2] + ', ' + cubeData[3] + ', ' + cubeData[4] + ', ' + cubeData[5]);
			log(testholder);
			*/
			
			switch(testholder) {
				case 0:
					break;
				case 1:
					//If the RNG-flag is high, randomize assignment and send new data to cube
					randomize();
					break;
				case 2:
					log('cubedata: ' + cubeData);
					log('solution: ' + solutionA);
					solver();
					break;
			}
				
			
		}
		
		//Function for disconnecting
		function disconnectDevice(){
			if(sCharacteristicRX) {
				sCharacteristicRX.stopNotifications().then(() => {
					sCharacteristicRX.removeEventListener('characteristicvaluechanged', handleCubeSolution);
				});
			}
			clearLog();
			displayPage(0);
	
			sServer.disconnect();
			log("Disconnected.");

		}	