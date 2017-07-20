var canvas;
var context;
var player;
var enemies = [];
var inputs = {
    left: false,
    up: false,
    right: false,
    down: false
};
var timestamp;
var SPEED = 200;

function init() {
    canvas = document.getElementById('canvas');
    canvas.width = 600;
    canvas.height = 400;

    context = canvas.getContext('2d');

    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);

    player = new Entity(0, 0, 'red');

    var xx = canvas.width / 2;
    var yy = canvas.height / 2;
    for(var i=0; i<10; i++) {
        enemies.push(new Entity(xx + i, yy - i, 'green'));
    }

    timestamp = Date.now();

    gameLoop();
}

function gameLoop() {
    newStamp = Date.now();
    var delta = (newStamp - timestamp) / 1000;
    timestamp = newStamp;

    if(inputs.left) {
        player.x -= SPEED * delta;
    } else if(inputs.right) {
        player.x += SPEED * delta;
    }

    if(inputs.up) {
        player.y -= SPEED * delta;
    } else if(inputs.down) {
        player.y += SPEED * delta;
    }

    player.keepOnCanvas();

    for(var i=0; i<enemies.length; i++) {
        for(var n=0; n<enemies.length; n++) {
            if(i == n) continue;
            if(collides(enemies[i], enemies[n])) {
                shove(enemies[i], enemies[n]);
            }
        }
    }

    for(var i=0; i<enemies.length; i++) {
        if(collides(player, enemies[i])) {
            shove(player, enemies[i]);
        }
        enemies[i].keepOnCanvas();
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    player.draw();

    for(var i=0; i<enemies.length; i++) {
        enemies[i].draw();
    }

    window.requestAnimationFrame(gameLoop);
}

function keyDown(e) {
    e.preventDefault();
    var code = e.keyCode;
    if(code == 37) {
        inputs.left = true;
    }
    if(code == 38) {
        inputs.up = true;
    }
    if(code == 39) {
        inputs.right = true;
    }
    if(code == 40) {
        inputs.down = true;
    }
}

function keyUp(e) {
    e.preventDefault();
    var code = e.keyCode;
    if(code == 37) {
        inputs.left = false;
    }
    if(code == 38) {
        inputs.up = false;
    }
    if(code == 39) {
        inputs.right = false;
    }
    if(code == 40) {
        inputs.down = false;
    }
}

function collides(a, b) {
    if(a.getRight() < b.getLeft()) return false;
    if(a.getBottom() < b.getTop()) return false;
    if(a.getLeft() > b.getRight()) return false;
    if(a.getTop() > b.getBottom()) return false;
    return true;
}

function shove(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;

    if(Math.abs(dx) > Math.abs(dy)) {
        var move = b.size - Math.abs(dx);
        if(dx > 0) {
            a.x += move / 2;
            b.setRight(a.getLeft());
        } else {
            a.x -= move / 2;
            b.setLeft(a.getRight());
        }
    } else {
        var move = b.size - Math.abs(dy);
        if(dy > 0) {
            a.y += move / 2;
            b.setBottom(a.getTop());
        } else {
            a.y -= move / 2;
            b.setTop(a.getBottom());
        }
    }
}
