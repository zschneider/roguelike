var Battle = function(c, ctx, room, monster, level) {
    // drawing and references
    this.c = c;
    this.ctx = ctx;

    this.monster = monster;
    this.level = level;
    this.room = room;

    // used by game loop, battle intro
    this.intro_transition = true;

    // battle intro
    this.text_location = [-30, 1];
    this.intro_start_time = Date.now();
    this.intro_current_time = Date.now();

    // menu info
    this.selected = 0;
    this.menu = MAIN_BATTLE_OPTIONS;

    // zoomed room info
    this.battle_room = new Room(ctx, 
                                [this.room.size[0] * 3, this.room.size[1] * 3],
                                [(this.c.width/10)/2 - ((this.room.size[0] * 3)/2) - 1,
                                (this.c.height/10)/2 - 5 - ((this.room.size[1]*3)/2)]);

    // player and monster location info
    this.player_location = this.get_random_start_location();
    this.monster_location = this.get_random_start_location();
};

// Return a random location within the 3x room. 

Battle.prototype.get_random_start_location = function() {
    // get random x, get random y
    var room = this.battle_room;
    var x = getRandomInt(room.location[0] + 1, room.location[0] + room.size[0] - 1);
    var y = getRandomInt(room.location[1] + 1, room.location[1] + room.size[1] - 1);

    // monster_location must be defined after player
    if (("player_location" in this) && (this.player_location[0] == x) && (this.player_location[1] == y)) {
        return this.get_random_start_location();
    }
    
    return [x, y];
};


Battle.prototype.move_menu_up = function() {
    if (this.selected - 1 <= -1) {
        this.selected = this.menu.options.length - 1;
    }
    else {
        this.selected -= 1;
    }
};

Battle.prototype.move_menu_down = function() {
    if (this.selected + 1 >= this.menu.options.length) {
        this.selected = 0;
    }
    else {
        this.selected += 1;
    }
};

Battle.prototype.move_direction_right = function() {
    if ("direction" in this.menu) {
        if (this.menu.direction == NORTH) {
            this.menu.direction = EAST;
        }
        else if (this.menu.direction == EAST) {
            this.menu.direction = SOUTH;
        }
        else if (this.menu.direction == SOUTH) {
            this.menu.direction = WEST;
        }
        else if (this.menu.direction == WEST) {
            this.menu.direction = NORTH;
        }
    }
};

Battle.prototype.move_direction_left = function() {
    if ("direction" in this.menu) {
        if (this.menu.direction == NORTH) {
            this.menu.direction = WEST;
        }
        else if (this.menu.direction == EAST) {
            this.menu.direction = NORTH;
        }
        else if (this.menu.direction == SOUTH) {
            this.menu.direction = EAST;
        }
        else if (this.menu.direction == WEST) {
            this.menu.direction = SOUTH;
        }
    }
};

Battle.prototype.move_player = function() {
    var loc = [];
    if (this.menu.direction == NORTH) {
        // check if wall
        loc = potential_north(this.player_location);
        if (!this.battle_room.is_wall(loc)) {
            this.player_location = loc;
        }
    }
    else if (this.menu.direction == EAST) {
        loc = potential_east(this.player_location);
        if (!this.battle_room.is_wall(loc)) {
            this.player_location = loc;
        }
    }
    else if (this.menu.direction == WEST) {
        loc = potential_west(this.player_location);
        if (!this.battle_room.is_wall(loc)) {
            this.player_location = loc;
        }
    }
    else if (this.menu.direction == SOUTH) {
        loc = potential_south(this.player_location);
        if (!this.battle_room.is_wall(loc)) {
            this.player_location = loc;
        }
    }
};

