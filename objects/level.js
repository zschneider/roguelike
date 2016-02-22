// ----------- Level Object -----------

// Essentially a container for the game. Handles level generation, game info, and drawing.

var Level = function(c, ctx, player) {
    this.c = c;
    this.room_grid = new Array(5*5);
    this.ctx = ctx;
    this.start_room = null;
    this.player = player;
    this.player.level = this;
    this.monsters = [];
    this.player_attempted_move = false;
    this.battle = null;
}

// ----------- Initialization ----------- 

Level.prototype.setup_player_position = function() {
    this.player.current_room = this.start_room;
    this.player.location = this.start_room.get_middle_of_room();
    this.player.draw();
}

// Creates a starting room, room map, then adds monsters, and an escape room
Level.prototype.generate_room_tree = function() {
    start_room = this.add_start_room();
    // determine number of doors for starting room
    doors = this._get_random_number_of_doors(0);
    // determine which cardinals the doors point in

    // save some debug info
    start_room.save_debug_info(doors, 0);

    rooms_to_be_branched = this._create_connected_rooms(doors, start_room);
    this._continue_branching_rooms(rooms_to_be_branched, 1);
    this.assign_escape_room();
    if (DEBUG_SPAWN_MONSTERS) this.assign_monsters();
}

// ----------- Procedural Generation -----------

// Recursive function that branches rooms using room probabilities in constants
Level.prototype._continue_branching_rooms = function(rooms_to_be_explored, branch_level) {
    var curr_door_probs = DOOR_PROBS[branch_level];
    if (curr_door_probs == null) {
        // Save some debug information
        for (var i = 0; i < rooms_to_be_explored.length; i++) {
            var room = rooms_to_be_explored[i];
            room.save_debug_info(1, branch_level);
        } 
        return;
    }
    var rooms_to_be_branched = [];
    for (var i = 0; i < rooms_to_be_explored.length; i++) {
        var room = rooms_to_be_explored[i];
        var doors = this._get_random_number_of_doors(branch_level);
        room.door_prob = doors;
        room.branch_level = branch_level;
        // every room already has one door
        var new_rooms = this._create_connected_rooms(doors, room);
        rooms_to_be_branched = rooms_to_be_branched.concat(new_rooms);
    }
    this._continue_branching_rooms(rooms_to_be_branched, branch_level + 1);
}

// Takes a number of doors and a room, and then actually builds the connecting rooms
Level.prototype._create_connected_rooms = function(doors, old_room) {
    var cardinals = [NORTH, SOUTH, EAST, WEST];
    var rooms_to_be_branched = [];


    for (i = 0; i < doors && cardinals.length != 0; i++) {
        var r = getRandomInt(0, 3 - i);
        var door_to_be = cardinals[r];
        cardinals.splice(r, 1);
        var index = this.convert_cardinal_into_index(door_to_be, old_room.level_room_index);
        if (this.check_if_fit(index)) {
            new_room = this.add_room(index);
            this._set_room_relationships(door_to_be, new_room, old_room)
            rooms_to_be_branched.push(new_room);
        }
        else {
            i -= 1;
        }    
    }
    return rooms_to_be_branched;
}

// Gets a random number of doors based on room probabilities in constants and depth in tree
Level.prototype._get_random_number_of_doors = function(branch_level) {
    var r = getRandomInt(1, 100);
    var doors = 1;
    var done = false;
    for (var j = 0; j < DOOR_PROBS[branch_level].length; j++) {
        if (r <= DOOR_PROBS[branch_level][j]) {
            doors = j + 1;
            break;          
        }
    }
    return doors;
}

Level.prototype._set_room_relationships = function(direction, new_room, old_room) {
    if (direction == NORTH) {
        new_room.south = old_room;
        old_room.north = new_room;
    }
    else if (direction == SOUTH) {
        new_room.north = old_room;
        old_room.south = new_room;
    }
    else if (direction == EAST) {
        new_room.west = old_room;
        old_room.east = new_room;
    }
    else if (direction == WEST) {
        new_room.east = old_room;
        old_room.west = new_room;
    }
    new_room.door_num += 1;
    old_room.door_num += 1;
}

