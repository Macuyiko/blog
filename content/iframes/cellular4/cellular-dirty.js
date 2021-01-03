
function HashTable() {
    this.hashes = {};
}

HashTable.prototype = {
    constructor: HashTable,

    set: function (key, value) {
        this.hashes[JSON.stringify(key)] = value;
    },

    get: function (key) {
        return this.hashes[JSON.stringify(key)];
    },

    has: function (key) {
        return this.get(key) != undefined;
    },

    del: function (key) {
        delete this.hashes[JSON.stringify(key)];
    },

    each: function (func, early_return) {
        for (var key in this.hashes) {
            if (this.hashes.hasOwnProperty(key)) {
                var r = func(key, this.hashes[key]);
                if (early_return && r) return r;
            }
        }
    }
};

class Material {
    constructor(name, density, color, solid) {
        this.name = name;
        this.density = density;
        this.color = color;
        this.solid = solid;
    }
}

const WallMaterial = new Material('wall', 10.0, '#8a522b', true);
const SandMaterial = new Material('sand', 3.0, '#edc677', true);
const WaterMaterial = new Material('water', 1.0, '#77b0ed', false);

var selectedMaterial = WallMaterial;

class Pixel {
    constructor(x, y, material) {
        this.x = x;
        this.y = y;
        this.material = material;
        this.dirty = false;
    }
}

class World {
    constructor(nrCols, nrRows) {
        this.nrCols = nrCols;
        this.nrRows = nrRows;
        this.pixels = new HashTable();
    }

    inBounds(x, y) {
        return x >= 0 && y >= 0 && x < this.nrCols && y < this.nrRows
    }

    getPixel(x, y) {
        if (!this.pixels.has([x, y]))
            return undefined;
        return this.pixels.get([x, y]);
    }

    insertPixel(x, y, pixel) {
        if (!this.inBounds(x, y)) return;
        pixel.x = x;
        pixel.y = y;
        this.pixels.set([x, y], pixel);
    }

    removePixel(pixel) {
        if (pixel)
            this.pixels.del([pixel.x, pixel.y]);
    }

    movePixel(x, y, pixel) {
        var dest = this.getPixel(x, y);
        if (dest)
            this.insertPixel(pixel.x, pixel.y, dest);
        else
            this.removePixel(pixel);
        this.insertPixel(x, y, pixel);
        pixel.dirty = true;
    }

    update(pixel) {
        var checkMoves = [];
        var firstSide = 1;
        var secondSide = -1;

        if (pixel.dirty) return;

        if (pixel.material.name != 'wall') {
            checkMoves.push([pixel.x, pixel.y + 1]);
            checkMoves.push([pixel.x + firstSide, pixel.y + 1]);
            checkMoves.push([pixel.x + secondSide, pixel.y + 1]);
        }

        if (pixel.material.name == 'water') {
            checkMoves.push([pixel.x + firstSide, pixel.y]);
            checkMoves.push([pixel.x + secondSide, pixel.y]);
        }

        for (var move of checkMoves) {
            if (!this.inBounds(move[0], move[1])) continue;
            var destIsPixel = this.pixels.has([move[0], move[1]]);
            if (!destIsPixel) {
                this.movePixel(move[0], move[1], pixel);
                break;
            }
        }
    }

    dirtify() {
        this.visit_pixels(function (w, x, y, p) {
            p.dirty = false;
        });
    }

    visit_grid(func) {
        var self = this;
        for (var y = this.nrRows - 1; y >= 0; y--)
            for (var x = 0; x < this.nrCols; x++)
                func(self, x, y);
    }

    visit_pixels(func) {
        this.visit_grid(function (w, x, y) {
            var p = w.getPixel(x, y);
            if (p) func(w, x, y, p);
        });
    }

}

class Game {
    constructor(world, pixelsPerSquare) {
        this.world = world;
        this.pixelsPerSquare = pixelsPerSquare;
        this.debug = false;
    }

    setup() {
        createCanvas(
            this.pixelsPerSquare * this.world.nrCols,
            this.pixelsPerSquare * this.world.nrRows + 40
        );
        colorMode(HSB);
        background(100);

        function materialButton(name, material, pos, game) {
            game[name + "Button"] = createButton(name);
            game[name + "Button"].position(pos, game.pixelsPerSquare * game.world.nrRows + 20);
            game[name + "Button"].mousePressed(function () { selectedMaterial = material; });
        }

        materialButton('Wall', WallMaterial, 10, this);
        materialButton('Sand', SandMaterial, 120, this);
        materialButton('Water', WaterMaterial, 180, this);
        materialButton('Eraser', undefined, 500, this);
    }

    draw() {
        var game = this;

        // Draw the grid
        this.world.visit_grid(function (w, x, y) {
            stroke(80);
            fill(100);
            square(
                x * game.pixelsPerSquare,
                y * game.pixelsPerSquare,
                game.pixelsPerSquare);
        });

        // Update the pixels
        this.world.dirtify();
        this.world.visit_pixels(function (w, x, y, p) {
            w.update(p);
        });

        // Draw the pixels
        this.world.visit_pixels(function (w, x, y, p) {
            stroke(80);
            fill(p.material.color);
            square(
                x * game.pixelsPerSquare,
                y * game.pixelsPerSquare,
                game.pixelsPerSquare);
        });

        if (this.debug) {
            this.world.visit_pixels(function (w, x, y, p) {
                stroke(80);
                fill(10);
                square(
                    x * game.pixelsPerSquare,
                    y * game.pixelsPerSquare,
                    game.pixelsPerSquare);
            });
        }
    }

    mousePressed() {

    }

    mouseDragged() {
        var x = floor(mouseX / this.pixelsPerSquare);
        var y = floor(mouseY / this.pixelsPerSquare);

        if (!selectedMaterial) {
            this.world.removePixel(this.world.getPixel(x, y));
            this.world.removePixel(this.world.getPixel(x, y + 1));
            this.world.removePixel(this.world.getPixel(x, y - 1));
            this.world.removePixel(this.world.getPixel(x + 1, y));
            this.world.removePixel(this.world.getPixel(x - 1, y));
        } else {
            this.world.insertPixel(x, y, new Pixel(x, y, selectedMaterial));
            if (!selectedMaterial.solid) {
                this.world.insertPixel(x, y + 1, new Pixel(x, y + 1, selectedMaterial));
                this.world.insertPixel(x, y - 1, new Pixel(x, y - 1, selectedMaterial));
                this.world.insertPixel(x + 1, y, new Pixel(x + 1, y, selectedMaterial));
                this.world.insertPixel(x - 1, y, new Pixel(x - 1, y, selectedMaterial));
            }
        }
    }

    mouseReleased() {

    }

    keyPressed() {
        if (key == 'd') {
            this.debug = !this.debug;
        }
    }

}







