function Entity(x, y, color) {
    this.x = x;
    this.y = y;

    this.color = color;

    this.size = 20;

    this.draw = function() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.size, this.size);
    };

    this.keepOnCanvas = function() {
        if(this.getLeft() < 0) {
            this.setLeft(0);
        } else if(this.getRight() > canvas.width) {
            this.setRight(canvas.width);
        }

        if(this.getTop() < 0) {
            this.setTop(0);
        } else if(this.getBottom() > canvas.height) {
            this.setBottom(canvas.height);
        }
    };

    this.getLeft = function() {
        return this.x;
    };

    this.setLeft = function(value) {
        this.x = value;
    };

    this.getTop = function() {
        return this.y;
    };

    this.setTop = function(value) {
        this.y = value;
    };

    this.getRight = function() {
        return this.x + this.size;
    };

    this.setRight = function(value) {
        this.x = value - this.size;
    };

    this.getBottom = function() {
        return this.y + this.size;
    };

    this.setBottom = function(value) {
        this.y = value - this.size;
    };
}
