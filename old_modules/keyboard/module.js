oge.buffer.mouse_keys = [];
oge.buffer.keys = [];

//Keyboard
document.addEventListener("keydown", handler => {
	key = handler.keyCode;
	if (oge.buffer.keys[key] == undefined) {
		oge.buffer.keys[key] = "pressed";
	} else {
		oge.buffer.keys[key] = "hold";
	}
});

document.addEventListener("keyup", handler => {
	key = handler.keyCode;
	oge.buffer.keys[key] = "released";
});


//Mouse

document.oncontextmenu = function (){return false};

function fixWhich(e) {
	if (!e.which && e.button) { // если which нет, но есть button... (IE8-)
	    if (e.button & 1) e.which = 1; // левая кнопка
	    else if (e.button & 4) e.which = 2; // средняя кнопка
	    else if (e.button & 2) e.which = 3; // правая кнопка
	};
	return e.which;
};

document.onmousedown = function(e) {
	e.which = fixWhich(e);
	key = e.which;
	oge.buffer.mouse_keys[key] = "pressed";
};

document.onmouseup = function(e) {
	e.which = fixWhich(e);
	key = e.which;
	oge.buffer.mouse_keys[key] = "released";
};

document.onmousemove = function(e) {
	window.mouse_x = e.clientX;
	window.mouse_y = e.clientY;
};



// KEY FUNCTIONS
function onKeyPress(key) {
	if (oge.buffer.keys[key] !== undefined) {
		if (oge.buffer.keys[key] == "pressed") { return true; }
	};
	return false;
}

function onKeyHold(key) {
	if (oge.buffer.keys[key] !== undefined) {
		if (oge.buffer.keys[key] !== "released") { return true; }
	};
	return false;
}

function onKeyRelease(key) {
	if (oge.buffer.keys[key] !== undefined) {
		if (oge.buffer.keys[key] == "released") { return true; }
	};
	return false;
}

// MOUSE FUNCTIONS
function onMousePress(key) {
	if (oge.buffer.mouse_keys[key] !== undefined) {
		if (oge.buffer.mouse_keys[key] == "pressed") { return true; }
	};
	return false;
}

function onMouseHold(key) {
	if (oge.buffer.mouse_keys[key] !== undefined) {
		if (oge.buffer.mouse_keys[key] !== "released") { return true; }
	};
	return false;
}

function onMouseRelease(key) {
	if (oge.buffer.mouse_keys[key] !== undefined) {
		if (oge.buffer.mouse_keys[key] == "released") { return true; }
	};
	return false;
}

addEventListener("after_update",function(){
	var res = [];
	for (var k in oge.buffer.keys) {
		if (oge.buffer.keys[k] !== "released") {
			res[k] = oge.buffer.keys[k];
		};
		if (oge.buffer.keys[k] == "pressed") {
			res[k] = "hold";
		};
	};
	oge.buffer.keys = res;

	// MOUSE KEYS
	var res = [];
	for (var k in oge.buffer.mouse_keys) {
		if (oge.buffer.mouse_keys[k] !== "released") {
			res[k] = oge.buffer.mouse_keys[k];
		};
		if (oge.buffer.mouse_keys[k] == "pressed") {
			res[k] = "hold";
		};
	};
	oge.buffer.mouse_keys = res;
})