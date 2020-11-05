var game;

class Board {
    constructor(nrCols, nrRows, nrGemTypes) {
        this.nrCols = nrCols;
        this.nrRows = nrRows;
        this.nrGemTypes = nrGemTypes;
        this.grid = [];

        for (var x = 0; x < this.nrCols; x++) {
            var line = [];
            for (var y = 0; y < this.nrRows; y++) {
                line.push(-1);
            }
            this.grid.push(line);
        }
    }

    copy() {
        var copy = new Board(this.nrCols, this.nrRows, this.nrGemTypes);
        for (var x = 0; x < this.nrCols; x++) {
            for (var y = 0; y < this.nrRows; y++) {
                copy.setTile(x, y, this.getTile(x, y));
            }
        }
        return copy;
    }

    getTile(x, y) {
        if (x < 0 || y < 0 || x > gridSize - 1 || y > gridSize - 1)
            return -2;
        return this.grid[x][y];
    }

    setTile(x, y, val) {
        if (x < 0 || y < 0 || x > gridSize - 1 || y > gridSize - 1)
            return;
        if (val >= this.nrGemTypes || val < -1)
            return;
        this.grid[x][y] = val;
    }

    visit(func) {
        var self = this;
        for (var x = 0; x < this.nrCols; x++) {
            for (var y = 0; y < this.nrRows; y++) {
                func(self, x, y);
            }
        }
    }

    getMatches() {
        var patterns = [
            [[-1, 0], [-2, 0]],
            [[-1, 0], [+1, 0]],
            [[+1, 0], [+2, 0]],
            [[0, -1], [0, -2]],
            [[0, -1], [0, +1]],
            [[0, +1], [0, +2]],
        ];
        var matches = [];
        for (var x = 0; x < this.nrCols; x++) {
            for (var y = 0; y < this.nrRows; y++) {
                var thisTile = this.getTile(x, y);
                if (thisTile < 0) continue;
                for (var pattern of patterns) {
                    var thatTile1 = this.getTile(x + pattern[0][0], y + pattern[0][1]);
                    var thatTile2 = this.getTile(x + pattern[1][0], y + pattern[1][1]);
                    if (thisTile == thatTile1 && thisTile == thatTile2) {
                        matches.push({ x: x, y: y });
                    }
                }
            }
        }
        return matches;
    }

    getFallingColumns() {
        var drops = [];
        var tilesAbove = function (board, x, y_this) {
            for (var yy = y_this - 1; yy >= 0; yy -= 1) {
                if (board.getTile(x, yy) >= 0) {
                    return true;
                }
            }
            return false;
        }
        for (var x = 0; x < this.nrCols; x++) {
            for (var y = this.nrRows - 1; y >= 0; y--) {
                var thisTile = this.getTile(x, y);
                if (thisTile >= 0) continue;
                if (tilesAbove(this, x, y)) {
                    var replacement = [-1];
                    for (var yy = 0; yy < this.nrRows; yy += 1) {
                        if (y != yy)
                            replacement.push(this.getTile(x, yy));
                    }
                    drops.push({ x: x, y: y, replacement: replacement });
                }
                break;
            }
        }
        return drops;
    }

    getNonFullTopRowColumns() {
        var drops = [];
        for (var x = 0; x < this.nrCols; x++) {
            var thisTile = this.getTile(x, 0);
            if (thisTile >= 0) continue;
            drops.push({ x: x, y: 0 });
        }
        return drops;
    }

    removeMatches(matches) {
        for (match of matches) {
            this.setTile(match.x, match.y, -1);
        }
    }

    swapIfValid(x1, y1, x2, y2) {
        var t1 = this.getTile(x1, y1);
        var t2 = this.getTile(x2, y2);
        this.setTile(x1, y1, t2);
        this.setTile(x2, y2, t1);
        if (this.getMatches().length) {
            return true;
        } else {
            this.setTile(x1, y1, t1);
            this.setTile(x2, y2, t2);
            return false;
        }
    }

    swap(x1, y1, x2, y2) {
        var t1 = this.getTile(x1, y1);
        var t2 = this.getTile(x2, y2);
        this.setTile(x1, y1, t2);
        this.setTile(x2, y2, t1);
    }

