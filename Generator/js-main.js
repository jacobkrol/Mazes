
window.onload=function() {
	canv=document.getElementById("gc");
	ctx=canv.getContext("2d");
    setup(75);
    let fps = 25;
    setInterval(main,1000/fps);
}

function setup(_size) {
    grid = {
        size: _size,
        cells: [],
        color: "#66B",
        scale: canv.width/_size,
        complete: false,
        filled: 0
    };
    cursor = [0,0];
    for(let i=0; i<grid.size; ++i) {
        grid.cells.push([]);
        for(let j=0; j<grid.size; ++j) {
            grid.cells[i].push(new Cell(i,j));
        }
    }
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
        this.color = "#449";
    }

    this.show = function() {
        let x = this.j*grid.scale,
            y = this.i*grid.scale;
        ctx.fillStyle = this.color;
        if(this.i == cursor[0] && this.j == cursor[1]) {
            ctx.fillStyle = "#494";
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

function some_unvisited() {
    for(let i=0; i<grid.size; ++i) {
        for(let j=0; j<grid.size; ++j) {
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
    if(c[0] < grid.size-1 && !grid.cells[c[0]+1][c[1]].visited) n.push([c[0]+1,c[1]]);
    if(c[1] < grid.size-1 && !grid.cells[c[0]][c[1]+1].visited) n.push([c[0],c[1]+1]);
    if(c[0] > 0 && !grid.cells[c[0]-1][c[1]].visited) n.push([c[0]-1,c[1]]);
    return n;
}

function compute() {
    if(!grid.complete) {
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
        } else {
            console.log("complete");
            grid.complete = true;
            cursor = [-1,-1];
        }
    }
}

function draw() {
    // if(grid.complete) {
        for(let i=0; i<grid.size; ++i) {
            for(let j=0; j<grid.size; ++j) {
                grid.cells[i][j].show();
            }
        }
    // } else {
    //     ctx.strokeStyle = "black";
    //     ctx.strokeRect(20,20,320,40);
    //     ctx.fillStyle = "lime";
    //     let prop = grid.filled/(grid.size*grid.size);
    //     ctx.fillRect(21,21,prop*298,38);
    // }

}

function main() {
    compute();
    draw();
}
