// ----------- Monster Object -----------

// Represents enemies and handles combat, movement, and health.

var Monster = function(ctx, level) {
    this.ctx = ctx;
    this.health = 100;
    this.attack_strength = 12;
    this.loot = 0;
    this.current_room = null;
    this.location = null;
    this.type = null;
    this.level = level;
}

// ----------- Creation -----------

Monster.prototype.randomly_setup = function(room) {
    this.current_room = room;
    // TODO: get random location in room
    this.location = this.current_room.get_middle_of_room();
    var r = getRandomInt(1, 100);
    for (var i = 0; i < MONSTER_PROBS.length; i++) {
        if (r <= MONSTER_PROBS[i]) {
            this.type = MONSTER_TYPES[i];
            break;
        }
    }
}

// ----------- Movement -----------

Monster.prototype.move_towards = function(loc) {
    // idea: abs(x - x), abs(y - y), reduce by greater of the two
    var x_diff = Math.abs(loc[0] - this.location[0]);
    var y_diff = Math.abs(loc[1] - this.location[1]);
    if (x_diff >= y_diff) {
        // move in x direction towards location
        if (loc[0] > this.location[0]) this.attempt_move([this.location[0]+1, this.location[1]]);
        else this.attempt_move([this.location[0]-1, this.location[1]]);
    }
    else if (x_diff == y_diff) {
        var rand = getRandomInt(0,1);
        if (rand == 0) {
            if (loc[1] > this.location[1]) this.attempt_move([this.location[0], this.location[1]+1]);
            else this.attempt_move([this.location[0], this.location[1]-1]);
        }
        else {
            if (loc[0] > this.location[0]) this.attempt_move([this.location[0]+1, this.location[1]]);
            else this.attempt_move([this.location[0]-1, this.location[1]]);
        }        
    }
    else {
        if (loc[1] > this.location[1]) this.attempt_move([this.location[0], this.location[1]+1]);
        else this.attempt_move([this.location[0], this.location[1]-1]);   
    }
}

Monster.prototype.attempt_move = function(loc) {
    possible_room = this.current_room.is_door(loc);
    if (possible_room != null) {
        this.current_room = possible_room.room;
    }
    else if (loc[0] == this.level.player.location[0] &&
             loc[1] == this.level.player.location[1]) {
        this.level.start_battle(this);
    }
    else if (!this.current_room.is_wall(loc)) {
        this.location = loc;
    }
}

// ----------- Combat -----------

Monster.prototype.take_damage = function(attack) {
    this.health -= attack;
    if (this.health <= 0) {
        this.die();
    }
}

Monster.prototype.die = function() {
    for (var i = 0; i < this.level.monsters.length; i++) {
        if (this == this.level.monsters[i]) {
            this.level.monsters.splice(i, 1);
        }
    }
}

// ----------- Draw -----------

Monster.prototype.draw = function() {
    var args = convert_grid_location_into_filltext_args(this.location[0], this.location[1]);
    this.ctx.fillText("M", args[0], args[1]);
}