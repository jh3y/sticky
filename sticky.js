;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("jheytompkins-draggable/index.js", function(exports, require, module){
module.exports = draggable;

function draggable(element, options) {
	if (!(this instanceof draggable)) return new draggable(element);
	this.element = element;
	this._defaults = {
		contained: false,
		pens: false,
		vertical: true,
		horizontal: true
	};
	var extend = function (a, b) {
		for(var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}
	this._options = extend(this._defaults, options);
	this._parent = (this._options.contained) ? this.element.parentNode: window;
	this._roam = (this._options.roam  !== undefined) ? this._options.roam : true;
	this._contained = (this._options.contained !== undefined) ? this._options.contained : false;
	this._pens = this._options.pens;
	this._vertical = (this._options.vertical !== undefined) ? this._options.vertical : true;
	this._horizontal = (this._options.horizontal !== undefined) ? this._options.horizontal : true;
	this._ghosting = (this._options.ghosting !== undefined) ? this._options.ghosting : false;
	this._create();
}
draggable.prototype.setPens = function (pens) {
	if (pens) {
		this._pens = pens;
	}
}
draggable.prototype.setContained = function (contained) {
	if (contained !== undefined) {
		this._contained = contained;
	}
}
draggable.prototype.setRoam = function (roam) {
	if (roam !== undefined) {
		this._roam = roam;
	}
}
draggable.prototype.setVertical = function (vertical) {
	if (vertical !== undefined) {
		this._vertical = vertical;
	}
}
draggable.prototype.setHorizontal = function (horizontal) {
	if (horizontal !== undefined) {
		this._horizontal = horizontal;
	}
}
draggable.prototype.setGhosting = function (ghosting) {
	if (ghosting !== undefined) {
		this._ghosting = ghosting;
	}
}
draggable.prototype._create = function () {
	var draggable = this,
		ghost,
		drag = function (event) {
			//TODO: really cool that on move here you could almost make online paint, didn't even think of that.
			// ghost = draggable.element.cloneNode();
			// ghost.style.opacity = 0.5;
			// document.querySelector('body').appendChild(ghost);
			draggable.element.style.position = 'absolute';
			draggable._newY = event.clientY - draggable._offY;
			draggable._newX = event.clientX - draggable._offX;
			if (draggable._contained) {	
				if (draggable._newX < draggable._boundsXL) {
					draggable._newX = draggable._boundsXL;
				}
				if (draggable._newX > draggable._boundsXR) {
					draggable._newX = draggable._boundsXR;
				}
				if (draggable._newY > draggable._boundsXB) {
					draggable._newY = draggable._boundsXB;
				}
				if (draggable._newY < draggable._boundsXT) {
					draggable._newY = draggable._boundsXT;
				}
			}
			if (draggable._horizontal) {
				draggable.element.style.left = draggable._newX + 'px';
			}
			if (draggable._vertical) {
				draggable.element.style.top = draggable._newY + 'px';
			}
		},
		endDrag = function () {
			if (draggable._ghosting) {
				[].forEach.call(document.querySelectorAll('.ghost'), function (ghost) {
					ghost.remove();
				});
			}
			draggable._parent.removeEventListener('mousemove', drag, true);
			if (draggable._pens && draggable._pens.length > 0) {
				var penned = false,
					currentPen = draggable.element.parentNode,
					isAPen = function (element) {
						for (var i = 0; i <= draggable._pens.length - 1; i++) {
							if (currentPen === draggable._pens[i]) {
								return true;
							}
						};
					};
				for (var i = 0; i < draggable._pens.length - 1; i++) {
					if (draggable._newX < (draggable._pens[i].offsetLeft + draggable._pens[i].offsetWidth) && draggable._newX > (draggable._pens[i].offsetLeft - draggable.element.offsetWidth) && draggable._newY > (draggable._pens[i].offsetTop - draggable.element.offsetHeight) && draggable._newY < (draggable._pens[i].offsetTop + draggable._pens[i].offsetHeight + draggable.element.offsetHeight)) {
						penned = true;
						draggable.element.style.position = '';
						draggable._pens[i].appendChild(draggable.element);
						break;
					}
				};
				if (!penned) {
					if (draggable._roam) {
						document.querySelector('body').appendChild(draggable.element);
					} else {
						if (isAPen(currentPen)) {
							currentPen.appendChild(draggable.element);
							draggable.element.style.position = '';
						}
					}
				}
			}
		},
		startDrag = function (event) {
			draggable._offY = event.clientY - parseInt(draggable.element.offsetTop);
			draggable._offX = event.clientX - parseInt(draggable.element.offsetLeft);
			draggable._boundsXR = (draggable._parent.offsetLeft + draggable._parent.offsetWidth) - draggable.element.offsetWidth;
			draggable._boundsXL = draggable._parent.offsetLeft;
			draggable._boundsXT = draggable._parent.offsetTop;
			draggable._boundsXB = (draggable._parent.offsetTop + draggable._parent.offsetHeight) - draggable.element.offsetHeight;
			if (draggable._ghosting) {
				ghost = draggable.element.cloneNode();
				ghost.className = ghost.className + ' ghost';
				draggable.element.parentNode.appendChild(ghost);
				ghost.style.opacity = 0.2;
				ghost.style.position = 'absolute';
				ghost.style.left = draggable.element.offsetLeft + 'px';
				ghost.style.top = draggable.element.offsetTop + 'px';
			}
			draggable._parent.addEventListener('mouseup', function () {
				endDrag();
			}, false);
			draggable._parent.addEventListener('mousemove', drag, true);
		};
	draggable.element.className = draggable.element.className + ' drggable';
	draggable.element.addEventListener('mousedown', startDrag, false);
    	draggable.element.addEventListener('mouseup', endDrag, false);
}

});
require.register("jheytompkins-resizable/index.js", function(exports, require, module){
module.exports = resizable;

function resizable(element, options) {
	if (!(this instanceof resizable)) return new resizable(element, options);
	this._defaults = {
		directions: ['north', 'south', 'west', 'east', 'southeast', 'southwest', 'northeast', 'northwest']
	};
	this.element = element;
	var extend = function (a, b) {
		for(var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}
	this._options = extend(this._defaults, options);
	this._directions = this._options.directions;
	this._ghosting = (this._options.ghosting !== undefined) ? this._options.ghosting : false; 
	this._create();
}
resizable.prototype.setGhosting = function (ghosting) {
	if (ghosting !== undefined) {
		this._ghosting = ghosting;
	}
}
resizable.prototype.setDirections = function (directions) {
	var resizable = this,
		currentDirections = resizable._directions;
	if (directions === undefined) {
		directions = resizable._options.directions;
	}
	resizable._directions = directions;
	[].forEach.call(currentDirections, function (direction) {
		if (directions.indexOf(direction) === -1) {
			resizable.element.querySelector('.rsize-d-' + direction).style.display = 'none';
		}
	});
	[].forEach.call(resizable._directions, function (direction) {	
		if (resizable.element.querySelector('.rsize-d-' + direction) !== undefined) {
			resizable.element.querySelector('.rsize-d-' + direction).style.display = 'block';
		} else {
			resizable._createHandle(direction);
		}
	});
}
resizable.prototype._createHandle = function (direction) {
	var resizable = this,
		rh = document.createElement('div'),
		ghost,
		resize = function (e) {
			if (direction.indexOf('north') !== -1) {
				resizable.element.style.top = e.pageY + "px";
				resizable.element.style.height = (resizable._startH + (resizable._startY - e.pageY)) + "px";
			}
			if (direction.indexOf('south') !== -1) {
				resizable.element.style.height = (resizable._startH + (e.pageY - resizable._startY)) + "px";
			}
			if (direction.indexOf('east') !== -1) {
				resizable.element.style.width = (resizable._startW + (e.pageX - resizable._startX)) + "px";
			}
			if (direction.indexOf('west') !== -1) {
				resizable.element.style.left = e.pageX + "px";
				resizable.element.style.width = (resizable._startW + (resizable._startX - e.pageX)) + "px";
			}
		},
		stop = function () {
			if (resizable._ghosting) {
				[].forEach.call(resizable.element.parentNode.querySelectorAll('.ghost'), function (ghost) {
					ghost.remove();
				});
			}
			window.removeEventListener("mousemove", resize, true);
		},
		start = function (e) {
			e.stopPropagation();
			resizable._startX = e.pageX;
			resizable._startY = e.pageY;
			resizable._startW = resizable.element.offsetWidth;
			resizable._startH = resizable.element.offsetHeight;	
			window.addEventListener("mousemove", resize, true);
			window.addEventListener("mouseup", stop, true);
			if (resizable._ghosting) {
				ghost = document.createElement('div');
				resizable.element.parentNode.appendChild(ghost);
				ghost.className = 'ghost';
				ghost.style.border = '1px dashed #000';
				ghost.style.background = 'transparent';
				ghost.style.position = 'absolute';
				ghost.style.width = resizable.element.offsetWidth - 2 + 'px';
				ghost.style.height = resizable.element.offsetHeight - 2 + 'px';
				ghost.style.left = resizable.element.offsetLeft + 'px';
				ghost.style.top = resizable.element.offsetTop + 'px';
			}
		};
	rh.className = rh.className + ' rsize-d rsize-d-' + direction;
	rh.setAttribute('data-rsize-d', direction);
	resizable.element.appendChild(rh);
	rh.addEventListener("mousedown", start, false);
}
resizable.prototype._create = function () {
	var resizable = this;
	resizable.element.className = resizable.element.className + ' rsizable';
	[].forEach.call(resizable._directions, function (direction) {
		resizable._createHandle(direction);
	});
}

});
require.register("sticky/index.js", function(exports, require, module){
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
	//TODO: incompatible with jheytompkins/ghosting which is a shame and I think this is because the click handler gets confused when we do cloneNode so look at not using cloneNode.
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

});


require.alias("jheytompkins-draggable/index.js", "sticky/deps/draggable/index.js");
require.alias("jheytompkins-draggable/index.js", "sticky/deps/draggable/index.js");
require.alias("jheytompkins-draggable/index.js", "draggable/index.js");
require.alias("jheytompkins-draggable/index.js", "jheytompkins-draggable/index.js");
require.alias("jheytompkins-resizable/index.js", "sticky/deps/resizable/index.js");
require.alias("jheytompkins-resizable/index.js", "sticky/deps/resizable/index.js");
require.alias("jheytompkins-resizable/index.js", "resizable/index.js");
require.alias("jheytompkins-resizable/index.js", "jheytompkins-resizable/index.js");
require.alias("sticky/index.js", "sticky/index.js");if (typeof exports == "object") {
  module.exports = require("sticky");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("sticky"); });
} else {
  this["sticky"] = require("sticky");
}})();