Battle.prototype.activate_menu_item = function() {
    if (this.menu == MAIN_BATTLE_OPTIONS) {
        switch(this.menu.options[this.selected]) {
            case MOVE:
                this.change_menu(BATTLE_MOVE_MENU);
                break;
            case MAGIC:
                this.change_menu(BATTLE_MAGIC_MENU);
                break;
            case FLEE:
                this.change_menu(BATTLE_FLEE_MENU);
                break;
            case PHYSICAL:
                this.change_menu(BATTLE_PHYSICAL_MENU);
                break;
            case INVENTORY:
                this.change_menu(BATTLE_INVENTORY_MENU);
                break;
        }
    }
    else if (this.menu == BATTLE_MOVE_MENU) {
        switch(this.menu.options[this.selected]) {
            case MOVE:
                this.move_player(this.menu.direction);
                this.change_menu(MAIN_BATTLE_OPTIONS);
                this.trigger_monster_move();
                break;
            case BACK:
                this.change_menu(MAIN_BATTLE_OPTIONS);
                break;
        }
    }
    else if (this.menu == BATTLE_PHYSICAL_MENU) {
        switch(this.menu.options[this.selected]) {
            case MELEE:
                this.change_menu(PHYSICAL_MELEE_MENU);
                break;
            case RANGED:
                this.change_menu(PHYSICAL_RANGED_MENU);
                break;
            case BACK:
                this.change_menu(MAIN_BATTLE_OPTIONS);
                break;
        }
    }
    else if (this.menu == PHYSICAL_MELEE_MENU) {
        switch (this.menu.options[this.selected]) {
            case ATTACK:
                break;
            case BACK:
                this.change_menu(BATTLE_PHYSICAL_MENU);
                break;
        }
    }
    else if (this.menu == PHYSICAL_RANGED_MENU) {
        switch (this.menu.options[this.selected]) {
            case ATTACK:
                break;
            case BACK:
                this.change_menu(BATTLE_PHYSICAL_MENU);
                break;
        }
    }
    else if (this.menu == BATTLE_MAGIC_MENU) {
        switch(this.menu.options[this.selected]) {
            case BACK:
                this.change_menu(MAIN_BATTLE_OPTIONS);
                break;
        }
    }
    else if (this.menu == BATTLE_INVENTORY_MENU) {
        switch(this.menu.options[this.selected]) {
            case BACK:
                this.change_menu(MAIN_BATTLE_OPTIONS);
                break;
        }
    }
    else if (this.menu == BATTLE_FLEE_MENU) {
        switch(this.menu.options[this.selected]) {
            case BACK:
                this.change_menu(MAIN_BATTLE_OPTIONS);
                break;
            case YES:
                this.leave_battle();
        }
    }
};

Battle.prototype.trigger_monster_move = function() {
    // attack or move

};

Battle.prototype.change_menu = function(menu) {
    this.menu = menu;
    this.selected = 0;
};


Battle.prototype.leave_battle = function () {
    this.level.battle = null;
};

Battle.prototype.draw = function() {
    this.level._draw_border();
    this.level._draw_ui();
    this._draw_battle_text();
    this._draw_battle_border();
    this._draw_ui();
};

Battle.prototype.listen = function() {
    var key = Key.last_key_pressed;
    if (key !== null) {
        if (key == Key.UP) this.move_menu_up();
        if (key == Key.DOWN) this.move_menu_down();
        if (key == Key.RIGHT) this.move_direction_right();
        if (key == Key.LEFT) this.move_direction_left();
        if (key == Key.ENTER) this.activate_menu_item();
        Key.last_key_pressed = null;
    }
};

Battle.prototype.draw_intro = function() {
    // TODO: move the text_location to appropriate value given time into BATTLE_INTRO_TIME
    if (this.text_location[0] <= ((this.c.width/10)/2 - BATTLE_TEXT_WIDTH/2)) {
        this.text_location = [this.text_location[0] + 1, this.text_location[1]];
    }

    this.draw();
    this.intro_current_time = Date.now();
    if ((this.intro_current_time - this.intro_start_time) > BATTLE_INTRO_TIME) {
        this.intro_transition = false;
    }
};

Battle.prototype._draw_battle_text = function() {
    var temp_buffer = [];
    var y = 0;
    for (var i = 0; i < BATTLE_TEXT.length; i++) {
        if (BATTLE_TEXT[i] != "\n") {
            temp_buffer.push(BATTLE_TEXT[i]);
        }
        else {
            var text = temp_buffer.join("");
            var top_args = convert_grid_location_into_filltext_args(this.text_location[0], this.text_location[1]+y);
            var bot_args = convert_grid_location_into_filltext_args((this.c.width/10)-BATTLE_TEXT_WIDTH-this.text_location[0]+2,
                                                                    this.text_location[1]+40+y);

            this.ctx.fillText(text, top_args[0], top_args[1]);
            this.ctx.fillText(text, bot_args[0], bot_args[1]);
            y += 1;
            temp_buffer = [];
        }
    }
};

