
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
const RockMaterial = new Material('rock', 5.0, '#7d6d61', true);
const SandMaterial = new Material('sand', 3.0, '#edc677', true);
const LavaMaterial = new Material('lava', 2.0, '#852220', false);
const WaterMaterial = new Material('water', 1.0, '#77b0ed', false);
const OilMaterial = new Material('oil', 0.5, '#ada88e', false);
const SteamMaterial = new Material('steam', 0.1, '#bee6e5', false);

var selectedMaterial = WallMaterial;

class Pixel {
    constructor(x, y, material) {
        this.x = x;
        this.y = y;
        this.material = material;
        this.updated = true;
        this.times_moved = 0;
        this.frozen = false;
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
        this.pixels.del([pixel.x, pixel.y]);
    }

    movePixel(x, y, pixel) {
        var dest = this.getPixel(x, y);
        if (dest)
            this.insertPixel(pixel.x, pixel.y, dest);
        else
            this.removePixel(pixel);
        this.insertPixel(x, y, pixel);
    }

    update(pixel) {

        var checkMoves = [];
        var firstSide = random() < 0.5 ? 1 : -1;
        var secondSide = firstSide > 0 ? -1 : 1;

        if (pixel.material.name != 'wall' && pixel.material.name != 'steam') {
            checkMoves.push([pixel.x, pixel.y + 1]);
        }

        if (pixel.material.name == 'steam') {
            checkMoves.push([pixel.x, pixel.y - 1]);
            checkMoves.push([pixel.x + firstSide, pixel.y - 1]);
            checkMoves.push([pixel.x + secondSide, pixel.y - 1]);
        }

        if (pixel.material.name == 'sand'
            || pixel.material.name == 'lava'
            || pixel.material.name == 'water'
            || pixel.material.name == 'oil') {
            checkMoves.push([pixel.x + firstSide, pixel.y + 1]);
            checkMoves.push([pixel.x + secondSide, pixel.y + 1]);
        }

        if (pixel.material.name == 'lava'
            || pixel.material.name == 'water'
            || pixel.material.name == 'oil'
            || pixel.material.name == 'steam') {
            checkMoves.push([pixel.x + firstSide, pixel.y]);
            checkMoves.push([pixel.x + secondSide, pixel.y]);
        }

        if (!checkMoves.length) pixel.updated = true;

        for (var move of checkMoves) {
            if (!this.inBounds(move[0], move[1])) continue;

            var destPixel = this.pixels.get([move[0], move[1]]);
            var destIsPixel = this.pixels.has([move[0], move[1]]);
            var destIsEqualY = move[1] == pixel.y;
            var destIsDirtyPixel = destIsPixel && !destPixel.updated;
            var destIsHigherDensity = destIsPixel && destPixel.material.density > pixel.material.density;
            var destIsLowerDensity = destIsPixel && destPixel.material.density < pixel.material.density;

            var canOscillate = destIsEqualY && !pixel.material.solid &&
                (!destIsPixel || destPixel.material.solid == pixel.material.solid);
            if (canOscillate && pixel.times_moved > this.nrCols) {
                pixel.frozen = true;
                break;
            }

            pixel.frozen = false;

            if (!destIsPixel) {
                this.movePixel(move[0], move[1], pixel);
                pixel.times_moved = destIsEqualY ? pixel.times_moved + 1 : 0;
                pixel.updated = true;
                break;
            } else if (!destPixel.material.solid) {
                if ((destIsHigherDensity && move[1] < pixel.y) || (destIsLowerDensity && move[1] > pixel.y)) {
                    this.movePixel(move[0], move[1], pixel);
                    destPixel.times_moved = destIsEqualY ? destPixel.times_moved + 1 : 0;
                    pixel.times_moved = destIsEqualY ? pixel.times_moved + 1 : 0;
                    destPixel.updated = true;
                    pixel.updated = true;
                    break;
                }
            }


        }

    }

    dirtify() {
        this.visit_pixels(function (w, x, y, p) {
            p.updated = false;
        });
    }

    isDirty() {
        return this.pixels.each(function (k, v) {
            return (!v.updated);
        }, true);
    }

    visit_grid(func) {
        var self = this;
        for (var y = this.nrRows - 1; y >= 0; y--) {
            for (var x = frameCount % 2 == 0 ? 0 : this.nrCols - 1;
                frameCount % 2 == 0 ? x < this.nrCols : x >= 0;
                frameCount % 2 == 0 ? x++ : x--)
                func(self, x, y);
        }

    }

    visit_pixels(func, dirty_only) {
        this.visit_grid(function (w, x, y) {
            var p = w.getPixel(x, y);
            if (p != undefined) {
                if (!dirty_only || !p.updated)
                    func(w, x, y, p);
            }
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
        materialButton('Rock', RockMaterial, 60, this);
        materialButton('Sand', SandMaterial, 120, this);
        materialButton('Water', WaterMaterial, 180, this);
        materialButton('Oil', OilMaterial, 240, this);
        materialButton('Lava', LavaMaterial, 310, this);
        materialButton('Steam', SteamMaterial, 360, this);
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
        }, true);

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
                if (!p.frozen) return;
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
            if (this.world.getPixel(x, y))
                this.world.removePixel(this.world.getPixel(x, y));
        } else {
            this.world.insertPixel(x, y, new Pixel(x, y, selectedMaterial));
            this.world.insertPixel(x, y + 1, new Pixel(x, y + 1, selectedMaterial));
            this.world.insertPixel(x, y - 1, new Pixel(x, y - 1, selectedMaterial));
            this.world.insertPixel(x + 1, y, new Pixel(x + 1, y, selectedMaterial));
            this.world.insertPixel(x - 1, y, new Pixel(x - 1, y, selectedMaterial));
        }
    }

    mouseReleased() {

    }

    keyPressed() {
        if (key == 'd') {
            this.debug = !this.debug;
        }
    }

    drawAll() {
        this.drawBoard();
        this.drawGems();
        this.drawScore();
        this.drawGrabbedTile();
    }

}