// Look through all rooms. Assign one with 1 door to be escape room.
Level.prototype.assign_escape_room = function() {
    var possible_escape_rooms = [];
    for (var i = 0; i < this.room_grid.length; i++) {
        if (this.room_grid[i] != null && this.room_grid[i].door_num == 1) {
            possible_escape_rooms.push(this.room_grid[i]);
        }
    }
    var r = getRandomInt(0, possible_escape_rooms.length-1);
    possible_escape_rooms[r].add_escape();
}

// Randomly place monsters in some rooms
Level.prototype.assign_monsters = function() {
    for (var i = 0; i < this.room_grid.length; i++) {
        if (this.room_grid[i] != null && !this.room_grid[i].is_escape_room && !this.room_grid[i].is_start_room) {
            var r = getRandomInt(1, 2);
            if (r == 1) {
                m = new Monster(this.ctx, this);
                m.randomly_setup(this.room_grid[i]);
                this.monsters.push(m);
            }
        }
    }
}

// ----------- Add Rooms -----------

// Creates the first room of a level - where player starts and root of room tree
Level.prototype.add_start_room = function() {
    start_room = new Room(this.ctx);
    this.start_room = start_room;

    // the start room can be one of the center 9 room locations
    var rand = getRandomInt(0, 8);
    if (rand < 3) {
        start_room.level_room_index = rand + 6;
    }
    else if (rand < 6) {
        start_room.level_room_index = rand + 8;
    }
    else {
        start_room.level_room_index = rand + 10;
    }

    this.room_grid[start_room.level_room_index] = start_room;

    // Setup the room
    start_room.set_size_and_placement(GRID_DIMENSIONS[start_room.level_room_index]);
    start_room.visible = true;
    start_room.is_start_room = true;

    return start_room;
}

Level.prototype.add_room = function(index) {
    new_room = new Room(this.ctx);
    if (DEBUG_SHOW_ALL_ROOMS) new_room.visible = true;
    new_room.level_room_index = index;
    new_room.set_size_and_placement(GRID_DIMENSIONS[new_room.level_room_index]);
    this.room_grid[index] = new_room;
    return new_room;
}

// ----------- Information -----------

// Boolean room map utility that checks the room container for space for a room.
Level.prototype.check_if_fit = function(index) {
    if (index == null) {
        return false;
    }
    if (index < 0 || index >= 25) {
        return false;
    }
    if (this.room_grid[index] != null) {
        return false;
    }
    return true;
}

// Returns the monster on a space, else null
Level.prototype.check_space_for_monster = function(loc) {
    for (var i = 0; i < this.monsters.length; i++) {
        if (this.monsters[i].location[0] == loc[0] &&
            this.monsters[i].location[1] == loc[1]) {
            return this.monsters[i];
        }
    }
    return null;
}

// Boolean function that returns true if this monster is next to player
Level.prototype.next_to_player = function(monster) {
    if (monster.location[0] + 1 == this.player.location[0] &&
        monster.location[1] == this.player.location[1]) {
        return true;
    }
    else if (monster.location[0] - 1== this.player.location[0] &&
        monster.location[1] == this.player.location[1]) {
        return true;
    }
    else if (monster.location[0] == this.player.location[0] &&
        monster.location[1] + 1 == this.player.location[1]) {
        return true;
    }
    else if (monster.location[0] == this.player.location[0] &&
        monster.location[1] - 1 == this.player.location[1]) {
        return true;
    }
}

// ----------- Utilities -----------

Level.prototype.convert_cardinal_into_index = function(direction, index) {
    if (direction == NORTH) {
        if (index >= 0 && index < 4) {
            return null;
        }
        return index - 5;
    }
    else if (direction == SOUTH) {
        if (index >= 20 && index < 24) {
            return null;
        }
        return index + 5;
    }
    else if (direction == WEST) {
        if (index % 5 == 0) {
            return null;
        }
        return index - 1;
    }
    else if (direction == EAST) {
        if (index % 5 == 4) {
            return null;
        }
        return index + 1;
    }
}

// ----------- Game Functions -----------

// Handles movement for all monsters after player attempts a move.
Level.prototype.resolve_monsters = function() {
    if (this.player_attempted_move) {
        for (var i = 0; i < this.monsters.length; i++) {
            if (this.monsters[i].current_room.visible) {
                this.monsters[i].move_towards(this.player.location);
            }
        }
        this.player_attempted_move = false;
    }
}

