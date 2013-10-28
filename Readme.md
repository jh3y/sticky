# progress

  A very minimal progress line component much like seen in modern UIs. Compatible with [component package manager](https://github.com/component/component).

## Demo
	
A demo of progress can be seen [here](http://jsfiddle.net/T5P44/1/).

## Installation

  Install with [component(1)](http://component.io):

    $ component install jheytompkins/progress

## Usage

Use with or without [component package manager](https://github.com/component/component). Simply create your progress line and append its element to a container of your choice.

	var progress = require('progress') //ONLY REQUIRED IF USING COMPONENT PACKAGE MANAGER

Only use the above if using with the [component package manager](https://github.com/component/component), else simply do something like the following;

	var myProgress = new progress('red'); // create a red progress line
	document.querySelector('.someContainer').appendChild(myProgess.element); // add it to the page
	myProgress.setProgress(5); // set it to 5% just to get it started.

Refer to the [demo](http://jsfiddle.net/T5P44/1/) or message me if you're stuck :)

## API

###setProgress(number progress)

Set the progress of the line by providing a number(percent) of the line to fill. This should be between 0 and 100.

###setColor(string color)

Set the color of the progress line by providing a string, either supported color name such as  `red` or hexidecimal value such as `#0000FF`. By default the progress line is set to green.

## License

  MIT
