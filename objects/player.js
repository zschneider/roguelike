// ----------- Player Object -----------

// Represents player. Handles input, movement, combat, death, etc.

var Player = function(ctx) {
    this.health = 100;
    this.mana = 100;
    this.experience = 0;
    this.name = 'Gazorpazorp the Undying';
    this.ctx = ctx;
    this.current_room = null;
    this.location = null;
    this.gold = 0;
    this.strength = 25;
    this.level = null;
    this.dead = false;
}

// ----------- User Input -----------

Player.prototype.listen = function() {
    key = Key.last_key_pressed;
    if (key != null) {
        this.level.player_attempted_move = true;

        if (key == Key.UP) this.move_north();
        if (key == Key.LEFT) this.move_west();
        if (key == Key.RIGHT) this.move_east();
        if (key == Key.DOWN) this.move_south();

        Key.last_key_pressed = null;
    }
}

// ----------- Movement -----------

Player.prototype.move_north = function() {
    var new_loc = [this.location[0], this.location[1] - 1];
    this.attempt_move(new_loc);
}

Player.prototype.move_west = function() {
    var new_loc = [this.location[0] - 1, this.location[1]];
    this.attempt_move(new_loc);
}

Player.prototype.move_east = function() {
    var new_loc = [this.location[0] + 1, this.location[1]];
    this.attempt_move(new_loc);
}

Player.prototype.move_south = function() {
    var new_loc = [this.location[0], this.location[1] + 1];
    this.attempt_move(new_loc);
}

Player.prototype.attempt_move = function(new_loc) {
    possible_room = this.current_room.is_door(new_loc);
    possible_monster = this.level.check_space_for_monster(new_loc);
    if (possible_room != null) {
        possible_room.room.visible = true;
        this.current_room = possible_room.room;
        this.location = possible_room.location;
    }
    else if (possible_monster != null) {
        this.level.start_battle(possible_monster);
    }
    else if (this.current_room.is_escape_room && 
             new_loc[0] == this.current_room.get_middle_of_room()[0] &&
             new_loc[1] == this.current_room.get_middle_of_room()[1]) {
        current_level.level_up();
    }
    else if (!this.current_room.is_wall(new_loc)) {
        this.location = new_loc;
    }
}

// ----------- Combat -----------

Player.prototype.take_damage = function(attack) {
    this.health -= attack;
    if (this.health <= 0) {
        this.die();
    }
}

Player.prototype.die = function() {
    this.health = 0;
    this.dead = true;
}

// ----------- Draw -----------

Player.prototype.draw = function () {
    var args = convert_grid_location_into_filltext_args(this.location[0], this.location[1]);
    this.ctx.fillText("H", args[0], args[1]);
}