    getPossibleMoves(stopAfterFirst) {
        var moves = [];
        var patterns = [
            [-1, 0],
            [+1, 0],
            [0, -1],
            [0, +1],
        ];
        for (var x = 0; x < this.nrCols; x++) {
            for (var y = this.nrRows - 1; y >= 0; y--) {
                var thisTile = this.getTile(x, y);
                if (thisTile < 0) continue;
                for (var pattern of patterns) {
                    var thatTile = this.getTile(x + pattern[0], y + pattern[1]);
                    if (thatTile < 0) continue;
                    this.swap(x, y, x + pattern[0], y + pattern[1]);
                    if (this.getMatches().length) {
                        moves.push(
                            {
                                x1: x, y1: y,
                                x2: x + pattern[0], y2: y + pattern[1]
                            }
                        );
                    }
                    this.swap(x, y, x + pattern[0], y + pattern[1]);
                    if (moves.length && stopAfterFirst)
                        return moves;
                }
            }
        }
        return moves;
    }
}

class BoardFiller {
    constructor(board) {
        this.board = board;
    }

    fill(x, y) {
        var tile = floor(random(this.board.nrGemTypes));
        this.board.setTile(x, y, tile);
        return true;
    }

    getCorrectY(x, y) {
        var correct_y = y;
        for (var cy = y; cy < this.board.nrRows; cy++) {
            var thisTile = this.board.getTile(x, cy);
            if (thisTile < 0) correct_y = cy;
            else break;
        }
        return correct_y;
    }
}

class GreedyMoveMinBoardFiller extends BoardFiller {
    constructor(board) {
        super(board);
    }

    fill(x, y) {
        var correctY = this.getCorrectY(x, y);
        var bestTile = floor(random(this.board.nrGemTypes));
        var bestMoves = -1;
        var tileIdx = [];
        for (var tile = 0; tile < this.board.nrGemTypes; tile++) tileIdx.push(tile);
        while (tileIdx.length) {
            var tile = tileIdx.splice(floor(random(tileIdx.length)), 1)[0];
            this.board.setTile(x, correctY, tile);
            var nrMatches = this.board.getMatches().length;
            var nrMoves = this.board.getPossibleMoves(false).length;
            this.board.setTile(x, correctY, -1);
            if (nrMatches) {
                continue;
            }
            if (bestMoves == -1 || nrMoves < bestMoves) {
                bestMoves = nrMoves;
                bestTile = tile;
            }
        }
        this.board.setTile(x, y, bestTile);
        return false;
    }
}

class RecursiveMoveMinBoardFiller extends BoardFiller {
    constructor(board) {
        super(board);
    }

    recurse(currentBoard, position, originalBoard, bestBoard, bestMoves) {
        var current = currentBoard.copy();
        var nrMoves = current.getPossibleMoves(false).length;
        this.budget += 1;

        // Greedy stops
        if (bestMoves == 0 && bestBoard != undefined)
            return { bestBoard: bestBoard, bestMoves: bestMoves };
        if (bestBoard != undefined && this.budget >=
            originalBoard.nrGemTypes * originalBoard.nrGemTypes *
            originalBoard.nrGemTypes * originalBoard.nrGemTypes)
            return { bestBoard: bestBoard, bestMoves: bestMoves };

        // End condition
        if (position.y >= current.nrRows) {
            if (bestBoard == undefined || nrMoves <= bestMoves) {
                bestBoard = current;
                bestMoves = nrMoves;
            }
            return { bestBoard: bestBoard, bestMoves: bestMoves };
        }

        var newpos = { x: position.x + 1, y: position.y };
        if (newpos.x >= current.nrCols) {
            newpos.x = 0;
            newpos.y += 1;
        }

        // Branching
        var setTile = originalBoard.getTile(position.x, position.y);
        current.setTile(position.x, position.y, setTile);
        if (setTile < 0) {
            for (var tile = 0; tile < current.nrGemTypes; tile++) {
                current.setTile(position.x, position.y, tile);
                var nrMoves = current.getPossibleMoves(false).length;
                if (bestBoard != undefined && nrMoves >= bestMoves) continue;
                var bo = this.recurse(current, newpos, originalBoard, bestBoard, bestMoves);
                bestBoard = bo.bestBoard;
                bestMoves = bo.bestMoves;
            }
        } else {
            var bo = this.recurse(current, newpos, originalBoard, bestBoard, bestMoves);
            bestBoard = bo.bestBoard;
            bestMoves = bo.bestMoves;
        }

        return { bestBoard: bestBoard, bestMoves: bestMoves };
    }

