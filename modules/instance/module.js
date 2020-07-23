oge.buffer.instances = [];
oge.buffer.lastInstId = 0;

createInstance = function(info) {
	if (!info) {return false;};
	if (!info.name) {return false;};

	let obj = _objects[info.name];
	let iid = parseInt(oge.buffer.lastInstId);
	oge.buffer.instances[iid] = new Instance(info,obj,iid);

	if (oge.buffer.instances[iid]._create !== undefined) {
		oge.buffer.instances[iid]._create();
	};
	oge.buffer.lastInstId++;
	return oge.buffer.instances[iid];
}

findInstances = function(name) {
	let list = [];
	for (var k in oge.buffer.instances) {
		if (!oge.buffer.instances[k]) {continue;}
		if (oge.buffer.instances[k].name == name) {
			list.push(oge.buffer.instances[k]);
		};
	}

	if (list.length) {
		return list;
	} else {
		return false;
	}
}

__drawEvent = function() {
	for (var id in oge.buffer.instances) {
		let instance = oge.buffer.instances[id];
		if (!instance) {continue;}
		if (instance._draw) {instance._draw();};
	}
}

__updateEvent = function() {
	for (var id in oge.buffer.instances) {
		let instance = oge.buffer.instances[id];
		if (!instance) {continue;}

		instance.prevent_x = instance.x;
		instance.prevent_y = instance.y;

		if (instance._update) {instance._update();};
	}
}

__sortInstances = function() {
	oge.buffer.instances.sort(function(a,b) {
		return a.depth-b.depth;
	});
}

destroyInstance = function(inst) {
	if (inst.constructor == Instance) {
		oge.buffer.instances[inst.id] = null;
		return true;
	} else if (oge.buffer.instances[inst]) {
		oge.buffer.instances[inst] = null;
		return true;
	} else {
		return false;
	};
}

addEventListener("project_load",function(event){
	oge.buffer.instances = [];
	oge.buffer.lastInstId = 0;
})

addEventListener("before_draw",__sortInstances);
addEventListener("update",__updateEvent);
addEventListener("draw",__drawEvent);

class Instance {
	constructor(inf,obj,id) {
		this.depth = 0;
		for (var par in obj) {
			if (typeof(obj[par]) == "object") {
				this[par] = JSON.parse(JSON.stringify(obj[par]));
			} else {
				this[par] = obj[par];
			};
		};
		for (var par in inf) {
			this[par] = inf[par];
		};
		this.id = id;
	}
	
	destroy() {
		oge.buufer.instances[this.id] = null;
	}
}