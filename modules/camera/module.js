window._cameras = {};
oge.buffer.cameras = {};

regCam = function(info) {
	if (!info) {return false;};
	if (!info.name) {return false;};
	_cameras[info.name] = new Cam(info);
	return _cameras[info.name];
}

getCamera = function(name) {
	if (oge.buffer.cameras[name]) {
		return oge.buffer.cameras[name];
	};
	return false;
}

setCamera = function(name) {
	if (oge.buffer.cameras[name]) {
		oge.buffer.camera = oge.buffer.cameras[name];
	};
};

updateView = function() {
	if (!oge.buffer.camera) {return false;};
	let cam = oge.buffer.camera;
	let w = 0;
	let h = 0;
	if (cam.width) {w = cam.width} else {w = window.innerWidth;};
	if (cam.height) {h = cam.height} else {h = window.innerHeight;};
	oge._graph.setSize(oge.buffer.defaultLayer,w,h);

	if (cam.point) {
		let point = null;
		if (cam.point.constructor !== Instance) {
			find = findInstances(cam.point);
			if (find[0]) {
				point = find[0];
			};
		} else {
			point = cam.point;
		};

		if (point) {
			cam.x = (point.x-parseInt(w/2));
			cam.y = (point.y-parseInt(h/2));
		};
	}


	let deflay = oge.buffer.scene.layers[oge.buffer.defaultLayer];
	if (cam.x < 0) {cam.x = 0;};
	if (cam.y < 0) {cam.y = 0;};
	if ((cam.x+w) > deflay.width) {cam.x = deflay.width-w;};
	if ((cam.y+h) > deflay.height) {cam.y = deflay.height-h;};

	if (w > deflay.width) { cam.x = -(w-deflay.width)/2; };
	if (h > deflay.height) { cam.y = -(h-deflay.height)/2; };

	oge._graph.setOffset(oge.buffer.defaultLayer,cam.x,cam.y);
};

createCamera = function(name,info) {
	if ((_cameras[name]) && (oge.buffer.cameras[name] == undefined)) {
		let c = _cameras[name];
		let cam = {};

		for (var par in c) {
			if (typeof(c[par]) == "object") {
				cam[par] = JSON.parse(JSON.stringify(c[par]));
			} else {
				cam[par] = c[par];
			};
		};

		for (var par in info) {
			cam[par] = info[par];
		};

		oge.buffer.cameras[name] = cam;
	};

}

class Cam {
	constructor(info) {
		let inf = {
			name:"cam",
			width:0,
			height:0,
			x:0,
			y:0,
			point:null
		}
		info = $.extend(inf,info);
		for (var k in info) {
			this[k] = info[k];
		};
		return this;
	}
}

addEventListener("project_load",function(event){
	_cameras = {};
	if (event.detail.cameras) {
		let list = event.detail.cameras;
		for (var name in list) {
			let cam = list[name];
			cam.name = name;
			regCam(cam);
		};
	};
})

addEventListener("before_draw",updateView)