    fill(x, y) {
        var correctY = this.getCorrectY(x, y);
        var original = board.copy();
        var current = board.copy();
        var position = { x: 0, y: 0 };
        var nrMoves = original.getPossibleMoves(false).length;
        this.budget = 0;
        var bo = this.recurse(current, position, original, undefined, nrMoves);
        this.board.setTile(x, y, bo.bestBoard.getTile(x, correctY));
        return false;
    }
}

class MatchMaxBoardFiller extends BoardFiller {
    constructor(board) {
        super(board);
    }

    fill(x, y) {
        var correctY = this.getCorrectY(x, y);
        var bestTile = floor(random(this.board.nrGemTypes));
        var bestMatches = -1;
        var tileIdx = [];
        for (var tile = 0; tile < this.board.nrGemTypes; tile++) tileIdx.push(tile);
        while (tileIdx.length) {
            var tile = tileIdx.splice(floor(random(tileIdx.length)), 1)[0];
            this.board.setTile(x, correctY, tile);
            var nrMatches = this.board.getMatches().length;
            this.board.setTile(x, correctY, -1);
            if (bestMatches == -1 || nrMatches >= bestMatches) {
                bestMatches = nrMatches;
                bestTile = tile;
            }
        }
        this.board.setTile(x, y, bestTile);
        return false;
    }
}

class RandomizedMatchMaxBoardFiller extends BoardFiller {
    constructor(board) {
        super(board);
    }

    fill(x, y) {
        var correctY = this.getCorrectY(x, y);
        var bestTile = floor(random(this.board.nrGemTypes));
        var bestMatches = -1;
        var tileIdx = [];
        for (var tile = 0; tile < this.board.nrGemTypes; tile++) tileIdx.push(tile);
        while (tileIdx.length) {
            var tile = tileIdx.splice(floor(random(tileIdx.length)), 1)[0];
            this.board.setTile(x, correctY, tile);
            var nrMatches = this.board.getMatches().length;
            this.board.setTile(x, correctY, -1);
            if ((bestMatches == -1 || nrMatches >= bestMatches) &&
                (random() < this.slider.value())) {
                bestMatches = nrMatches;
                bestTile = tile;
                console.log(x, y, bestMatches, bestTile)
            }
        }
        this.board.setTile(x, y, bestTile);
        return false;
    }
}

class Animation {
    constructor(duration, funcStart, funcStep, funcEnd) {
        this.duration = duration;
        this.timeLeft = duration;
        this.funcStart = funcStart;
        this.funcStep = funcStep;
        this.funcEnd = funcEnd;
    }

    step() {
        if (this.timeLeft == this.duration && this.funcStart != undefined)
            this.funcStart();
        if (this.funcStep != undefined)
            this.funcStep();
        this.timeLeft -= deltaTime;
        if (this.timeLeft <= 0 && this.funcEnd != undefined)
            this.funcEnd();
    }
}

class DropAnimation extends Animation {
    constructor(game, drops) {
        super(5);

        this.funcEnd = function () {
            for (var drop of drops) {
                for (var y = 0; y < game.board.nrRows; y += 1) {
                    game.board.setTile(drop.x, y, drop.replacement[y]);
                }
            }
        }
    }
}

class FillAnimation extends Animation {
    constructor(game, fills, filler) {
        super(5);

        this.funcEnd = function () {
            var fill = fills[floor(random(0, fills.length))];
            for (var fill of fills) {
                if (!filler.fill(fill.x, fill.y))
                    break;
            }
        }
    }
}

class MatchAnimation extends Animation {
    constructor(game, matches) {
        super(100);

        var Particle = function (ox, oy, x1, y1, x2, y2, x3, y3, fclr) {
            this.velocity = createVector(random(-1, 1), random(-1, 1));
            this.rotation = random(-1, 1);
            this.ox = ox;
            this.oy = oy;
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.x3 = x3;
            this.y3 = y3;
            this.fclr = fclr;
        }

        Particle.prototype.draw = function (timeLeft, duration) {
            push();
            translate(this.ox, this.oy);
            rotate(PI * (timeLeft / duration) * this.rotation);
            fill(this.fclr);
            stroke(color(hue(this.fclr), saturation(this.fclr), brightness(this.fclr) - 10));
            triangle(
                this.x1,
                this.y1,
                this.x2,
                this.y2,
                this.x3,
                this.y3
            );
            this.x1 += this.velocity.x;
            this.x2 += this.velocity.x;
            this.x3 += this.velocity.x;
            this.y1 += this.velocity.y;
            this.y2 += this.velocity.y;
            this.y3 += this.velocity.y;
            pop();
        };

        this.particles = [];
        for (var match of matches) {
            var ox = match.x * game.pixelsPerSquare + game.pixelsPerSquare / 2;
            var oy = match.y * game.pixelsPerSquare + game.pixelsPerSquare / 2;
            var thisTile = game.board.getTile(match.x, match.y);
            var fclr = color(gemColors[thisTile]);

            for (var p = 0; p < 3; p++) {
                var x1 = random(-10, 10);
                var x2 = random(-10, 10);
                var x3 = random(-10, 10);
                var y1 = random(-10, 10);
                var y2 = random(-10, 10);
                var y3 = random(-10, 10);
                var particle = new Particle(ox, oy, x1, y1, x2, y2, x3, y3, fclr);
                this.particles.push(particle);
            }
        }

        this.funcStep = function () {
            for (var particle of this.particles) {
                particle.draw(this.timeLeft, this.duration);
            }
        }

        this.funcEnd = function () {
            game.score += matches.length;
            game.board.removeMatches(matches);
            game.matches = undefined;
        }
    }
}

