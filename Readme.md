# sticky

  A sticky note for your browser that can be exported by email or text file. Compatible with [component package manager](https://github.com/component/component).

## Demo
	
A demo of sticky can be seen [here](http://jsfiddle.net/695p7/).

## Installation

  Install with [component(1)](http://component.io):

    $ component install jheytompkins/sticky

## Usage

Use with or without [component package manager](https://github.com/component/component). 

	var sticky = require('sticky') //ONLY REQUIRED IF USING COMPONENT PACKAGE MANAGER

Only use the above if using with the [component package manager](https://github.com/component/component), else you simply need to include the standalone file [sticky.js](https://github.com/jheytompkins/sticky/blob/master/sticky.js) and simply

	new sticky();

Refer to the [demo](http://jsfiddle.net/695p7/) or message me if you're stuck :)

## API

###email()

Sets up a draft email in your mail client of notes made.

###save()

Saves notes to a text file named `note.txt`.

## License

  MIT
