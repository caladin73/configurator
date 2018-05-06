var Creator = {

    _shapeTypeClipboard: null,
    _dragState: false,
    _activeShape: {},
    _options: {},
    _context: {},
    _data: {
        shapes: [],
        height: 500,
        width: 500
    },


    _dataSample: {
        shapes: [
            Shape
        ],

        height: 100,
        width: 100
    },


    // Init application
    init: function (options) {
        // Save options
        this._options = options;

        // Init canvas
        this.initCanvas(this._options.canvasId);

        // Init Toolbox
        this.initToolbox(this._options.toolboxId);

        // Register events
        this.registerEvents();
    },


    // Init Empty Canvas
    initCanvas: function (canvasId) {
        var canvas = $(canvasId);
        this._context = canvas.getContext("2d");
    },


    // Init Toolbox with shapes
    initToolbox: function (toolboxId) {
        var toolbox = $("toolbox");
        var canvases = [];

        var html = "";

        for (var key in Shapes) {
            var shape = ShapeFactory.build(Shapes[key], { posX: 22, posY: 0, strokeColor: "#000" });

            html += "<div class='col-sm-12'><h6>" + key + "</h6><canvas id='toolbox-" + Shapes[key] + "' width='" + (shape.width + 25) + "' height='" + shape.height + "'></canvas></div>";

            canvases.push({
                canvasId: "toolbox-" + Shapes[key],
                shape: shape
            });
        }

        // Append canvases
        toolbox.innerHTML = html;

        // Init canvases
        for (var key in canvases) {
            var canvasEl = $(canvases[key].canvasId);
            var context = canvasEl.getContext("2d");

            canvases[key].shape.draw(context);
        }
    },


    // Register events
    registerEvents: function () {
        var self = this;

        // Drag and drop existing objects
        this._context.canvas.onmousedown = function (e) { self._registerOnMouseDown(e) };
        this._context.canvas.onmousemove = function (e) { self._registerOnMouseMove(e) };
        this._context.canvas.onmouseup = function (e) { self._registerOnMouseUp(e) };

        // Buttons
        $("save-btn").addEventListener("click", function () { self.saveData() });
        $("get-btn").addEventListener("click", function () { self.getData() });

        for (var key in Shapes) {
            let shapeType = Shapes[key];

            $("toolbox-" + shapeType).addEventListener("click", function (e) {
                let id = e.target.id;
                id = parseInt(id.split("-")[1]);

                self._shapeTypeClipboard = id;
            });
        }
    },


    // On mouse down
    _registerOnMouseDown: function (event) {
        this._dragState = true;

        var eventData = this._fetchEventData(event);
        console.log(eventData);

        // Get element under mouse
        this._activeShape = this._getElementOnPosition(eventData.x, eventData.y);

        if (this._activeShape != null) {
            this._activeShape.lastPosition = {
                x: this._activeShape.posX,
                y: this._activeShape.posY,
                w: this._activeShape.width,
                h: this._activeShape.height,
                r: this._activeShape.rotation
            };
        }
    },


    // On mouse move
    _registerOnMouseMove: function (event) {
        if (this._dragState == true && this._activeShape != null) {
            var eventData = this._fetchEventData(event);

            this._activeShape.posX = eventData.x;
            this._activeShape.posY = eventData.y;

            this._redrawAll();
        }
    },


    // Redraw all shapes
    _redrawAll: function () {
        this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);

        for (var key in this._data.shapes) {
            let shape = this._data.shapes[key];
            shape.draw(this._context);
        }
    },


    // On mouse down
    _registerOnMouseUp: function (event) {
        this._dragState = false;

        var eventData = this._fetchEventData(event);

        if (this._activeShape != null) {

            let redraw = true;

            if (this._activeShape.wall == true) {
                this._placeToWall();
            }

            if (!this._isValid()) {
                this._activeShape.posX = this._activeShape.lastPosition.x;
                this._activeShape.posY = this._activeShape.lastPosition.y;
                this._activeShape.width = this._activeShape.lastPosition.w;
                this._activeShape.height = this._activeShape.lastPosition.h;
                this._activeShape.rotation = this._activeShape.lastPosition.r;

                this.showError("Cannot place it here :/");
            }

            this._redrawAll();

            this._activeShape = null;
        } else {
            if (this._shapeTypeClipboard != null) {
                let newShape = ShapeFactory.build(this._shapeTypeClipboard, {
                    posX: eventData.x,
                    posY: eventData.y,
                    rotation: 0,
                    strokeColor: "#000"
                });

                this._activeShape = newShape;

                if (this._activeShape.wall == true) {
                    this._placeToWall();
                }

                if (this._isValid()) {
                    this._data.shapes.push(this._activeShape);
                } else {
                    this.showError("Cannot place it here :/");
                }

                this._redrawAll();
                this._redrawPrice();
            }
        }
    },


    // Place shape to wall
    _placeToWall: function () {
        let offsetX = this._activeShape.posX;
        let offsetY = this._activeShape.posY;
        let offsetX2 = this._context.canvas.width - (this._activeShape.posX + this._activeShape.width);
        let offsetY2 = this._context.canvas.height - (this._activeShape.posY + this._activeShape.height);

        let min = Math.min(offsetX, offsetY, offsetX2, offsetY2);

        if (min == offsetX) {

            if (this._activeShape.width > this._activeShape.height) {
                this._activeShape.rotate(90, this._context);
            }

            this._activeShape.posX = 0;
        } else if (min == offsetY) {

            if (this._activeShape.width < this._activeShape.height) {
                this._activeShape.rotate(90, this._context);
            }

            this._activeShape.posY = 0;
        } else if (min == offsetX2) {

            if (this._activeShape.width > this._activeShape.height) {
                this._activeShape.rotate(90, this._context);
            }

            this._activeShape.posX = this._context.canvas.width - this._activeShape.width;
        } else if (min == offsetY2) {

            if (this._activeShape.width < this._activeShape.height) {
                this._activeShape.rotate(90, this._context);
            }

            this._activeShape.posY = this._context.canvas.height - this._activeShape.height;
        }
    },


    // Is position valid
    _isValid: function () {

        // Check if shape is within canvas
        if ((this._activeShape.posX < 0 && this._activeShape.posX > this._context.canvas.width) || // Is pos x out canvas
            (this._activeShape.posY < 0 && this._activeShape.posY > this._context.canvas.height) || // Is pos y in canvas
            (this._activeShape.posX + this._activeShape.width > this._context.canvas.width) || // Is end of shape in width of canvas
            (this._activeShape.posY + this._activeShape.height > this._context.canvas.height) // Is end of shape in width of canvas
        ) {
            return false;
        }

        // Check for collisions
        for (var key in this._data.shapes) {
            let shape = this._data.shapes[key];

            if (shape == this._activeShape) {
                continue;
            }

            if (
                this._shapeContainsPoint(this._activeShape.posX, this._activeShape.posY, shape) || // Left upper corner
                this._shapeContainsPoint(this._activeShape.posX + this._activeShape.width, this._activeShape.posY, shape) || // Right upper corner
                this._shapeContainsPoint(this._activeShape.posX, this._activeShape.posY + this._activeShape.height, shape) || // Left bottom corner
                this._shapeContainsPoint(this._activeShape.posX + this._activeShape.width, this._activeShape.posY + this._activeShape.height, shape)) // Right bottom corner
            {
                return false;
            }
        }

        return true;
    },


    // Check if point is within object
    _shapeContainsPoint: function (x, y, shape) {
        if (x >= shape.posX && x <= shape.posX + shape.width &&
            y >= shape.posY && y <= shape.posY + shape.height) {
            return true;
        }

        return false;
    },


    _redrawPrice: function () {
        var totalPrice = 0;

        for (var key in this._data.shapes) {
            let shape = this._data.shapes[key];

            totalPrice += shape.price;
        }

        $("total-price").innerHTML = totalPrice;
    },

    // Get element on position
    _getElementOnPosition: function (posX, posY) {
        var self = this;

        for (var key in self._data.shapes) {
            let shape = self._data.shapes[key];

            if ((posX >= shape.posX && posY >= shape.posY) &&
                (posX <= shape.posX + shape.width && posY <= shape.posY + shape.height)) {

                return shape;
            }
        }
    },


    // Fetch event data
    _fetchEventData: function (event) {
        return {
            x: event.offsetX,
            y: event.offsetY
        };
    },


    // Load data
    loadData: function (data) {
        this._data = data;

        for (var key in this._data.shapes) {
            let shape = this._data.shapes[key];
            this._data.shapes[key] = ShapeFactory.build(shape.type, shape);
        }

        this._redrawAll();
        this._redrawPrice();

        this.showSuccess("Data successfully loaded");
    },


    // Get data
    getData: function () {
        var self = this;

        let id = $("data-id").value;

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                self.loadData(JSON.parse(this.responseText));
            } else if (this.readyState == 500) {
                self.showError("Could not load data");
            }
        };

        xhttp.open("GET", this._options.getUrl + "?id=" + id, true);
        xhttp.send();
    },


    // Save data
    saveData: function () {
        var self = this;

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                self.showSuccess("Data successfully saved");
            } else if (this.readyState == 500) {
                self.showError("Could not save data");
            }
        };

        xhttp.open("POST", this._options.saveUrl, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("data=" + JSON.stringify(self._data));
    },


    // Show feedback message
    showSuccess: function (message) {
        $("message").innerHTML = message;
        $("message").style.background = "green";

        $("message").style.display = "block";
    },


    // Show error message
    showError: function (message) {
        $("message").innerHTML = message;
        $("message").style.background = "red";

        $("message").style.display = "block";
    },


    // Clear canvas
    clear: function () {
        this.context;
    },


    // Get canvas height
    getHeight: function () {
        return this.context.height;
    },


    // Get canvas width
    getWidth: function () {
        return this.canvas.width;
    }
}


// Load creator
window.onload = function () {
    Creator.init({
        canvasId: "floor",
        toolboxId: "toolbox",
        getUrl: "../../inc/php/get.php",
        saveUrl: "../../inc/php/save.php",

    });
}


// Create floor from inputs
function create_floor() {
    Creator._data.shapes = [];
    Creator._data.width = $("width").value;
    Creator._data.height = $("length").value;

    Creator._redrawPrice();

    $("floor").height = $("length").value;
    $("floor").width = $("width").value;
}