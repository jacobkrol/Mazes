
window.onload=function() {
	canv=document.getElementById("gc");
	ctx=canv.getContext("2d");
	canv.height = window.innerHeight;
	canv.width = window.innerWidth;
	size = 70;
	setup();
    let fps = 1000;
    setInterval(main,1000/fps);
}

function setup() {
	let prop = canv.width/canv.height;
    grid = {
        size: {
			x: Math.ceil(size*prop),
			y: size
		},
        cells: [],
        color: "#66B",
        scale: canv.height/size,
        complete: false,
        filled: 0
    };
	cursor = [Math.floor(Math.random()*grid.size.y),
              Math.floor(Math.random()*grid.size.x)];
	cmin = get_random(32,96);
	cmax = get_random(160,224);
	if(Math.random() < 0.5) {
		let temp = cmin;
		cmin = cmax;
		cmax = temp;
	}
    for(let i=0; i<grid.size.y; ++i) {
        grid.cells.push([]);
        for(let j=0; j<grid.size.x; ++j) {
            grid.cells[i].push(new Cell(i,j));
        }
    }
	ctx.fillStyle = "#224";
	ctx.fillRect(0,0,canv.width,canv.height);
}

function Cell(i,j) {
    this.i = i;
    this.j = j;
    stack = [];
    this.walls = {
        top: true,
        right: true,
        bottom: true,
        left: true
    };
    this.visited = false;
    this.color = "#555";

    this.visit = function() {
        this.visited = true;
        this.color = get_color(this.j); // #449
    }

    this.show = function() {
        let x = this.j*grid.scale,
            y = this.i*grid.scale;
        ctx.fillStyle = this.color;
        if(this.i == cursor[0] && this.j == cursor[1] && !grid.complete) {
			ctx.fillStyle = "white";
        }
        ctx.fillRect(x,y,grid.scale,grid.scale);
        ctx.strokeStyle = "white";
        if(this.walls.top) line(x,y,x+grid.scale,y);
        if(this.walls.right) line(x+grid.scale,y,x+grid.scale,y+grid.scale);
        if(this.walls.bottom) line(x+grid.scale,y+grid.scale,x,y+grid.scale);
        if(this.walls.left) line(x,y+grid.scale,x,y);
    }
}

function line(x1,y1,x2,y2) {
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();
}

function get_random(a,b) {
	return Math.floor(Math.random()*(b-a)+a);
}

function map(val, min1, max1, min2, max2) {
	if(val <= max1 && val >= min1) {
		let range1 = max1-min1,
			prop1 = (val-min1)/range1,
			range2, prop2;
		if(min2 > max2) {
			range2 = min2 - max2;
			prop2 = min2-range2*prop1;
		} else {
			range2 = max2-min2,
			prop2 = range2*prop1+min2;
		}
		return prop2;
	} else {
		return 0;
	}

}

function get_color(j) {
	let x = (j)*grid.scale,
		prop = x/canv.width,
		r = 0, g = 0, b = 0;
		//cmin = grid.cmin, cmax = grid.cmax;


	switch(Math.floor(x/(canv.width/6))) {
		case 0:
			//BUILD G
			r = cmax;
			g = map(x,0,canv.width/6,cmin,cmax);
			b = cmin;
			break;
		case 1:
			//REMOVE R
			r = map(x,canv.width/6,canv.width/3,cmax,cmin);
			g = cmax;
			b = cmin;
			break;
		case 2:
			//BUILD B
			r = cmin;
			g = cmax;
			b = map(x,canv.width/3,canv.width/2,cmin,cmax);
			break;
		case 3:
			//REMOVE G
			r = cmin;
			g = map(x,canv.width/2,2*canv.width/3,cmax,cmin);
			b = cmax;
			break;
		case 4:
			//BUILD R
			r = map(x,2*canv.width/3,5*canv.width/6,cmin,cmax);
			g = cmin;
			b = cmax;
			break;
		case 5:
			//REMOVE B
			r = cmax;
			g = cmin;
			b = map(x,5*canv.width/6,canv.width,cmax,cmin);
			break;
		default:
			console.log("cell bound error");
			break;
	}
	return "rgb("+r+","+g+","+b+")";
}

function some_unvisited() {
    for(let i=0; i<grid.size.y; ++i) {
        for(let j=0; j<grid.size.x; ++j) {
            if(!grid.cells[i][j].visited) {
                return true;
            }
        }
    }
    return false;
}

function neighbors_unvisited(c) {
    let n = [];
    if(c[1] > 0 && !grid.cells[c[0]][c[1]-1].visited) n.push([c[0],c[1]-1]);
    if(c[0] < grid.size.y-1 && !grid.cells[c[0]+1][c[1]].visited) n.push([c[0]+1,c[1]]);
    if(c[1] < grid.size.x-1 && !grid.cells[c[0]][c[1]+1].visited) n.push([c[0],c[1]+1]);
    if(c[0] > 0 && !grid.cells[c[0]-1][c[1]].visited) n.push([c[0]-1,c[1]]);
    return n;
}

function compute() {
	grid.cells[cursor[0]][cursor[1]].visit();
    if(some_unvisited()) {
        let n = neighbors_unvisited(cursor);
        if(n.length) {
            let choice = n[Math.floor(Math.random()*n.length)];
            stack.push([cursor[0],cursor[1]]);
            grid.filled++;
            if(choice[1] < cursor[1]) {
                grid.cells[cursor[0]][cursor[1]].walls.left = false;
                grid.cells[choice[0]][choice[1]].walls.right = false;
            } else if(choice[1] > cursor[1]) {
                grid.cells[cursor[0]][cursor[1]].walls.right = false;
                grid.cells[choice[0]][choice[1]].walls.left = false;
            } else if(choice[0] < cursor[0]) {
                grid.cells[cursor[0]][cursor[1]].walls.top = false;
                grid.cells[choice[0]][choice[1]].walls.bottom = false;
            } else if(choice[0] > cursor[0]) {
                grid.cells[cursor[0]][cursor[1]].walls.bottom = false;
                grid.cells[choice[0]][choice[1]].walls.top = false;
            }
            cursor[0] = choice[0];
            cursor[1] = choice[1];
        } else if(stack.length) {
            let removed = stack.pop();
            cursor[0] = removed[0];
            cursor[1] = removed[1];
        }
    } else if(stack.length) {
		grid.complete = true;
		let removed = stack.pop();
		cursor[0] = removed[0];
		cursor[1] = removed[1];
    } else {
		let t0 = performance.now();
		while(performance.now()-t0 < 1500) {
			draw();
		}
		setup();
	}
}

function draw() {
    for(let i=0; i<grid.size.y; ++i) {
        for(let j=0; j<grid.size.x; ++j) {
			if(grid.cells[i][j].visited) {
				grid.cells[i][j].show();
			}
        }
    }
}

function main() {
	let speed = 20*grid.filled/(grid.size.x*grid.size.y)+1;
	for(let count=0; count<speed; ++count) {
		compute();
	}
	draw();
}
