var canvas;
var context;
var player;
var cookie = new Image();
var bite = new Audio('bite.mp3');
var enemies = [];
var bullets = [];
var inputs = {
    left: false,
    up: false,
    right: false,
    down: false,
    click: false
};
var timestamp;
var x;
var y;
var moneys = 0;
var prices = 0;
var SPEED = 200;

function init() {
    canvas = document.getElementById('canvas');
    canvas.width = 600;
    canvas.height = 400;

    context = canvas.getContext('2d');

    cookie.src = 'cookie.png';

    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    document.addEventListener('mousedown', mouseDown, false);
    document.addEventListener('mouseup', mouseUp, false);
    document.addEventListener('mousemove', mouseMove, false);

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

    if(inputs.click && moneys >= prices) {
        moneys -= prices;
        var bullet = new Entity(0, 0, 'blue');
        //bullet.size = 5;
        var offset = player.size / 2 - bullet.size / 2;
        bullet.x = player.x + offset;
        bullet.y = player.y + offset;
        var dx = x - bullet.x;
        var dy = y - bullet.y;
        var total = Math.abs(dx) + Math.abs(dy);
        bullet.vx = dx / total;
        bullet.vy = dy / total;
        bullets.push(bullet);
        prices = Math.pow(10, bullets.length);
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

    for(var i=0; i<bullets.length; i++) {
        if(bullets[i].getLeft() < 0) {
            bullets[i].setLeft(0);
            bullets[i].vx *= -1;
        }
        if(bullets[i].getTop() < 0) {
            bullets[i].setTop(0);
            bullets[i].vy *= -1;
        }
        if(bullets[i].getRight() > canvas.width) {
            bullets[i].setRight(canvas.width);
            bullets[i].vx *= -1;
        }
        if(bullets[i].getBottom() > canvas.height) {
            bullets[i].setBottom(canvas.height);
            bullets[i].vy *= -1;
        }

        bullets[i].x += bullets[i].vx * SPEED * delta;
        bullets[i].y += bullets[i].vy * SPEED * delta;

        for(var n=0; n<enemies.length; n++) {
            if(collides(bullets[i], enemies[n])) {
                shove(enemies[n], bullets[i]);
                bite.play();
                moneys += 10;
            }
        }

        if(collides(bullets[i], player)) {
            shove(player, bullets[i]);
        }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    player.draw();

    for(var i=0; i<enemies.length; i++) {
        context.drawImage(
            cookie,
            0, 0, 30, 30,
            enemies[i].x, enemies[i].y, enemies[i].size, enemies[i].size
        );
    }

    for(var i=0; i<bullets.length; i++) {
        bullets[i].draw();
    }

    context.font = 'bold 18px monospace';
    context.fillStyle = 'white';
    context.fillText('moneys: ' + moneys, 20, 30);
    context.fillText('prices: ' + prices, 20, 60);

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

function mouseDown(e) {
    inputs.click = true;
}

function mouseUp(e) {
    inputs.click = false;
}

function mouseMove(e) {
    var rect = canvas.getBoundingClientRect();
    x = e.pageX - rect.left;
    y = e.pageY - rect.top;
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
        b.vx *= -1;
    } else {
        var move = b.size - Math.abs(dy);
        if(dy > 0) {
            a.y += move / 2;
            b.setBottom(a.getTop());
        } else {
            a.y -= move / 2;
            b.setTop(a.getBottom());
        }
        b.vy *= -1;
    }
}
