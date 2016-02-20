// ----------- Room Object -----------

// Represents and draws rooms on the level map.

var Room = function(ctx) {
    this.ctx = ctx;
    this.size = null;

    // location is upper-left hand corner of room
    this.location = null;
    this.door_num = 0;

    // room pointers
    this.north = null;
    this.south = null;
    this.east = null;
    this.west = null;

    this.level_room_index = null;
    this.visible = null;

    this.is_escape_room = false;
    this.is_start_room = false;
}

// ----------- Creation -----------

Room.prototype.set_random_size = function() {
    var size = [2];
    size[0] = getRandomInt(MIN_ROOM_X, MAX_ROOM_X);
    size[1] = getRandomInt(MIN_ROOM_Y, MAX_ROOM_Y);
    this.size = size;
}

Room.prototype.set_size_and_placement = function(room_holder_dimensions) {
    this.set_random_size();
    var location = [2];
    location[0] = getRandomInt(Math.max(room_holder_dimensions[0] + MAX_ROOM_X/2-(this.size[0]) + 1, room_holder_dimensions[0]),
                               Math.min(room_holder_dimensions[0] + MAX_ROOM_X/2 - 1, room_holder_dimensions[0] + MAX_ROOM_X - (this.size[0])));

    location[1] = getRandomInt(Math.max(room_holder_dimensions[1] + MAX_ROOM_Y/2-(this.size[1]) + 1, room_holder_dimensions[1]),
                               Math.min(room_holder_dimensions[1] + MAX_ROOM_Y/2 - 1, room_holder_dimensions[1] + MAX_ROOM_Y - (this.size[1])));
    this.location = location;
}

Room.prototype.add_escape = function() {
    this.is_escape_room = true;
}


// ----------- Information -----------

Room.prototype.get_middle_of_room = function() {
    return [this.location[0] + Math.floor(this.size[0]/2) + 1, this.location[1] + Math.floor(this.size[1]/2) + 1];
}

Room.prototype.is_wall = function(loc) {
    if (loc[0] == this.location[0] || loc[0] == this.location[0] + this.size[0] + 1 || 
        loc[1] == this.location[1] || loc[1] == this.location[1] + this.size[1] + 1)
        return true;
    else {
        return false;
    }
}

Room.prototype.is_door = function(loc) {
    var mid_grid_x = Math.floor(HOLDER_SIZE_X/2) + (GRID_DIMENSIONS[this.level_room_index][0]);
    var mid_grid_y = Math.floor(HOLDER_SIZE_Y/2) + (GRID_DIMENSIONS[this.level_room_index][1]);

    //NORTH
    if (this.north != null && loc[1] == this.location[1] && loc[0] == mid_grid_x) {
        return {
            room: this.north,
            location: [mid_grid_x, this.north.location[1] + this.north.size[1]]
        }
    }
    //SOUTH
    if (this.south != null && loc[1] == this.location[1] + this.size[1] + 1 && loc[0] == mid_grid_x) {
        return {
            room: this.south,
            location: [mid_grid_x, this.south.location[1] + 1]
        }
    }
    // WEST
    if (this.west != null && loc[0] == this.location[0] && loc[1] == mid_grid_y) {
        return {
            room: this.west,
            location: [this.west.location[0] + this.west.size[0], mid_grid_y]
        }
    }
    // EAST
    if (this.east != null && loc[0] == this.location[0] + this.size[0] + 1 && loc[1] == mid_grid_y) {
        return {
            room: this.east,
            location: [this.east.location[0] + 1, mid_grid_y]
        }
    }
    return null;
}

// ----------- Draw -----------

// TODO: break this up into smaller functions.

Room.prototype.draw = function() {
    if (!this.visible) {
        return;
    }
    var i = 0;
    var mid_grid_x = Math.floor(HOLDER_SIZE_X/2) + (GRID_DIMENSIONS[this.level_room_index][0]);
    var mid_grid_y = Math.floor(HOLDER_SIZE_Y/2) + (GRID_DIMENSIONS[this.level_room_index][1]);
    for (i = this.location[0]; i < this.location[0] + this.size[0] + 2; i++) {
        var args_t = convert_grid_location_into_filltext_args(i, this.location[1]);
        var args_b = convert_grid_location_into_filltext_args(i, this.location[1] + this.size[1] + 1);
        // if i is middle of room holder x:
        if (i == mid_grid_x) {
            if (this.north != null) { // a room exists to north, paint a door.
                this.ctx.fillText('+', args_t[0], args_t[1]);
                if (this.north.visible) {
                    for (var path = this.location[1] - 1; path >= GRID_DIMENSIONS[this.level_room_index][1]; path--) {
                        var args_path = convert_grid_location_into_filltext_args(i, path);
                        this.ctx.fillText('E', args_path[0], args_path[1]);
                    }
                }
            }
            else {
                this.ctx.fillText('-', args_t[0], args_t[1]);           
            }
            if (this.south != null) {
                this.ctx.fillText('+', args_b[0], args_b[1]);
                if (this.south.visible) {
                    for (var path = this.location[1] + this.size[1] + 2; path < GRID_DIMENSIONS[this.level_room_index][1] + HOLDER_SIZE_Y; path++) {
                        var args_path = convert_grid_location_into_filltext_args(i, path);
                        this.ctx.fillText('E', args_path[0], args_path[1]);
                    } 
                }   
            }
            else {
                this.ctx.fillText('-', args_b[0], args_b[1]);
            }        
        }
        else {
            this.ctx.fillText('-', args_t[0], args_t[1]);
            this.ctx.fillText('-', args_b[0], args_b[1]);
        }
    }
    for (i = this.location[1] + 1; i < this.location[1] + this.size[1] + 1; i++) {
        var args_w = convert_grid_location_into_filltext_args(this.location[0], i);
        var args_e = convert_grid_location_into_filltext_args(this.location[0] + this.size[0] + 1, i);
        if (i == mid_grid_y) {
            if (this.west != null) { // a room exists to north, paint a door.
                this.ctx.fillText('+', args_w[0], args_w[1]);
                if (this.west.visible) {
                    for (var path = this.location[0] - 1; path >= GRID_DIMENSIONS[this.level_room_index][0]; path--) {
                        var args_path = convert_grid_location_into_filltext_args(path, i);
                        this.ctx.fillText('E', args_path[0], args_path[1]);
                    }
                }            
            }

            else {
                this.ctx.fillText('I', args_w[0], args_w[1]);
            }
            if (this.east != null) {
                this.ctx.fillText('+', args_e[0], args_e[1]);
                if (this.east.visible) {
                    for (var path = this.location[0] + this.size[0] + 2; path < GRID_DIMENSIONS[this.level_room_index][0] + HOLDER_SIZE_X; path++) {
                        var args_path = convert_grid_location_into_filltext_args(path, i);
                        this.ctx.fillText('E', args_path[0], args_path[1]);
                    }
                } 
            }
            else {
                this.ctx.fillText('I', args_e[0], args_e[1]);
            }        
        }
        else {
            this.ctx.fillText('I', args_w[0], args_w[1]);
            this.ctx.fillText('I', args_e[0], args_e[1]);
        }
    }
    // draw escape
    if (this.is_escape_room) {
        var middle = this.get_middle_of_room();
        var args = convert_grid_location_into_filltext_args(middle[0], middle[1]);
        this.ctx.fillText('O', args[0], args[1]);
    }
}