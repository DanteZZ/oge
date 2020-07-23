window._objects = {};

regObj = function(info) {
	if (!info) {return false;};
	if (!info.name) {return false;};
	_objects[info.name] = new Obj(info);
	return _objects[info.name];
}

addEventListener("project_load",function(event){
	_objects = {};
	if (event.detail.objects) {
		let list = event.detail.objects;
		for (var name in list) {
			let obj = list[name];
			if (obj[0] !== "/") {obj = "/"+obj;};
			obj = event.detail.path+obj;
			obj = loadObjectAsync(obj);
			obj.name = name;
			regObj(obj);
		};
	};
})

class Obj {
	constructor(info) {
		let inf = {
			name:"object",
			width:0,
			height:0,
			_draw: function(){
				if (this.sprite) {
					this.drawSprite({
						sprite:this.sprite,
						x:this.x,
						y:this.y
					});
				};
			}
		};

		info = $.extend(inf,info);
		for (var k in info) {
			this[k] = info[k];
		};
		return this;
	}
}