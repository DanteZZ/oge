module.exports = {
	init:function(oge) {
		this.oge = oge;
		this.canvases = {};
	},

	getCanvas:function(name) {
		if (this.canvases[name]) {return this.canvases[name];}
	},

	createCanvas:function(name,context) {
		if (!name) {return false;};
		if (!context) {context = "2d";};
		if (this.canvases[name]) {return false;};

		let canvas = document.createElement("canvas");
		this.canvases[name] = canvas.getContext(context);
		document.body.appendChild(canvas);
		this.canvases[name].offset_x = 0;
		this.canvases[name].offset_y = 0;
		return this.canvases[name];
	},

	clear:function(name) {
		let list = {};
		if ((name) && (this.canvases[name])) {
			list[name] = this.canvases[name];
		} else {
			list = this.canvases;
		};
		for (var name in list) {
			let canv = list[name];
			canv.clearRect(0, 0, canv.canvas.width, canv.canvas.height);
		};
		return true;
	},

	setSize:function(name,width,height) {
		if (this.canvases[name]) {
			let canv = this.canvases[name].canvas;
			if (!width) {canv.width=window.innerWidth;} else {canv.width = width;};
			if (!height) {canv.height=window.innerHeight;} else {canv.height = height;};
			return true;
		} else {
			return false;
		}
	},

	setAllSizes:function(width,height) {
		for (var name in this.canvases) {
			let canv = this.canvases[name].canvas;
			if (!width) {canv.width=window.innerWidth;} else {canv.width = width;};
			if (!height) {canv.height=window.innerHeight;} else {canv.height = height;};	
		};
		return true;
	},

	setOffset:function(name,x,y) {
		if (this.canvases[name]) {
			let canv = this.canvases[name];
			canv.offset_x = x;
			canv.offset_y = y;
			return true;
		} else {
			return false;
		}
	},

	restore:function(name) {
		let list = {};
		if ((name) && (this.canvases[name])) {
			list[name] = this.canvases[name];
		} else {
			list = this.canvases;
		};
		for (var name in list) {
			let canv = list[name];
			canv.restore();
		};
		return true;
	},

	destroyCanvas:function(name) {
		if (this.canvases[name]) {
			let canv = this.canvases[name].canvas;
			$(canv).remove();
			delete this.canvases[name];
		} else {
			return false;
		}
	},

	destroyAll:function() {
		if (this.canvases) {
			for (var k in this.canvases) {
				let canv = this.canvases[k].canvas;
				$(canv).remove();
				this.canvases = {};
			};
			return true;
		} else {
			return false;
		}
	},

	drawImage:function(info) {
		if (!this.canvases[info.canvas]) {return false;};
		let ctx = this.getCanvas(info.canvas);

		if (info.rotation) {
			ctx.save();
			ctx.translate(info.x-ctx.offset_x+info.dwidth/2, info.y-ctx.offset_y+info.dheight/2);
			ctx.rotate(info.rotation* Math.PI / 180);
			ctx.translate(-(info.x-ctx.offset_x+info.dwidth/2), -(info.y-ctx.offset_y+info.dheight/2));
		}

		ctx.drawImage(
			info.image,

			info.offset_x,
			info.offset_y,
			info.swidth,
			info.sheight,

			info.x-ctx.offset_x,
			info.y-ctx.offset_y,
			info.dwidth,
			info.dheight
		);
		if (info.rotation) {  ctx.restore(); };
		return true;
	}
};

addEventListener("before_draw",function(){oge._graph.clear()});
addEventListener("after_draw",function(){oge._graph.restore()});