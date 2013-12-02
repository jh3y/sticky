module.exports = sticky;
function sticky() {
	if (!(this instanceof sticky)) return new sticky();
	var draggable = require('draggable'),
		resizable = require('resizable'),
		element = document.createElement('div'),
		content = document.createElement('div'),
		notes = document.createElement('ul'),
		close = document.createElement('div'),
		save = document.createElement('div'),
		email = document.createElement('a'),
		newsticky = this,
		firstNote = newsticky._createNote('Click me to edit');
	newsticky.element = element;
	newsticky.element.className = 'sticky';
	newsticky.element.setAttribute('data-sticky', true);
	content.className = 'sticky-content';
	notes.className =  'sticky-notes';
	close.innerHTML = "";
	close.className = 'close';
	close.setAttribute('title', 'remove note');
	close.addEventListener('click', function () {
		element.remove();
	}, true);
	save.innerHTML = "";
	save.className = 'save';
	save.setAttribute('title', 'save note');
	save.addEventListener('click', function () {
		newsticky.save();
	}, true);
	email.innerHTML = '@';
	email.className = 'email';
	email.setAttribute('title', 'email note');
	email.addEventListener('click', function () {
		newsticky.email();
	});
	newsticky.element.appendChild(close);
	notes.appendChild(firstNote);
	content.appendChild(notes);
	newsticky.element.appendChild(content);
	newsticky.element.appendChild(email);
	newsticky.element.appendChild(save);
	document.body.appendChild(newsticky.element);
	//TODO: incompatible with jh3y/ghosting which is a shame and I think this is because the click handler gets confused when we do cloneNode so look at not using cloneNode.
	new draggable(newsticky.element, {'ghosting': false});
	new resizable(newsticky.element);
}
sticky.prototype._getContent = function () {
	var sticky = this,
		contentString = 'Here are your notes for today',
	 	regex = new RegExp( '%E2%80%A2', 'gi');
	[].forEach.call(sticky.element.querySelectorAll('.sticky-note'), function (note){
		contentString = contentString + '• ' + note.innerHTML.toString().trim();
	});
	contentString = encodeURIComponent(contentString.trim());
	return contentString.replace(regex, '%0D%0A%E2%80%A2');	
}
sticky.prototype.email = function () {
	var sticky = this,
		mailto = 'mailto:',
		recipient = 'someone@somewhere.com',
		d = new Date(),
		subject = 'note written on ' + d.toString(),
		mailtoString = mailto + recipient + '?subject=' + encodeURIComponent(subject.trim()) + '&body=' + sticky._getContent();
	sticky.element.querySelector('.email').setAttribute('href', mailtoString);
	sticky.element.querySelector('.email').click();
}
sticky.prototype.save = function () {
	var sticky = this,
		saveAnchor = document.createElement('a'),
		filename = 'note.txt',
		content = sticky._getContent();
	document.body.appendChild(saveAnchor);
	saveAnchor.setAttribute('download', filename);
	saveAnchor.setAttribute('href', 'data:text/plain,' + content);
	saveAnchor.click();
	saveAnchor.remove();
}
sticky.prototype._createNote = function (content) {
	var sticky = this,
		note = document.createElement('li'),
		notePress,
		l,
		newNote;
	note.className = 'sticky-note';
	note.innerHTML = (content !== undefined) ? content: null;
	note.setAttribute('contenteditable', true);
	note.addEventListener('keyup', function (e) {
		notePress = this;
		if (e.keyCode === 13 ) {
			e.preventDefault();
			notePress.innerHTML = notePress.innerHTML.replace('<div><br></div>', '').replace('<br><br>', '');
			newNote = sticky._createNote();
			sticky.element.querySelector('.sticky-notes').appendChild(newNote);
			newNote.focus();
		} else if ((e.keyCode === 8 || e.which === 8) && (this.innerHTML.trim() === "<br>" || this.innerHTML.trim() === '') && sticky.element.querySelectorAll('.sticky-note').length > 1) {
			e.preventDefault();
			this.remove();
			l = sticky.element.querySelectorAll('.sticky-note').length;
			sticky.element.querySelectorAll('.sticky-note')[l -1].focus();
		}
	});
	return note;
}
