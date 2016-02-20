
// Global varaible container for the current level. 
var current_level = null;


// ----------- Initialization and Game Loop -----------


function init() {
    var c = document.getElementById("game-canvas");
    var ctx = c.getContext("2d");
    ctx.font = "10px Courier";

    generate_first_level_and_spawn_player(c, ctx);
    requestAnimationFrame(game_loop);
}

// Setup player and first level. level.level_up handles this logic
// for rest of the game.
function generate_first_level_and_spawn_player(c, ctx) {
    var hero = new Player(ctx);
    var first_level = new Level(c, ctx, hero);
    first_level.generate_room_tree();
    first_level.setup_player_position();
    current_level = first_level;
}

// Main game loop.
function game_loop () {
    clear(current_level.c, current_level.ctx);

    // DEBUG TOOLS
    //draw_grid(c, ctx);
    //draw_room_holder_grid(current_level.c, current_level.ctx);
    //draw_ui_line(c, ctx);

    current_level.player.listen();
    current_level.resolve_monsters();

    // Draw
    current_level.draw();

    if (!current_level.player.dead) {
        requestAnimationFrame(game_loop);
    }
}

// Clears the screen.
function clear(c, ctx) {
    ctx.clearRect(0, 0, c.width, c.height);
}


// ----------- Utilities -----------


function convert_grid_location_into_filltext_args(x, y) {
    return [2.5 + (x*10), 7.5 + (y * 10)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// ----------- Debug tools -----------


// Draws grids around each square, where a square is a possible ascii container
// Basically draws the 80 x 60 grid
function draw_grid(c, ctx) {
    for (i = 0; i < c.width; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, c.height);
        ctx.stroke();
    }
    for (i = 0; i < c.height; i += 10) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(c.width, i);
        ctx.stroke();
    }
}

// Draws a grid around each room container
function draw_room_holder_grid(c, ctx) {
    for (i = 50; i < c.width; i += 140) {
        ctx.beginPath();
        ctx.moveTo(i, 50);
        ctx.lineTo(i, c.height - 150);
        ctx.stroke();
    }
    for (i = 50; i <= c.height-150; i += 80) {
        ctx.beginPath();
        ctx.moveTo(50, i);
        ctx.lineTo(c.width-50, i);
        ctx.stroke();
    }
}

// Draws a line at the level map / UI boundary
function draw_ui_line(c, ctx) {
    ctx.beginPath();
    ctx.moveTo(0, c.height-100);
    ctx.lineTo(c.width, c.height-100);
    ctx.stroke();
}


// ----------- Event Listeners -----------


window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