Battle.prototype._draw_battle_border = function() {
    for (i = 1; i < this.c.width/10 - 1; i += 1) {
        var args = convert_grid_location_into_filltext_args(i, 10);
        this.ctx.fillText('-', args[0], args[1]);
        args = convert_grid_location_into_filltext_args(i, 40);
        this.ctx.fillText('-', args[0], args[1]);
    }
};

Battle.prototype._draw_ui = function() {
    this._draw_menu();
    this._draw_zoomed_room();
    this._draw_monster_info();
    this._draw_agents_on_map();
};

Battle.prototype._draw_menu = function() {
    this.ctx.font = BATTLE_MENU_FONT;
    var args = convert_grid_location_into_filltext_args(3, 12);
    this.ctx.fillText(this.menu.text, args[0], args[1]);
    for (var i = 0; i < this.menu.options.length; i++) {
        if (i == this.selected) {
            var selected_args = convert_grid_location_into_filltext_args(2, 15 + (i*2));
            this.ctx.fillText('>', selected_args[0], selected_args[1]);
        }
        args = convert_grid_location_into_filltext_args(3, 15 + (i*2));
        this.ctx.fillText(this.menu.options[i], args[0], args[1]);
    }
    this.ctx.font = GAME_FONT;
    for (i = 1; i < 30; i++) {
        args = convert_grid_location_into_filltext_args(20, i+10);
        this.ctx.fillText('I', args[0], args[1]);
    }
    for (i = 1; i < 20; i++) {
        args = convert_grid_location_into_filltext_args(i, 13);
        this.ctx.fillText('-', args[0], args[1]);
    }
};

Battle.prototype._draw_zoomed_room = function() {
    // 80 units to work with
    // 20 menu, 20 monster info, 40 map
    // max X here = 40; max room size X = 12; 12 * 3 = 36
    // max Y here = 30; max room size y = 6;  6 * 3 = 18;
    var room = this.battle_room;
    var args = [];
    for (var i = room.location[0]; i < room.location[0] + room.size[0] + 2; i += 1) {
        args = convert_grid_location_into_filltext_args(i, room.location[1]);
        this.ctx.fillText('-', args[0], args[1]);
        args = convert_grid_location_into_filltext_args(i, room.location[1] + room.size[1] + 1);
        this.ctx.fillText('-', args[0], args[1]);
    }
    for (i = room.location[1] + 1; i < room.location[1] + room.size[1] + 1; i += 1) {
        args = convert_grid_location_into_filltext_args(room.location[0], i);
        this.ctx.fillText('I', args[0], args[1]);
        args = convert_grid_location_into_filltext_args(room.location[0] + room.size[0] + 1, i);
        this.ctx.fillText('I', args[0], args[1]);
    }
};

Battle.prototype._draw_monster_info = function() {
    this.ctx.font = BATTLE_MENU_FONT;
    var args = convert_grid_location_into_filltext_args(64, 12);
    this.ctx.fillText('MONSTER INFO', args[0], args[1]);
    this.ctx.font = GAME_FONT;
    for (var i = 1; i < 30; i++) {
        args = convert_grid_location_into_filltext_args(60, i+10);
        this.ctx.fillText('I', args[0], args[1]);
    }
    for (i = 61; i < 79; i++) {
        args = convert_grid_location_into_filltext_args(i, 13);
        this.ctx.fillText('-', args[0], args[1]);
    }
    // TODO: finish monster info
};

Battle.prototype._draw_agents_on_map = function() {
    // player
    var args = convert_grid_location_into_filltext_args(this.player_location[0],
                                                        this.player_location[1]);
    this.ctx.fillText('H', args[0], args[1]);
    // draw the direction facing if necessary
    if ("draw_direction" in this.menu) {
        this._draw_direction_icon();
    }
    else if ("draw_ranged" in this.menu) {
        this._draw_weapon_ranged();
    }
    else if ("draw_melee" in this.menu) {
        this._draw_weapon_melee();
    }
    args = convert_grid_location_into_filltext_args(this.monster_location[0],
                                                    this.monster_location[1]);
    this.ctx.fillText('M', args[0], args[1]);
};

