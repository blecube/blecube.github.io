//Check users device
		var isMobile = {
			Android: function() {
				return navigator.userAgent.match(/Android/i);
			},
			BlackBerry: function() {
				return navigator.userAgent.match(/BlackBerry/i);
			},
			iOS: function() {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},
			Opera: function() {
				return navigator.userAgent.match(/Opera Mini/i);
			},
			Windows: function() {
				return navigator.userAgent.match(/IEMobile/i);
			},
			any: function() {
				return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			}
		};
		
		//Apply styles for mobile version
		if (isMobile.iOS() || isMobile.Android() || isMobile.BlackBerry() || isMobile.Opera()) {
			document.getElementById('styleSheet').href = "styles/stylesMobile.css";
		}
		//Apply styles for PC version
		else {
			document.getElementById('styleSheet').href = "styles/stylesPC.css";
		}
	
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
		
		var solution = [];
		var solutionA = [];
		var solutionB = [];
		var solutionC = [];
		var solutionD = [];
		var cubeData = [];
		var testholder;
		
		document.querySelector('#connect').addEventListener('click', connect);
		document.querySelector('#disconnect').addEventListener('click', disconnectDevice);
		document.querySelector('#closeAbout').addEventListener('click', function() {displayPage(0)});
		document.querySelector('#aboutbtn').addEventListener('click', function() {displayPage(1)});
		document.querySelector('#backbtn').addEventListener('click', function() {displayPage(2)});
		document.querySelector('#foldit').addEventListener('click', function() {displayPage(3)});
		document.querySelector('#simon').addEventListener('click', function() {displayPage(4)});
		//document.querySelector('#randomize').addEventListener('click', randomize);


		var cubes = [];
		cubes[0] = "images/rng/1ny.png"
		cubes[1] = "images/rng/2ny.png"
		cubes[2] = "images/rng/3ny.png"
		cubes[3] = "images/rng/4ny.png"
		cubes[4] = "images/rng/5ny.png"
		cubes[5] = "images/rng/6ny.png"
		cubes[6] = "images/rng/7ny.png"
		cubes[7] = "images/rng/8ny.png"
		cubes[8] = "images/rng/9ny.png"
		cubes[9] = "images/rng/10ny.png"
		
		function displayPage(lastPage) {
			switch(lastPage) {
				case 0:
					//Display connect button
					document.querySelector('#header').style.display = "flex";
					document.querySelector('#button').style.display = "flex";	
					document.querySelector('#simonGame').style.display = "none";
					document.querySelector('#folditGame').style.display = "none";
					document.querySelector('#chooseGame').style.display = "none";
					document.querySelector('#disconnect').style.display = "none";
					document.querySelector('#about').style.display = "none";
					document.querySelector('#aboutbtn').style.display = "flex";
					document.querySelector('#timer').style.display = "none";
					document.querySelector('#backbtn').style.display = "none";	
					break;
					
				case 1:
					//Display about pop up
					document.querySelector('#header').style.display = "flex";
					document.querySelector('#button').style.display = "none";	
					document.querySelector('#simonGame').style.display = "none";
					document.querySelector('#folditGame').style.display = "none";
					document.querySelector('#chooseGame').style.display = "none";
					document.querySelector('#disconnect').style.display = "none";
					document.querySelector('#about').style.display = "flex";
					document.querySelector('#aboutbtn').style.display = "none";
					document.querySelector('#backbtn').style.display = "none";
					document.querySelector('#timer').style.display = "none";
					break;
				
				case 2:
					//Display menu to choose game
					document.querySelector('#header').style.display = "flex";
					document.querySelector('#button').style.display = "none";	
					document.querySelector('#simonGame').style.display = "none";
					document.querySelector('#folditGame').style.display = "none";
					document.querySelector('#chooseGame').style.display = "flex";
					document.querySelector('#disconnect').style.display = "flex";
					document.querySelector('#about').style.display = "none";
					document.querySelector('#aboutbtn').style.display = "none";
					document.querySelector('#backbtn').style.display = "none";
					document.querySelector('#timer').style.display = "flex";
					break;
					
				case 3:
					//Display the game 'Fold it'
					document.querySelector('#header').style.display = "flex";
					document.querySelector('#button').style.display = "none";	
					document.querySelector('#simonGame').style.display = "none";
					document.querySelector('#folditGame').style.display = "flex";
					document.querySelector('#chooseGame').style.display = "none";
					document.querySelector('#disconnect').style.display = "flex";	
					document.querySelector('#about').style.display = "none";
					document.querySelector('#aboutbtn').style.display = "none";
					document.querySelector('#backbtn').style.display = "flex";
					document.querySelector('#timer').style.display = "flex";
					randomize(); 	
					break;
				
				case 4:
					//Play a light show
					document.querySelector('#header').style.display = "flex";											//Generate a random unfolded cube when a bluetooth device is connected
					document.querySelector('#button').style.display = "none";	
					document.querySelector('#simonGame').style.display = "flex";
					document.querySelector('#folditGame').style.display = "none";
					document.querySelector('#chooseGame').style.display = "none";	
					document.querySelector('#disconnect').style.display = "flex";	
					document.querySelector('#about').style.display = "none";
					document.querySelector('#aboutbtn').style.display = "none";
					document.querySelector('#backbtn').style.display = "flex";
					document.querySelector('#timer').style.display = "flex";
					break;
			}
		}
		
		function randomCube() {
			var rng = Math.floor(Math.random()*10);
			var cube = cubes[rng];
				
			document.getElementById("cubeImage").src = cube;


			switch(rng) {
				case 0:
					solutionA = [6, 5, 3, 4, 2, 1];
					solutionB = [6, 2, 5, 3, 4, 1];
					solutionC = [6, 4, 2, 5, 3, 1];
					solutionD = [6, 3, 4, 2, 5, 1];
					break;
				case 1:
					solutionA = [5, 1, 6, 4, 3, 2];
					solutionB = [5, 3, 1, 6, 4, 2];
					solutionC = [5, 4, 3, 1, 6, 2];
					solutionD = [5, 6, 4, 3, 1, 2];
					break;
				case 2:
					solutionA = [2, 3, 4, 5, 6, 1];
					solutionB = [2, 6, 3, 4, 5, 1];
					solutionC = [2, 5, 6, 3, 4, 1];
					solutionD = [2, 4, 5, 6, 3, 1];
					break;
				case 3:
					solutionA = [2, 6, 5, 4, 3, 1]; //!
					solutionB = [2, 3, 6, 5, 4, 1]; //!
					solutionC = [2, 4, 3, 6, 5, 1]; //!
					solutionD = [2, 5, 4, 3, 6, 1]; //!
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
				}
			}
			
			//If the loop reached 6 successful iteration, the user has won. Display winning image.
			if (counter == 6) {
				log('win');
				document.getElementById("cubeImage").src = "images/rng/win.png";
				
				//Write to nRF with winning flag on
				sCharacteristicTX.writeValue(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 3]));
			}
			else {
				log('wrong answer');
				sCharacteristicTX.writeValue(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 2]));
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
/*				
				document.querySelector('#header').style.display = "flex";
				document.querySelector('#button').style.display = "none";
				document.querySelector('#folditGame').style.display = "none";
				document.querySelector('#simonGame').style.display = "none";
				document.querySelector('#chooseGame').style.display = "flex";
				document.querySelector('#disconnect').style.display = "flex";	
				document.querySelector('#about').style.display = "none";
				document.querySelector('#aboutbtn').style.display = "none";
				document.querySelector('#timer').style.display = "flex";
				document.querySelector('#backbtn').style.display = "none";
*/				
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
/*	
				document.querySelector('#header').style.display = "none";
				document.querySelector('#button').style.display = "flex";
				document.querySelector('#chooseGame').style.display = "none";
				document.querySelector('#simonGame').style.display = "none";
				document.querySelector('#folditGame').style.display = "none";
				document.querySelector('#disconnect').style.display = "none";
				document.querySelector('#about').style.display = "none";
				document.querySelector('#aboutbtn').style.display = "flex";	
				document.querySelector('#backbtn').style.display = "none";
				document.querySelector('#timer').style.display = "none";			
*/				
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
			sCharacteristicTX.writeValue(new Uint8Array([solutionA[0], 0, 0, 0, 0, 0, 1, 0]));
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
			log('Data fra kube: ' + cubeData[0] + ', ' + cubeData[1] + ', ' + cubeData[2] + ', ' + cubeData[3] + ', ' + cubeData[4] + ', ' + cubeData[5]);
			log(testholder);
			
			
			switch(testholder) {
				case 0:
					//If the RNG-flag is low, just try solving
					log('cubedata: ' + cubeData);
					log('solution: ' + solutionA);
					solver();
					break;
				case 1:
					//If the RNG-flag is high, randomize assignment and send new data to cube
					randomize();
					break;
				case 2:
					break;
			}
				
			
		}
/*
		//Function for disconnecting device on press
		function stop(event) {
			log("stop(" + event + ")");
			try {
				log("Sender nullere")
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
*/
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