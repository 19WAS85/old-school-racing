Old School Racing
=================

A pseudo3d old school racing game made with pure Javascript.

It was made to be a racing game platform, to create any kind of race as the golden age of fun.

Creating a Race
---------------

    // create new track
    var track = new Track('Test Track');

    // add the first segment of the track, white, for the start line
    track.addSegments(1, { color: 0xEEEEEE });

    // add 80 segments (a stright)
    track.addSegments(80);

    // add a right curve with a up hill
    track.addSegments(20, { curve: -0.5, hill: -0.1 });

    // add a tree in the 10th segment at 500px (right)
    track.addObject(10, 'assets/tree.png', 500);

    // create a car to player
    var playerCar = new Car('assets/sidewinder.png');

    // create a car to cpu
    var cpuCar = new Car('assets/sidewinder.png');

    // create a race
    var race = new Race(track, [playerCar, cpuCar]);

    // create a render to show the race in the screen
    var render = new RaceRender(race);

    // create keyboard control to player car
    var keyboard = new KeyboardControl(playerCar);

    // create a basic cpu control to other car
    var cpuControl = new BasicCPUControl(cpuCar);

Next Steps
----------

 * Create unit test;
 * Improve performance;
 * Improve race;
 * Improve design;

How to Contribute?
------------------

 * `npm run watch` to generate a development version of main js.
 * `npm run build` to generate the final version of main js.
