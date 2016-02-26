// ----------- Game Constants -----------

// DOOR PROBABILITIES
// Make sure 0% chance of one door at branch_0,
// Make sure 100% chance of one door at branch_4
var BRANCH_0 = [0, 10, 30, 100]
var BRANCH_1 = [10, 25, 50, 100]
var BRANCH_2 = [40, 70, 90, 100]
var BRANCH_3 = [50, 75, 95, 100]
var BRANCH_4 = [100, 100, 100, 100]

var DOOR_PROBS = [BRANCH_0, BRANCH_1, BRANCH_2, BRANCH_3, BRANCH_4]

// STRING CONSTANTS
var NORTH = 'N'
var SOUTH = 'S'
var EAST = 'E'
var WEST = 'W'

// GRID DIMENSIONS
var HOLDER_SIZE_X = 14;
var HOLDER_SIZE_Y = 8;
var GRID_DIMENSIONS = new Array(5*5);
var BUFFER = 5;
// generate the dimensions for every grid location
for (var x = 0; x < 5; x++) {
    for (var y = 0; y < 5; y++) {
        GRID_DIMENSIONS[x + (y * BUFFER)] = [BUFFER + (x * HOLDER_SIZE_X), BUFFER + (y * HOLDER_SIZE_Y)];
    }
}

// ROOM SETTINGS
var MIN_ROOM_X = 3;
var MAX_ROOM_X = HOLDER_SIZE_X-2;
var MIN_ROOM_Y = 3;
var MAX_ROOM_Y = HOLDER_SIZE_Y-2;


// Monster Constants
// BAT, TROLL, GOBLIN, EVIL WIZARD
var BAT = "bat";
var TROLL = "troll";
var GOBLIN = "goblin";
var E_WIZARD = "wizard";

var MONSTER_PROBS = [20, 50, 90, 100];
var MONSTER_TYPES = [BAT, TROLL, GOBLIN, E_WIZARD];

// Debug
var DEBUG_SPAWN_MONSTERS = true;
var DEBUG_SHOW_ALL_ROOMS = false;
var DEBUG_SHOW_ROOM_INFO= false;

var BATTLE_TEXT = 
"                              (            ____ \n" +
"   (     (       *   )  *   ) )\\ )        |   / \n" +
" ( )\\    )\\    ` )  /(` )  /((()/(  (     |  /  \n" +
" )((_)((((_)(   ( )(_))( )(_))/(_)) )\\    | /   \n" +
"((_)_  )\\ _ )\\ (_(_())(_(_())(_))  ((_)   |/    \n" +
" | _ ) (_)_\\(_)|_   _||_   _|| |   | __|  /     \n" +
" | _ \\  / _ \\    | |    | |  | |__ | _|  /\\     \n" +
" |___/ /_/ \\_\\   |_|    |_|  |____||___|(_)    \n";
// var BATTLE_TEXT = 
// "  ____        _   _   _      _  \n" +
// " | __ )  __ _| |_| |_| | ___| | \n" +
// " |  _ \\ / _` | __| __| |/ _ \\ | \n" +
// " | |_) | (_| | |_| |_| |  __/_| \n" +
// " |____/ \\__,_|\\__|\\__|_|\\___(_) \n" +
// "                                ";
var BATTLE_INTRO_TIME = 1000;
var BATTLE_TEXT_WIDTH = 30;

var MOVE = "Move";
var FLEE = "Flee";
var MELEE = "Melee";
var MAGIC = "Magic"
var INVENTORY = "Inventory";
var BACK = "Back";
var YES = "Yes";

var MAIN_BATTLE_OPTIONS = {
    text: "Battle Options",
    options: [MOVE, FLEE, MELEE, MAGIC, INVENTORY],
}

var BATTLE_MELEE_MENU = {
    text: "Melee",
    options: [BACK],
}

var BATTLE_MAGIC_MENU = {
    text: "Magic",
    options: [BACK],
}

var BATTLE_FLEE_MENU = {
    text: "Are you sure?",
    options: [YES, BACK],
}

var BATTLE_INVENTORY_MENU = {
    text: "Inventory",
    options: [BACK],
}

var GAME_FONT = "10px Courier";
var BATTLE_MENU_FONT = "16px Courier";

                                                