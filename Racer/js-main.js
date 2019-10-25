window.onload = function() {
    canv = document.getElementById("gc");
    ctx = canv.getContext("2d");
    document.addEventListener("keydown",keydown);
    setup();
    grid = build(25);
    let fps = 25;
    setInterval(main, 1000/fps);
}

function setup() {
    car = new Car();
}

function Car() {
    this.i = 0;
    this.j = 0;

    this.right = function() {
        if(this.j < grid.size-1 &&
        grid.cells[this.i][this.j].walls.right == false) {
            this.j++;
        }
        while(this.j < grid.size-1 &&
        grid.cells[this.i][this.j].walls.right == false &&
        grid.cells[this.i][this.j].walls.top == true &&
        grid.cells[this.i][this.j].walls.bottom == true) {
            this.j++;
        }
    }
    this.left = function() {
        if(this.j > 0 &&
        grid.cells[this.i][this.j].walls.left == false) {
            this.j--;
        }
        while(this.j > 0 &&
        grid.cells[this.i][this.j].walls.left == false &&
        grid.cells[this.i][this.j].walls.top == true &&
        grid.cells[this.i][this.j].walls.bottom == true) {
            this.j--;
        }
    }
    this.up = function() {
        if(this.i > 0 &&
        grid.cells[this.i][this.j].walls.top == false) {
            this.i--;
        }
        while(this.i > 0 &&
        grid.cells[this.i][this.j].walls.top == false &&
        grid.cells[this.i][this.j].walls.left == true &&
        grid.cells[this.i][this.j].walls.right == true) {
            this.i--;
        }
    }
    this.down = function() {
        if(this.i < grid.size-1 &&
        grid.cells[this.i][this.j].walls.bottom == false) {
            this.i++;
        }
        while(this.i < grid.size-1 &&
        grid.cells[this.i][this.j].walls.bottom == false &&
        grid.cells[this.i][this.j].walls.left == true &&
        grid.cells[this.i][this.j].walls.right == true) {
            this.i++;
        }
    }
}

function draw() {
    for(let i=0; i<grid.size; ++i) {
        for(let j=0; j<grid.size; ++j) {
            grid.cells[i][j].show();
        }
    }
    ctx.fillStyle = "#222";
    let x = (car.j+0.5)*grid.scale,
        y = (car.i+0.5)*grid.scale,
        r = grid.scale*0.3;
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = "2";
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.stroke();
}

function keydown(evt) {
    switch(evt.keyCode) {
        case 37:
            car.left();
            break;
        case 38:
            car.up();
            break;
        case 39:
            car.right();
            break;
        case 40:
            car.down();
            break;
        default:
            console.log("error");
            break;
    }
}

function main() {
    draw();
}
