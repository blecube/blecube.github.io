var solution = [];
var solutionA = [];
var solutionB = [];
var solutionC = [];
var solutionD = [];
var cubeData = [];

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
		
		