// Levels up the player by creating a new level and procedurally generating it.
Level.prototype.level_up = function () {
    var temp_level = new Level(this.c, this.ctx, this.player);
    temp_level.generate_room_tree();
    temp_level.setup_player_position();
    // global variable
    current_level = temp_level;
}

// Creates a battle object and passes game loop control to it.
Level.prototype.start_battle = function (monster, room) {
    var battle = new Battle(this.c, this.ctx, room, monster, this);
    this.battle = battle;
}

// ----------- Draw -----------

Level.prototype.draw = function () {
    for (var i = 0; i < 25; i++) {
        if (this.room_grid[i] != null) {
            this.room_grid[i].draw();
        }
    }
    this._draw_border();
    this._draw_ui();
    this._draw_monsters();
    this.player.draw();
}

Level.prototype._draw_ui = function() {
    this._draw_name();
    this._draw_health();
    this._draw_mana();
}

Level.prototype._draw_name = function() {
    for (var i = 1; i < 25; i++) {
        var grid_args = convert_grid_location_into_filltext_args(i, 52);
        this.ctx.fillText('-', grid_args[0], grid_args[1]);
    }
    var name_args = convert_grid_location_into_filltext_args(1, 51);
    var font = this.ctx.font;
    this.ctx.font = "bold 12px Courier";
    this.ctx.fillText(this.player.name, name_args[0], name_args[1]);
    this.ctx.font = font;
}

Level.prototype._draw_health = function() {
    var health_args = convert_grid_location_into_filltext_args(1, 53);
    this.ctx.fillText("HEALTH", health_args[0], health_args[1]);
    health_args = convert_grid_location_into_filltext_args(5, 53);
    this.ctx.fillText(":", health_args[0], health_args[1]);
    for (var i = 0; i < Math.ceil(this.player.health/7); i++) { // this gets us 15 stars
        health_args = convert_grid_location_into_filltext_args(i+7, 53);
        this.ctx.fillText("*", health_args[0], health_args[1]);
    }
    health_args = convert_grid_location_into_filltext_args(22, 53);
    this.ctx.fillText(Math.floor(this.player.health), health_args[0], health_args[1]);
}

Level.prototype._draw_mana = function() {
    var mana_args = convert_grid_location_into_filltext_args(1, 55);
    this.ctx.fillText("MANA", mana_args[0], mana_args[1]);
    mana_args = convert_grid_location_into_filltext_args(5, 55);
    this.ctx.fillText(":", mana_args[0], mana_args[1]);
    for (var i = 0; i < Math.ceil(this.player.mana/7); i++) { // this gets us 15 stars
        mana_args = convert_grid_location_into_filltext_args(i+7, 55);
        this.ctx.fillText("*", mana_args[0], mana_args[1]);
    }
    mana_args = convert_grid_location_into_filltext_args(22, 55);
    this.ctx.fillText(Math.floor(this.player.mana), mana_args[0], mana_args[1]);    
}

Level.prototype._draw_monsters = function() {
    for (var i = 0; i < this.monsters.length; i++) {
        if (this.monsters[i].current_room.visible) {
            this.monsters[i].draw();
        }
    }
}

Level.prototype._draw_border = function() {
    var i = 0;
    for (i = 0; i < this.c.width/10; i += 1) {
        var args = convert_grid_location_into_filltext_args(i, 0);
        this.ctx.fillText('-', args[0], args[1]);
        args = convert_grid_location_into_filltext_args(i, this.c.height/10 - 1);
        this.ctx.fillText('-', args[0], args[1]);
        if (i != 0 && i != 79) {
            args = convert_grid_location_into_filltext_args(i, 50);
            this.ctx.fillText('-', args[0], args[1]);
        }
    }
    for (i = 1; i < this.c.height/10 - 1; i += 1) {
        var args_left = convert_grid_location_into_filltext_args(0, i);
        var args_right = convert_grid_location_into_filltext_args(this.c.width/10 - 1, i);

        this.ctx.fillText('I', args_left[0], args_left[1]);
        this.ctx.fillText('I', args_right[0], args_right[1]);    
    }
}