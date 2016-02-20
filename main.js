var current_level = null;

function init() {
    var c = document.getElementById("game-canvas");
    var ctx = c.getContext("2d");
    ctx.font = "10px Courier";

    generate_first_level_and_spawn_player(c, ctx);
    requestAnimationFrame(game_loop);
}

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

function draw_ui_line(c, ctx) {
    ctx.beginPath();
    ctx.moveTo(0, c.height-100);
    ctx.lineTo(c.width, c.height-100);
    ctx.stroke();
}

function generate_border(c, ctx) {
    var i = 0;
    for (i = 0; i < c.width/10; i += 1) {
        var args = convert_grid_location_into_filltext_args(i, 0);
        ctx.fillText('-', args[0], args[1]);
        args = convert_grid_location_into_filltext_args(i, c.height/10 - 1);
        ctx.fillText('-', args[0], args[1]);
        if (i != 0 && i != 79) {
            args = convert_grid_location_into_filltext_args(i, 50);
            ctx.fillText('-', args[0], args[1]);
        }
    }
    for (i = 1; i < c.height/10 - 1; i += 1) {
        var args_left = convert_grid_location_into_filltext_args(0, i);
        var args_right = convert_grid_location_into_filltext_args(c.width/10 - 1, i);

        ctx.fillText('I', args_left[0], args_left[1]);
        ctx.fillText('I', args_right[0], args_right[1]);
        
    }
}

function generate_first_level_and_spawn_player(c, ctx) {
    var hero = new Player(ctx);
    var first_level = new Level(c, ctx, hero);
    first_level.generate_room_tree();
    first_level.setup_player_position();
    current_level = first_level;
}

function game_loop () {
    clear(current_level.c, current_level.ctx);

    generate_border(current_level.c, current_level.ctx);
    
    //draw_grid(c, ctx);
    //draw_room_holder_grid(current_level.c, current_level.ctx);
    //draw_ui_line(c, ctx);


    current_level.player.listen();
    current_level.resolve_monsters();
    current_level.draw();
    current_level.player.draw();

    if (!current_level.player.dead) {
        requestAnimationFrame(game_loop);
    }
}

function clear(c, ctx) {
    ctx.clearRect(0, 0, c.width, c.height);
}
// Utilities
function convert_grid_location_into_filltext_args(x, y) {
    return [2.5 + (x*10), 7.5 + (y * 10)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Event Listeners
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