class Game {
    constructor(board, pixelsPerSquare, initializer, filler) {
        this.pixelsPerSquare = pixelsPerSquare;
        this.board = board;
        this.score = 0;
        this.animations = [];
        this.initializing = true;
        this.settled = false;
        this.grabbedTile = undefined;
        this.destionationTile = undefined;
        this.matches = undefined;
        this.initializer = undefined;
        this.filler = undefined;
        this.initializer = initializer;
        this.filler = filler;
        if (initializer === undefined)
            this.initializer = new BoardFiller(this.board);
        if (filler === undefined)
            this.filler = new BoardFiller(this.board);
    }

    setup() {
        createCanvas(
            this.pixelsPerSquare * this.board.nrCols,
            this.pixelsPerSquare * this.board.nrRows + 20
        );
        colorMode(HSB);
        background(100);

        console.log(typeof this.filler);

        if (this.filler.constructor.name == RandomizedMatchMaxBoardFiller.name) {
            this.filler.slider = createSlider(0, 1, 0.5, 0.05);
            this.filler.slider.style('width', '200px');
        }
    }

    draw() {
        if (this.grabbedTile != undefined)
            this.drawAll();

        if (this.settled) return true;

        if (this.handledAnimationsState()) return true;
        if (this.handleDroppingState()) return true;
        if (this.handleFillingState()) return true;
        if (this.handleMatchesState()) return true;

        this.settled = true;
        this.initializing = false;

        this.drawAll();
    }

    mousePressed() {
        if (!this.settled) return;
        this.grabbedTile = {
            x: floor(mouseX / this.pixelsPerSquare),
            y: floor(mouseY / this.pixelsPerSquare),
        };

        if (this.board.getTile(this.grabbedTile.x, this.grabbedTile.y) < 0) {
            this.grabbedTile = undefined;
        }
    }

    mouseDragged() {
        if (!this.settled) return;
        if (this.grabbedTile == undefined) return;

        this.destionationTile = undefined;

        var x = floor(mouseX / this.pixelsPerSquare);
        var y = floor(mouseY / this.pixelsPerSquare);

        if (this.board.getTile(x, y) < 0) return;

        if (
            (x == this.grabbedTile.x - 1 && y == this.grabbedTile.y) ||
            (x == this.grabbedTile.x + 1 && y == this.grabbedTile.y) ||
            (x == this.grabbedTile.x && y == this.grabbedTile.y - 1) ||
            (x == this.grabbedTile.x && y == this.grabbedTile.y + 1)
        ) {
            this.destionationTile = {
                x: floor(mouseX / this.pixelsPerSquare),
                y: floor(mouseY / this.pixelsPerSquare),
            };
        }
    }

    mouseReleased() {
        if ((!this.settled) ||
            (this.grabbedTile == undefined) ||
            (this.destionationTile == undefined)) {
            this.grabbedTile = undefined;
            this.destionationTile = undefined;
            this.settled = false;
            return;
        }

        if (this.board.swapIfValid(
            this.grabbedTile.x, this.grabbedTile.y,
            this.destionationTile.x, this.destionationTile.y
        )) {
            this.settled = false;
        }

        this.grabbedTile = undefined;
        this.destionationTile = undefined;

        this.drawBoard();
        this.drawGems();
        this.drawScore();
    }

    keyPressed() {
        if (!this.settled) return;

        if (key == 'r') {
            this.board.visit(function (b, x, y) { b.setTile(x, y, -1); });
            this.initializing = true;
        }
        if (key == 'a') {
            var move = this.board.getPossibleMoves(true)[0];
            if (move == undefined) return;
            this.board.swapIfValid(move.x1, move.y1, move.x2, move.y2);
        }

        this.settled = false;
    }