Battle.prototype._draw_weapon_ranged = function() {
    var range = this.level.player.get_equipped_ranged_weapon().range;
    var loc = [];
    var args = [];

    for (var i = 1; i < range; i++) {
        if (this.menu.direction == NORTH) {
            loc = [this.player_location[0], this.player_location[1] - i];
            if (this.battle_room.is_wall(loc)) {
                break;
            }
            args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
            this.ctx.fillText('x', args[0], args[1]);
            
        }
        else if (this.menu.direction == WEST) {
            loc = [this.player_location[0] - i, this.player_location[1]];
            if (this.battle_room.is_wall(loc)) {
                break;
            }
            args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
            this.ctx.fillText('x', args[0], args[1]);
        }
        else if (this.menu.direction == EAST) {
            loc = [this.player_location[0] + i, this.player_location[1]];
            if (this.battle_room.is_wall(loc)) {
                break;
            }
            args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
            this.ctx.fillText('x', args[0], args[1]);
        }
        else if (this.menu.direction == SOUTH) {
            loc = [this.player_location[0], this.player_location[1] + i];
            if (this.battle_room.is_wall(loc)) {
                break;
            }
            args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
            this.ctx.fillText('x', args[0], args[1]);
        }
    }
};

Battle.prototype._draw_direction_icon = function() {
    var loc = [];
    if (this.menu.direction == NORTH) {
        loc = potential_north(this.player_location);
        if (!this.battle_room.is_wall(loc)) {
            args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
            this.ctx.fillText('^', args[0], args[1]);
        }
    }
    else if (this.menu.direction == WEST) {
        loc = potential_west(this.player_location);
        if (!this.battle_room.is_wall(loc)) {
            args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
            this.ctx.fillText('<', args[0], args[1]);
        }
    }
    else if (this.menu.direction == EAST) {
        loc = potential_east(this.player_location);
        if (!this.battle_room.is_wall(loc)) {
            args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
            this.ctx.fillText('>', args[0], args[1]);
        }
    }
    else if (this.menu.direction == SOUTH) {
        loc = potential_south(this.player_location);
        if (!this.battle_room.is_wall(loc)) {
            args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
            this.ctx.fillText('v', args[0], args[1]);
        }
    }
};

Battle.prototype._draw_weapon_melee = function() {
    // range in all cardinals, range - 1 in diagonals
    var range = this.level.player.get_equipped_melee_weapon().range;
    var loc = [];
    var args = [];
    var i = 0;
    // EAST
    for (i = this.player_location[0] + 1; i <= this.player_location[0] + range; i++) {
        loc = [i, this.player_location[1]];
        if (this.battle_room.is_wall(loc)) {
            break;
        }
        args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
        this.ctx.fillText('x', args[0], args[1]);
    }
    // WEST
    for (i = this.player_location[0] - 1; i >= this.player_location[0] - range; i--) {
        loc = [i, this.player_location[1]];
        if (this.battle_room.is_wall(loc)) {
            break;
        }
        args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
        this.ctx.fillText('x', args[0], args[1]);
    }
    // NORTH
    for (i = this.player_location[1] - 1; i >= this.player_location[1] - range; i--) {
        loc = [this.player_location[0], i];
        if (this.battle_room.is_wall(loc)) {
            break;
        }
        args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
        this.ctx.fillText('x', args[0], args[1]);
    }
    // SOUTH
    for (i = this.player_location[1] + 1; i <= this.player_location[1] + range; i++) {
        loc = [this.player_location[0], i];
        if (this.battle_room.is_wall(loc)) {
            break;
        }
        args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
        this.ctx.fillText('x', args[0], args[1]);
    }
    // SEAST
    for (i = 1; i < range; i++) {
        loc = [this.player_location[0] + i, this.player_location[1] + i];
        if (this.battle_room.is_wall(loc)) {
            break;
        }
        args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
        this.ctx.fillText('x', args[0], args[1]);        
    }
    // SWEST
    for (i = 1; i < range; i++) {
        loc = [this.player_location[0] - i, this.player_location[1] + i];
        if (this.battle_room.is_wall(loc)) {
            break;
        }
        args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
        this.ctx.fillText('x', args[0], args[1]);        
    }
    // NEAST
    for (i = 1; i < range; i++) {
        loc = [this.player_location[0] + i, this.player_location[1] - i];
        if (this.battle_room.is_wall(loc)) {
            break;
        }
        args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
        this.ctx.fillText('x', args[0], args[1]);        
    }
    // NWEST
    for (i = 1; i < range; i++) {
        loc = [this.player_location[0] - i, this.player_location[1] - i];
        if (this.battle_room.is_wall(loc)) {
            break;
        }
        args = convert_grid_location_into_filltext_args(loc[0], loc[1]);
        this.ctx.fillText('x', args[0], args[1]);        
    }
};
