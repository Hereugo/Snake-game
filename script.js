const len = 30;
const W = 20*len;
const H = 10*len;
const speed = 6
var snake
var fruit
var count = 0

function setup() {
	createCanvas(W , H).center();
	snake = new Snake()
	fruit = new Fruit()
	frameRate(len)
}
function draw() {
	background(0)
	if (!snake.gameOver) {
		//Draw just snake
		let a = 0 , b = snake.tail.length-1
		if (snake.tail.length != 1) {
			let lasttail = snake.tail[a][0].copy()
			lasttail.set(lasttail.x*len , lasttail.y*len)
			let lastdirtail = snake.tail[a][1].copy().mult(count*speed)
			lasttail.add(lastdirtail)
			noStroke()
			fill(snake.clr)
			rect(lasttail.x , lasttail.y , len , len)
		}
		for (let i=a+1; i<b; i++) {
			noStroke()
			fill(snake.clr)
			rect(snake.tail[i][0].x*len , snake.tail[i][0].y*len , len , len)
		}	
		let lasthead = snake.tail[b][0].copy().sub(snake.tail[b][1])
		lasthead.set(lasthead.x*len , lasthead.y*len)
		let lastdirhead = snake.tail[b][1].copy().mult(count*speed)
		lasthead.add(lastdirhead)
		noStroke()
		fill(snake.clr)
		rect(lasthead.x , lasthead.y , len , len)

		//Draw outline if two are neighbors
		for (let i=a+1; i<b; i++){
			//At most two sides are covered
			let side1d = snake.tail[i-1][1].copy()
			let side1 = (snake.tail[i-1][0].copy().add(side1d)) * len
			let side2d = snake.tail[i][1].copy()
			let side2 = (snake.tail[i][0].copy().sub(side2d)) * len
			
			noStroke()
			fill("purple")
			if (side1d.equals(side2d)) {
				if (side1d.x == 0) {
					rect(side1.x , side1.y-1 , len , 1)
					rect(side1.x , side1.y+len , len , 1)
				}
				if (side1d.y == 0) { 
					rect(side1.x-1 , side1.y , 1 , len)
					rect(side1.x+len , side1.y , 1 , len)
				}
			} else {
				if (side1d.equals(-1 , 0)) rect(side1.x-1 , side1.y , 1 , len) //LEFT
				if (side1d.equals(1 , 0)) rect(side1.x+len , side1.y , 1 , len) //RIGHT
				if (side1d.equals(0 , -1)) rect(side1.x , side1.y-1 , len , 1) //UP
				if (side1d.equals(0 , 1)) rect(side1.x, side1.y+len , len , 1) //DOWN

				if (side2d.equals(-1 , 0)) rect(side2.x-1 , side2.y , 1 , len) //LEFT
				if (side2d.equals(1 , 0)) rect(side2.x+len , side2.y , 1 , len) //RIGHT
				if (side2d.equals(0 , -1)) rect(side2.x, side2.y-1 , len , 1) //UP
				if (side2d.equals(0 , 1)) rect(side2.x, side2.y+len , len , 1) //DOWN
			}
		}

		noStroke()
		fill(fruit.clr)
		rect(fruit.pos.x*len , fruit.pos.y*len , len , len)

		if (count % (len/speed) == 0) {
			snake.keyboardMovement()
			snake.update()
			count = 0
		}

		count++
	} else {
		snake = new Snake()
		fruit = new Fruit()
	}
}

function Fruit() {
	let x , y
	// do {
		x = floor(random(W/len))
		y = floor(random(H/len))
	// } while (snake.tail.includes(p5.Vector(x,y)))
	this.pos = createVector(x , y)
	this.clr = "red"
}

function Snake() {
	this.head = createVector(W/len/2 , H/len/2)
	this.tail = []
	this.dir = createVector(1 , 0)
	this.tail.push([this.head.copy() , this.dir.copy()])
	this.tail.unshift([this.head.copy().sub(this.dir.copy()) , this.dir.copy()])
	this.clr = "green"
	this.gameOver = false

	this.keyboardMovement = function() {
		if (keyIsDown(LEFT_ARROW) && (!this.dir.equals(1 , 0) || this.tail.length == 2)) this.dir.set(-1 , 0)
		if (keyIsDown(RIGHT_ARROW) && (!this.dir.equals(-1 , 0) || this.tail.length == 2)) this.dir.set(1 , 0)
		if (keyIsDown(UP_ARROW) && (!this.dir.equals(0 , 1) || this.tail.length == 2)) this.dir.set(0 , -1)
		if (keyIsDown(DOWN_ARROW) && (!this.dir.equals(0 , -1) || this.tail.length == 2)) this.dir.set(0 , 1)
 	}

	this.update = function() {
		this.head.add(this.dir)
		this.tail[this.tail.length-1][1].set(this.dir)
		for (let i=1; i<this.tail.length; i++) {
			if (this.head.equals(this.tail[i][0])) {
				this.gameOver = true
			}
		}

		if (0 <= this.head.x && this.head.x <= W/len-1)
			if (0 <= this.head.y && this.head.y <= H/len-1) {
				let skip = 0
				if (this.head.equals(fruit.pos)) {
					fruit = new Fruit()
					this.tail.unshift([this.tail[0][0].copy() , this.tail[0][1].copy()])
					skip = 1
				}
				for (let i=skip; i<this.tail.length; i++) {
					this.tail[i][0].add(this.tail[i][1])
					if (i != this.tail.length-1)
						this.tail[i][1].set(this.tail[i+1][1])
				}
			} else this.gameOver = true
		else this.gameOver = true
	}
}