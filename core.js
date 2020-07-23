window._fs = require('fs');
window._mime = require('mime');

function loadScriptAsync(link) { // Подключение скрипта
	$.ajax({
	    async: false,
	    url: link,
	    dataType: "script"
	});
};
function loadObjectAsync(link) { // Подключение модуля
	let script =  $.ajax({
	    async: false,
	    url: link,
	    dataType: "text"
	});
	return eval("("+script.responseText+")");
};

class OGEngine {
	constructor() {
		this.buffer = {};
		this.project = {};
		this.FPSLimit = 0;
		this.frameStart = Date.now();
		this.events = {
			after_init: new Event("after_init",{bubbles:true}),

			before_load: new Event("before_project_load",{bubbles:true}),
			after_load: new Event("after_project_load",{bubbles:true}),

			before_start: new Event("before_start",{bubbles:true}),
			start: new Event("start",{bubbles:true}),
			after_start: new Event("after_start",{bubbles:true}),

			before_update: new Event("before_update",{bubbles:true}),
			update: new Event("update",{bubbles:true}),
			after_update: new Event("after_update",{bubbles:true}),

			before_draw: new Event("before_draw",{bubbles:true}),
			draw: new Event("draw",{bubbles:true}),
			after_draw: new Event("after_draw",{bubbles:true}),
		}
	}

	init() {
		this._mdl = new Modules();
		this._lib = new Libs();
		this._graph = new Graphic();
		dispatchEvent(this.events.after_init);
	}

	loadProject(path,callback) {
		if (path[path.length-1] !== "/") {path = path+"/";};
		this.project = loadObjectAsync(path+"project.js");
		this.project.path = path;

		dispatchEvent(this.events.before_load);

		this.events.load = new CustomEvent("project_load",{bubbles:true,detail:this.project});
		if (this.project.FPSLimit !== undefined) {this.FPSLimit = this.project.FPSLimit;};
		
		dispatchEvent(this.events.load);
		dispatchEvent(this.events.after_load);
		
		if (callback) {callback();};
	}
	start() {
		dispatchEvent(this.events.before_start);
		dispatchEvent(this.events.start);
		dispatchEvent(this.events.after_start);
		this.frameUpdate();
	}
	frameUpdate() {
		dispatchEvent(oge.events.before_update);
		dispatchEvent(oge.events.update);
		dispatchEvent(oge.events.after_update);
		oge.frameDraw();

		oge.realFPS = Math.round(1000/(Date.now()-oge.frameStart))+1;
		window.deltaTime = (Date.now()-oge.frameStart)/1000;
		oge.frameStart = Date.now();

		if (oge.FPSLimit) {
			setTimeout(function() {requestAnimationFrame(oge.frameUpdate);}, 1000 / oge.FPSLimit);
		} else {
			requestAnimationFrame(oge.frameUpdate);
		}
	}
	frameDraw() {
		dispatchEvent(this.events.before_draw);
		dispatchEvent(this.events.draw);
		dispatchEvent(this.events.after_draw);
	}
}

$(document).ready(function(){
	window.oge = new OGEngine();
	oge.init();
	oge.loadProject("projects/platformer");
	oge.start();
})
