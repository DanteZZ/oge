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

		info = Object.assign(inf,info);
		for (var k in info) {
			this[k] = info[k];
		};
		return this;
	}
};

module.exports = {
	_init:function(oge) {
		this.oge = oge;
		this.oge._objects = {};
		this.oge.regObj = function(info) {
			if (!info) {return false;};
			if (!info.name) {return false;};
			this._objects[info.name] = new this.Obj(info);
			return this._objects[info.name];
		}
		this.oge.Obj = Obj;
		Object.assign(this.oge.Obj.prototype, {_oge:this.oge});
	}
}

/* +++++++++++++++++++
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
*/