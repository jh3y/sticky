module.exports = sticky;
function sticky() {
	if (!(this instanceof sticky)) return new sticky();
	var draggable = require('draggable');
	var resizable = require('resizable');
	var thisSticky = this;
	var element = document.createElement('div');
	thisSticky.element = element;
	element.className = 'sticky';
	//add content - this could actually be a ul li and then we press enter when we want a new list item.
	var content = document.createElement('div');
	content.className = 'sticky-content';
	var notes = document.createElement('ul');
	notes.className =  'sticky-notes';
	var firstNote = thisSticky._createNote('Click me to edit');
	notes.appendChild(firstNote);
	content.appendChild(notes);
	element.appendChild(content);
	var close = document.createElement('div');
	close.innerHTML = 'X';
	close.className = 'close';
	close.addEventListener('click', function () {
		element.remove();
	}, true);
	element.appendChild(close);
	var email = document.createElement('a');
	email.innerHTML = '@';
	email.className = 'email';
	//create the string that needs to be emailed here complete with spacing and subject line etc. Maybe just do like recipient, subject is note made on date and content is whatever you put in the sticky note.
	var mailtoString = '';
	email.setAttribute('href', mailtoString);
	element.appendChild(email);
	document.body.appendChild(element);
	//incompatible with ghosting which is a shame and I think this is because the click handler gets confused when we do cloneNode.
	new draggable(element, {'ghosting': false});
	new resizable(element);
}
sticky.prototype._createNote = function (content) {
	var sticky = this;
	var note = document.createElement('li');
	note.className = 'sticky-note';
	note.innerHTML = (content !== undefined) ? content: null;
	note.setAttribute('contenteditable', true);
	note.addEventListener('keyup', function (e) {
		var notePress = this;
		if (e.keyCode === 13 ) {
			e.preventDefault();
			notePress.innerHTML = notePress.innerHTML.replace('<div><br></div>', '').replace('<br><br>', '');
			var note = sticky._createNote();
			sticky.element.querySelector('.sticky-notes').appendChild(note);
			note.focus();
		} else if ((e.keyCode === 8 || e.which === 8) && (this.innerHTML.trim() === "<br>" || this.innerHTML.trim() === '') && sticky.element.querySelectorAll('.sticky-note').length > 1) {
			e.preventDefault();
			this.remove();
			var l = sticky.element.querySelectorAll('.sticky-note').length;
			sticky.element.querySelectorAll('.sticky-note')[l -1].focus();
		}
	});
	return note;
}
