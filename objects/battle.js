var Battle = function(c, ctx, room, monster, level) {
    // drawing and references
    this.c = c;
    this.ctx = ctx;

    this.monster = monster;
    this.level = level;
    this.room = room;

    // used by game loop
    this.intro_transition = true;

    this.text_location = [-30, 1];
    this.intro_start_time = Date.now();
    this.intro_current_time = Date.now();

    this.selected = 0;
    this.menu = MAIN_BATTLE_OPTIONS;
}

Battle.prototype.move_menu_up = function() {
    if (this.selected - 1 <= -1) {
        this.selected = this.menu.options.length - 1;
    }
    else {
        this.selected -= 1;
    }
}

Battle.prototype.move_menu_down = function() {
    if (this.selected + 1 >= this.menu.options.length) {
        this.selected = 0;
    }
    else {
        this.selected += 1;
    }
}

Battle.prototype.activate_menu_item = function() {
    if (this.menu == MAIN_BATTLE_OPTIONS) {
        switch(this.menu.options[this.selected]) {
            case MOVE:
                this.get_move_input();
                break;
            case MAGIC:
                this.change_menu(BATTLE_MAGIC_MENU);
                break;
            case FLEE:
                this.change_menu(BATTLE_FLEE_MENU);
                break;
            case MELEE:
                this.change_menu(BATTLE_MELEE_MENU);
                break;
            case INVENTORY:
                this.change_menu(BATTLE_INVENTORY_MENU);
                break;
        }
    }
    else if (this.menu == BATTLE_MELEE_MENU) {
        switch(this.menu.options[this.selected]) {
            case BACK:
                this.change_menu(MAIN_BATTLE_OPTIONS);
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
}

Battle.prototype.change_menu = function(menu) {
    this.menu = menu;
    this.selected = 0;
}

Battle.prototype.get_move_input = function () {

}

Battle.prototype.leave_battle = function () {
    this.level.battle = null;
}

Battle.prototype.draw = function() {
    this.level._draw_border();
    this.level._draw_ui();
    this._draw_battle_text();
    this._draw_battle_border();
    this._draw_ui();
}

Battle.prototype.listen = function() {
    var key = Key.last_key_pressed;
    if (key != null) {
        if (key == Key.UP) this.move_menu_up();
        if (key == Key.DOWN) this.move_menu_down();
        if (key == Key.ENTER) this.activate_menu_item();
        Key.last_key_pressed = null;
    }
}

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
}

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
}

Battle.prototype._draw_battle_border = function() {
    for (i = 1; i < this.c.width/10 - 1; i += 1) {
        var args = convert_grid_location_into_filltext_args(i, 10);
        this.ctx.fillText('-', args[0], args[1]);
        args = convert_grid_location_into_filltext_args(i, 40);
        this.ctx.fillText('-', args[0], args[1]);
    }
}

Battle.prototype._draw_ui = function() {
    this._draw_menu();
    this._draw_zoomed_room();
    this._draw_monster_info();
    this._draw_agents_on_map();
}

Battle.prototype._draw_menu = function() {
    this.ctx.font = BATTLE_MENU_FONT;
    var args = convert_grid_location_into_filltext_args(5, 12);
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
}

Battle.prototype._draw_zoomed_room = function() {
    // 80 units to work with
    // 20 menu, 20 monster info, 40 map
    // max X here = 40; max room size X = 12; 12 * 3 = 36
    // max Y here = 30; max room size y = 6;  6 * 3 = 18;
    
    // make room three times larger!
    var new_x_size = this.room.size[0] * 3;
    var new_y_size = this.room.size[1] * 3;

    // center it!
    var new_x_loc = (this.c.width/10)/2 - (new_x_size/2) - 1;
    var new_y_loc = (this.c.height/10)/2 - 5 - (new_y_size/2);

    for (var i = new_x_loc; i < new_x_loc + new_x_size + 2; i += 1) {
        var args = convert_grid_location_into_filltext_args(i, new_y_loc);
        this.ctx.fillText('-', args[0], args[1]);
        args = convert_grid_location_into_filltext_args(i, new_y_loc + new_y_size + 1);
        this.ctx.fillText('-', args[0], args[1]);
    }
    for (i = new_y_loc + 1; i < new_y_loc + new_y_size + 1; i += 1) {
        var args = convert_grid_location_into_filltext_args(new_x_loc, i);
        this.ctx.fillText('I', args[0], args[1]);
        args = convert_grid_location_into_filltext_args(new_x_loc + new_x_size + 1, i);
        this.ctx.fillText('I', args[0], args[1]);
    }
}

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
}

Battle.prototype._draw_agents_on_map = function() {

}