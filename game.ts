class Cell {	
	constructor(public x: number, public y: number, public numberNeighbours = 0) { }
}

class Board {
	public cells: Cell[]; 
	public newBornCells : Cell[];
	public zombieCells : Cell[];

	public isNeighbour(neighbour1: Cell, neighbour2: Cell):  boolean{
		return ( Math.abs(neighbour1.x - neighbour2.x) <= 1 && Math.abs(neighbour1.y - neighbour2.y) <= 1); 
	}

	public generateStartLife(width: number, height: number){
		this.cells = []; 
		let countLifes = Math.floor((Math.random() * width*10) + 1);
		for (let i = 0; i < countLifes; ++i) {
			let xCoords: number = Math.floor((Math.random() * width * 0.1 ) + 1);
			let yCoords: number = Math.floor((Math.random() * height * 0.1 ) + 1);
			this.cells.push(new Cell(xCoords, yCoords));
		}
	}
}

class LifeGame{
	
	constructor(public board: Board) {
		board.generateStartLife(this.width, this.height)
	}

	private width: number = 400 ;
	private height: number = 400;	
	private cellColor: string;
	private cellSize: string;

	public tick(){

		if (this.board.cells.length > 0){
			this.spawn();
			this.spreadLife();
			this.killZombie();
			this.refreshLife();
			this.draw();
			this.clearAccount();

			let that = this;
			setTimeout(function() {
				requestAnimationFrame(() => that.tick());
			}, 1000);

		} else {
			alert('Game over !');
		}
	}

	private draw() {

		let c:any = document.getElementById("myCanvas");
		let ctx:any = c.getContext("2d");

		ctx.clearRect(0, 0, this.width, this.height); 

		for (let j = 1; j < this.board.cells.length; j++) { 			 
			ctx.fillStyle = "#22FF44";
			ctx.fillRect(this.board.cells[j].x, this.board.cells[j].y, 1, 1);
		}	
	}

	private clearAccount(){
		for (let l in this.board.cells){
			this.board.cells[l].numberNeighbours = 0;
		}
	}

	private spawn(){

		let coords = [{ "x": -1, "y": -1 }, { "x": -1, "y": 0 }, 
			{ "x": -1, "y": 1 }, {"x":0, "y":-1},{ "x"  :  0 ,  "y": 1},
			{"x":1, "y":-1 },{ "x":1, "y":0 },{"x":1, "y":1}];

		this.board.newBornCells = [];

		for (let i = 0; i < this.board.cells.length; ++i){
			for (let k = 0; k < coords.length; ++k) {				 
			
				if (!(this.board.cells.some(c => c.x + coords[k].x == this.board.cells[i].x  
					&& c.y + coords[k].y == this.board.cells[i].y ))){

					let isNewBornCell:boolean = true;

					for (let j = 0; j < this.board.newBornCells.length; ++j) {
						if (this.board.cells[i].x + coords[k].x == this.board.newBornCells[j].x
							&& this.board.cells[i].y + coords[k].y == this.board.newBornCells[j].y
						) {
							this.board.newBornCells[j].numberNeighbours ++;
							isNewBornCell = false;
						} 
					}

					if (isNewBornCell){
						this.board.newBornCells.push(
							new Cell(this.board.cells[i].x + coords[k].x,
							 this.board.cells[i].y +coords[k].y, 1));
					}
				}
			}
		}
	}

	private spreadLife() {
		for (let i = 0; i < this.board.cells.length-1; ++i) {
			for (let j = i + 1; j < this.board.cells.length; ++j) {

				if (this.board.isNeighbour(this.board.cells[i], this.board.cells[j])) {
					this.board.cells[i].numberNeighbours += 1;
					this.board.cells[j].numberNeighbours += 1;
				}
			}

		}
	}

	private refreshLife(){
		for(let j in this.board.newBornCells){

			if (this.board.newBornCells[j].numberNeighbours == 3){
				this.board.cells.push(this.board.newBornCells[j]);
			}
		}
	}

	private killZombie() {
		for (let i = this.board.cells.length - 1; i >= 0; --i){

			if (this.board.cells[i].numberNeighbours < 2 ||
				this.board.cells[i].numberNeighbours > 3){
				 this.board.cells.splice(i, 1);
			}
		}
	}
}

let createGame = new LifeGame(new Board());
createGame.tick();
