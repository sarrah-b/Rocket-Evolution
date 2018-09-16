
// var rocket;
var rockets;
var lifespan = 500;
var count = 0;
var generation = 1;
var target;
var targetRad = 50;

var obstacleRad = 25;

var obstacles = [];

var dnaForce = 0.1;


function setup() {
	createCanvas(500, 400); //creating the canvas
	rockets = new Population();
	target = createVector(width/2, 70);

	obstacles[0] = createVector(width/3, 170);
	obstacles[1] = createVector(width/2, 250);
	obstacles[2] = createVector(width*2/3, 170);
	
	resetbutton = createButton('RESET');
	resetbutton.position(width + 10, 80);
	resetbutton.mousePressed(reset);

	speedlabel = createElement('p', 'SPEED');
	speedlabel.position (width + 10, 95)

	speedslider = createSlider(0.1, 5, 1, 0.1);
	speedslider.position(width + 10, 130);

	speedp = createElement('p', 'The speed is: ' + speedslider.value());
	speedp.position (width + 10, 140)

	mutelabel = createElement('p', 'MUTATION RATE');
	mutelabel.position (width + 10, 185)

	muteslider = createSlider(0, 0.1, 0.04, 0.01);
	muteslider.position(width + 10, 220);

	mutep = createElement('p', 'The mutation rate is: ' + muteslider.value());
	mutep.position (width + 10, 230)

	clearbutton = createButton('CLEAR OBSTACLES');
	clearbutton.position(width + 10, 280);
	clearbutton.mousePressed(clearObstacles);

	generationp = createElement('p', 'Generation: ');
	generationp.position (width + 10, 300);



}



function draw() { //function to draw things
	background(0, 0, 35); //draws background
	fill(50, 255, 100);
	ellipse(target.x, target.y, targetRad, targetRad);

	for (let i = 0; i < obstacles.length; i++){
		fill(255, 100, 50);
		ellipse(obstacles[i].x, obstacles[i].y, obstacleRad, obstacleRad);
	}


	rockets.run();
	
	count++;
	if (count == lifespan) {
		rockets.evaluate();

		count = 0;
		generation++;
	}
	
	speedp.html('The speed is: <b>' + speedslider.value() + '</b>');
	mutep.html('The mutation rate is: <b>' + muteslider.value() + '</b>');
	generationp.html('Generation: <b>' + generation + '</b>');
}

function Population() {
	this.count = 100;
	this.rockets = [];
	this.matingpool = [];

	for(let i = 0; i < this.count; i++){
		this.rockets[i] = new Rocket();
		
	}

	this.evaluate = function() {
		// console.log(this.rockets);

		let percent = 0;


		var maxfit = 0;
		for (let i = 0; i < this.count; i++) {
			this.rockets[i].calcFitness();
			if (this.rockets[i].score > maxfit) {
				maxfit = this.rockets[i].score; //find maximum score in array
			}

			if(this.rockets[i].hit && !(this.rockets[i].dead)){
				percent++
			}
		}

		createP(String(generation) + '&nbsp;&nbsp;&nbsp;&nbsp;' + String(percent * 100 / this.count));

		for (let i = 0; i < this.count; i++) {
			this.rockets[i].score /= maxfit; //makes all scores between 0 and 1
		}	

		this.matingpool = [];
		for (let i = 0; i < this.count; i++) {
			var n = this.rockets[i].score * 100;
			// console.log(n);
			for (var j = 0; j < n; j++) {
				this.matingpool.push(this.rockets[i]);
				// this.matingpool.push(9);
			}
		}
		// console.log(this.matingpool);
		let = newrockets = []; 
		for (let i = 0; i < this.count; i++) {
			newrockets[i] = this.selection();
		}

		this.rockets = newrockets;
	}

	this.selection = function() {
		var parentA = random(this.matingpool);
		var parentB = random(this.matingpool);
		// console.log(parentA);
		try{
			var childDNA = parentA.crossover(parentB);
		}catch{

			console.log(parentA);
			console.log(parentB);
			console.log(this.matingpool);
		}

		childrocket = new Rocket();
		childrocket.DNA = childDNA;

		return childrocket;
	}

	this.run = function(){
		for (let i = 0; i < this.count; i++) {
			this.rockets[i].update();
			this.rockets[i].show();
		}
		// this.evaluate();
	}
}



function DNA(){
	this.gene = [];
	for (var i = 0; i < lifespan; i++) {
		this.gene[i] = p5.Vector.random2D();
		this.gene[i].setMag(dnaForce);
	}


}

function Rocket() {
	this.pos = createVector(width/2, height - 10);
	this.vel = createVector();
	this.acc = createVector();
	this.DNA = new DNA();
	this.score = 0;
	this.hit = false;
	this.dead = false;

	this.crossover = function(parent) {
		this.childDNA = new DNA();
		try{
		for (var x = 0; x < lifespan; x++) {
			if(random()>0.5){
				this.childDNA.gene[x] = parent.DNA.gene[x];
			}else{
				this.childDNA.gene[x] = this.DNA.gene[x];
			}

			//randomises gene slightly
			this.childDNA.gene[x].add( p5.Vector.random2D().mult(dnaForce * muteslider.value()) );

			this.childDNA.gene[x].setMag(dnaForce);
		}

		}catch{
			console.log(this.childDNA);
		}

		return this.childDNA;
	}

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.calcFitness = function() {
		var d = dist(this.pos.x, this.pos.y, target.x, target.y);
		
		if(this.hit){
			this.score = width * 3;
			if(this.dead){
				this.score = 1/100;
			}
		}else{
			this.score = map(d, 0, width, width, 0);
		}
	}



	this.update = function() {
		if(dist(this.pos.x, this.pos.y, target.x, target.y) < targetRad/2){
			this.hit =  true;
			return;
		}

		for (let i = 0; i < obstacles.length; i++){
			if(dist(this.pos.x, this.pos.y, obstacles[i].x, obstacles[i].y) < obstacleRad/2){
				this.hit =  true;
				this.dead = true;
				return;
			}
		}

		if(this.pos.x<0 || this.pos.x> width | this.pos.y<0 || this.pos.y> height){
			this.hit =  true;
			this.dead = true;
			return;
		}

		this.applyForce(this.DNA.gene[count]);
		// this.count++;
		this.vel.add(this.acc);
		this.pos.add(p5.Vector.mult(this.vel, speedslider.value()));
		this.acc.mult(0);
	}

	this.show = function() {
		push();
		
		stroke(0);
		fill(255, 50, 100);
		translate(this.pos.x, this.pos.y);
		rotate(this.vel.heading());
		rectMode(CENTER);
		rect(0, 0, 25, 8);
		noStroke();
		pop();
	}
}


function reset() {
	rockets = new Population();
	count = 0;
	generation = 1;
}

function clearObstacles(){
	obstacles = [];
}

function mousePressed(){
	// console.log("hahahahahaha");
	if(mouseButton == LEFT){
		obstacles.push(createVector(mouseX, mouseY));
	}

}
