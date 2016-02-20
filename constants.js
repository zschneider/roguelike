// Constants 

// 80 x 60

// DOOR PROBABILITIES
// 60% 4 doors, 20% 3 doors, 10% 2 doors at branch 0
// 20% 4 doors, 10% 3 doors, 50% 2 doors, 20% 1 door at branch 1
// 5% 4 doors, 5% 3 doors, 50% 2 doors, 40% 1 door at branch 2
// 1% 4 doors, 5% 3 doors, 10% 2 doors, 84% 1 door at branch 3
// 100% 1 door at branch 4
var BRANCH_0 = [0, 10, 30, 100]
var BRANCH_1 = [20, 70, 80, 100]
var BRANCH_2 = [40, 90, 95, 100]
var BRANCH_3 = [84, 94, 99, 100]
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


// // ROOM TYPE PROBABILITIES
// // NOTHING, MONSTER ROOM, STORE
// var ROOM_TYPE_PROBS = [30, 95, 100];

// BAT, TROLL, GOBLIN, EVIL WIZARD
var BAT = "bat";
var TROLL = "troll";
var GOBLIN = "goblin";
var E_WIZARD = "wizard";

var MONSTER_PROBS = [20, 50, 90, 100];
var MONSTER_TYPES = [BAT, TROLL, GOBLIN, E_WIZARD];