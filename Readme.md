# sticky

  A sticky note for your browser that can be exported by email or text file. Compatible with [component package manager](https://github.com/component/component).

## demo
	
A demo of sticky can be seen [here](http://jsfiddle.net/695p7/).

## installation

  Install with [component(1)](http://component.io):

    $ component install jheytompkins/sticky

## usage
Use with or without [component package manager](https://github.com/component/component).
###use with [component package manager](https://github.com/component/component)

	var sticky = require('sticky') //ONLY REQUIRED IF USING COMPONENT PACKAGE MANAGER
	new sticky(); //or var mySticky = new sticky(); if wanting to use the API functions.

Refer to the [demo](http://jsfiddle.net/695p7/) or message me if you're stuck :)
###use without component package manager
Simply need to include the standalone file [sticky.js](https://github.com/jheytompkins/sticky/blob/master/sticky.js) and simply

	new sticky(); //or var mySticky = new sticky(); if wanting to use the API functions.

Refer to the [demo](http://jsfiddle.net/695p7/) or message me if you're stuck :)

## api

###email()

Sets up a draft email in your mail client of notes made.

###save()

Saves notes to a text file named `note.txt`.

##dependencies
__sticky__ relies on the the two following components:
* [jheytompkins/resizable](https://github.com/jheytompkins/resizable)
* [jheytompkins/draggable](https://github.com/jheytompkins/draggable)

##contributions
and suggestions are of course welcome :)

## license

  MIT
