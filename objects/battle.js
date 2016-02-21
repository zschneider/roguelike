var Battle = function(c, ctx, monster, level) {
    // need room for dimensions
    // need new game loop
    this.c = c;
    this.ctx = ctx;
    this.monster = monster;
    this.level = level;

    this.battle_on = true;
    this.intro_transition = true;

    this.text_location = [-30, 1];
    this.intro_start_time = Date.now();
    this.intro_current_time = Date.now();
}


Battle.prototype.battle_loop = function() {
    while (this.battle_on) {
        //clear(this.c, this.ctx);
        // this.draw();
        // requestAnimationFrame(this.battle_loop);
    }
}

Battle.prototype.draw = function() {
    this.level._draw_border();
    this.level._draw_ui();
    this._draw_battle_text();
}

Battle.prototype.draw_intro = function() {
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

}