    drawAll() {
        this.drawBoard();
        this.drawGems();
        this.drawScore();
        this.drawGrabbedTile();
    }

    handleFillingState() {
        this.drawAll();
        var fills = this.board.getNonFullTopRowColumns();
        if (fills.length) {
            this.animations.push(new FillAnimation(
                this, fills,
                this.initializing ? this.initializer : this.filler)
            );
            return true;
        }
        return false;
    }

    handleDroppingState() {
        this.drawAll();
        var drops = this.board.getFallingColumns();
        if (drops.length) {
            this.animations.push(new DropAnimation(this, drops));
            return true;
        }
        return false;
    }

    handleMatchesState() {
        this.drawAll();
        var matches = this.board.getMatches();
        if (matches.length) {
            this.animations.push(new MatchAnimation(this, matches));
            this.matches = matches;
            return true;
        }
        return false;
    }

    handledAnimationsState() {
        if (this.animations.length) {
            this.drawAll();
            for (var animation of this.animations) {
                animation.step();
            }
            for (var a = 0; a < this.animations.length; a++) {
                if (this.animations[a].timeLeft <= 0)
                    this.animations.splice(a, 1);
            }
            return true;
        }
        return false;
    }

    drawGrabbedTile() {
        if (this.grabbedTile == undefined) return;

        var gemSize = this.pixelsPerSquare * 0.3;
        var gemOffset = this.pixelsPerSquare / 2;

        var thisTile = this.board.getTile(this.grabbedTile.x, this.grabbedTile.y);
        var fclr = color(gemColors[thisTile]);
        fill(fclr);
        stroke(color(hue(fclr), saturation(fclr), brightness(fclr) - 10));
        ellipse(mouseX, mouseY, gemSize, gemSize);

        if (this.destionationTile == undefined) return;
        var thisTile = this.board.getTile(this.destionationTile.x, this.destionationTile.y);
        var fclr = color(gemColors[thisTile]);
        fill(fclr);
        stroke(color(hue(fclr), saturation(fclr), brightness(fclr) - 10));
        ellipse(
            this.grabbedTile.x * this.pixelsPerSquare + gemOffset,
            this.grabbedTile.y * this.pixelsPerSquare + gemOffset,
            gemSize,
            gemSize
        );
    }

    drawBoard() {
        stroke(255);
        strokeWeight(4);
        var self = this;
        this.board.visit(function (b, x, y) {
            if (x % 2 + y % 2 == 1)
                fill(97);
            else
                fill(91);
            rect(
                x * self.pixelsPerSquare,
                y * self.pixelsPerSquare,
                self.pixelsPerSquare,
                self.pixelsPerSquare
            );
        });
    }

    drawGems() {
        strokeWeight(2);
        var self = this;
        var gemSize = this.pixelsPerSquare * 0.3;
        var gemOffset = this.pixelsPerSquare / 2;
        this.board.visit(function (b, x, y) {
            if (self.grabbedTile != undefined && self.grabbedTile.x == x && self.grabbedTile.y == y)
                return;
            if (self.destionationTile != undefined && self.destionationTile.x == x && self.destionationTile.y == y)
                return;
            if (self.matches != undefined)
                for (var match of self.matches)
                    if (match.x == x && match.y == y)
                        return
            var thisTile = b.getTile(x, y);
            if (thisTile < 0) return;
            var fclr = color(gemColors[thisTile]);
            fill(fclr);
            stroke(color(hue(fclr), saturation(fclr), brightness(fclr) - 10));
            ellipse(
                x * self.pixelsPerSquare + gemOffset,
                y * self.pixelsPerSquare + gemOffset,
                gemSize,
                gemSize
            );
        });
    }

    drawScore() {
        noStroke();
        fill(255);
        rect(
            0, this.pixelsPerSquare * this.board.nrRows,
            this.pixelsPerSquare * this.board.nrCols, 20
        );
        fill(5);
        textSize(14);
        text("Score: " + this.score, 0, this.pixelsPerSquare * (this.board.nrRows + .35));
        if (this.settled && !this.board.getPossibleMoves(true).length) {
            text("-- game over, press (r) to restart",
                this.pixelsPerSquare * this.board.nrCols / 3,
                this.pixelsPerSquare * (this.board.nrRows + .35));
        }
    }
}







