'use strict'


// Factory will create new shape of given type
var ShapeFactory = {
    build: function (type, options) {

        switch (type) {

            case Shapes.SmallWallCabinet:
                // Small cabinet shape
                var dimension = {
                    width: 140,
                    depth: 30,
                    height: 30,
                    altitude: 100,
                    price: 150,
                    type: type
                }
                return new WallCabinet(Object.assign(dimension, options));

            case Shapes.BigWallCabinet:
                // Big cabinet shape
                var dimension = {
                    width: 140,
                    depth: 30,
                    height: 60,
                    altitude: 100,
                    price: 150,
                    type: type
                }
                return new WallCabinet(Object.assign(dimension, options));

            case Shapes.Door:
                // Door shape
                var dimension = {
                    radius: 83,
                    width: 101,
                    height: 100,
                    price: 500,
                    altitude: 0,
                    maxDegree: 105,
                    type: type
                }
                return new Door(Object.assign(dimension, options));

            case Shapes.SmallFloorCabinet:
                // Big cabinet shape
                var dimension = {
                    width: 75,
                    depth: 30,
                    height: 40,
                    altitude: 0,
                    price: 1000,
                    type: type
                }
                return new FloorCabinet(Object.assign(dimension, options));

            case Shapes.BigFloorCabinet:
                // Big cabinet shape
                var dimension = {
                    width: 75,
                    depth: 30,
                    height: 60,
                    altitude: 0,
                    price: 1200,
                    type: type
                }
                return new FloorCabinet(Object.assign(dimension, options));

            case Shapes.Floor:
                // Big cabinet shape
                var dimension = {
                    width: 400, //not sure how to getWidth
                    height: 400,
                    type: type
                }
                return new Floor(Object.assign(dimension, options));

            default:
                // Not specified
                throw "Shape type not specified";
                break;
        }
    }
}


// -- Enumerator
var Shapes = {
    "SmallWallCabinet": 0,
    "BigWallCabinet": 1,
    "Door": 2,
    "SmallFloorCabinet": 3,
    "BigFloorCabinet": 4,
    //"Floor":                5
}


// --- Base
var Shape = function (options) {
    this.posX = options.posX;
    this.posY = options.posY;
    this.width = options.width;
    this.height = options.height;
    this.altitude = options.altitude;
    this.rotation = options.rotation === undefined ? 0 : options.rotation; // degrees
    this.price = options.price;
    this.fillColor = options.fillColor;
    this.strokeColor = options.strokeColor;
    this.type = options.type;

    this.rotate = function (degree, context) {
        this.rotation = degree;
        this.draw(context);
    }
}


// --- Door
var Door = function (options) {
    Shape.call(this, options);

    // Added properties
    this.radius = options.radius;
    this.maxDegree = options.maxDegree;
    this.wall = true;
}

Door.prototype = Object.create(Shape.prototype);

// Added methods
Door.prototype.draw = function (context) {
    // Draw circle
    ContextHelper.start(context, this);

    context.arc(
        this.posX,
        this.posY,
        this.radius,
        Math.radians(this.rotation),
        Math.radians(this.rotation + this.maxDegree),
        false
    );


    context.setLineDash([5, 3]);
    ContextHelper.end(context, this);
    context.setLineDash([]);


    // Draw door
    ContextHelper.start(context, this);

    context.moveTo(
        this.posX + this.radius * Math.cos(Math.radians(this.rotation)),
        this.posY + this.radius * Math.sin(Math.radians(this.rotation))
    );

    context.lineTo(
        this.posX,
        this.posY
    );

    context.lineTo(
        this.posX + this.radius * Math.cos(Math.radians(this.rotation + this.maxDegree)),
        this.posY + this.radius * Math.sin(Math.radians(this.rotation + this.maxDegree))
    );

    ContextHelper.end(context, this);
}
// --- Door




// --- Wall Cabinet
var WallCabinet = function (options) {
    Shape.call(this, options);

    this.wall = true;
}

WallCabinet.prototype = Object.create(Shape.prototype);

WallCabinet.prototype.draw = function (context) {
    ContextHelper.start(context, this);

    if (this.rotation == 90 || this.rotation == 270) {
        this.rotation = 0;

        let tmp = this.height;
        this.height = this.width;
        this.width = tmp;
    }

    context.rect(
        this.posX,
        this.posY,
        this.width,
        this.height
    );

    ContextHelper.end(context, this);
}
// --- Wall Cabinet




// --- Floor Cabinet
var FloorCabinet = function (options) {
    Shape.call(this, options);

    this.wall = false;
}

FloorCabinet.prototype = Object.create(Shape.prototype);

FloorCabinet.prototype.draw = function (context) {
    ContextHelper.start(context, this);

    context.rect(
        this.posX,
        this.posY,
        this.width,
        this.height
    );

    ContextHelper.end(context, this);
}
// --- Floor Cabinet





// --- Floor
var Floor = function (options) {
    Shape.call(this, options);
}

Floor.prototype = Object.create(Shape.prototype);

Floor.prototype.draw = function (context) {
    ContextHelper.start(context, this);

    context.rect(
        this.posX,
        this.posY,
        this.width,
        this.height
    );

    ContextHelper.end(context, this);
}
// --- Floor



// --- Context helper
var ContextHelper = {
    start: function (context, shape) {
        context.beginPath();
    },

    end: function (context, shape) {
        if (shape.fillColor !== undefined) {
            context.fillStyle = shape.fillColor;
            context.fill();
        }

        if (shape.strokeColor !== undefined) {
            context.strokeStyle = shape.strokeColor;
            context.stroke();
        }

        context.closePath();
        context.restore();
    }
}
// --- Context helper