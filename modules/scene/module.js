window._scenes = {};

regScene = function(info) {
	if (!info) {return false;};
	if (!info.name) {return false;};
	_scenes[info.name] = new Scene(info);
	return _scenes[info.name]; 
}

loadScene = function(name) {
	if (!_scenes[name]) {return false;};

	oge._graph.destroyAll();
	let scene = _scenes[name];

	dispatchEvent(new CustomEvent("before_scene_load",{bubbles:true,detail:scene}));

	if (scene.layers) {
		for (var k in scene.layers) {
			let layer = scene.layers[k];
			switch(layer.type) {
				case "2d": oge._graph.createCanvas(k,layer.type); break;
			}
		};
	}

	if (scene._create) {scene._create();}

	if (scene.cameras) {
		for (var k in scene.cameras) {
			createCamera(k,scene.cameras[k]);
		};
	};

	oge.buffer.scene = _scenes[name];
	oge.buffer.defaultLayer = scene.defaultLayer;

	setCamera(scene.defaultCam);


	if (scene.instances) {
		for (var k in scene.instances) {
			createInstance(scene.instances[k]);
		};
	};
	
	dispatchEvent(new CustomEvent("after_scene_load",{bubbles:true,detail:scene}));

	return true;
}

addEventListener("project_load",function(event){
	_scenes = {};
	oge._graph.destroyAll();
	if (event.detail.scenes) {
		let list = event.detail.scenes;
		for (var name in list) {
			let scene = list[name];
			if (scene[0] !== "/") {scene = "/"+scene;};
			let path = event.detail.path;
			scene = loadObjectAsync(path+scene);
			scene.name = name;
			scene.path = path;
			scene = regScene(scene);

			if (scene.load) {
				scene.load();
			};
		};
	};
});

addEventListener("start",function(){
	if (!loadScene(oge.project.defaultScene)) {
		alert("Неверное название defaultScene");
	}
});

addEventListener("before_draw",function(){
	if (oge.buffer.scene._draw) {oge.buffer.scene._draw();};
});

addEventListener("update",function(){
	if (oge.buffer.scene._update) {oge.buffer.scene._update();};
});

addEventListener("after_update",function(){
	if (oge.buffer.scene._updateLayers) {oge.buffer.scene._updateLayers();};
});

class Scene {
	constructor(info) {
		let inf = {
			name:"example",
			layers:{"game":{name:"game",position:0}},
			defaultLayer:"game"
		}

		info = $.extend(inf,info);

		for (var k in info) {
			this[k] = info[k];
		};

		return this;
	}

	addLayer(info) {
		if (!info) {return false;};
		if ((!info.name) || (this.layers[info.name])) {return false;};

		let inf = {
			name:"game",
			position:this.layers.length
		};

		info = $.extend(inf,info);

		this.layers[info.name] = info;
		return this.layers[info.name];
	}

	_updateLayers() {
		if (this.layers) {
			for (var name in this.layers) {
				let layer = this.layers[name];

				switch(layer.type) {
					case "2d": 
						let w = 0;
						let h = 0;
						if (layer.width) {w = layer.width} else {w = window.innerWidth;};
						if (layer.height) {h = layer.height} else {h = window.innerHeight;};
						oge._graph.setSize(name,w,h);
					break;
				};

			};
		}
	}
}