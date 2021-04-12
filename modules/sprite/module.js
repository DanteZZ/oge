let fns = {
	regSprite:function(info) {
		if (!info) {return false;};
		if (!info.name) {return false;};
		if (!info.src) {return false;};
		this._sprites[info.name] = new this.Sprite(info);
		return this._sprites[info.name];
	}
}



class Sprite {
	constructor(info) {
		let inf = {
			name:"sprite",
			width:0,
			height:0,
			original_width:0,
			original_height:0,
			frames:1,
			center_x:0,
			center_y:0
		}
		info = Object.assign(inf,info);
		for (var k in info) {
			this[k] = info[k];
		};

		this.image = new Image();
		this.image.src = this.base64_encode(this.src);

		this.original_width = this.image.width;
		this.original_height = this.image.height;

		if (!this.width) {
			this.width = this.original_width/this.frames;
		};
		if (!this.height) {
			this.height = this.original_height;
		};

		return this;
	} 

	base64_encode(path) {
	    var image = _fs.readFileSync(path, 'base64');
	    return "data:image/png;base64,"+image;
	}
}


module.exports = {
	_init:function(oge) {
		this.oge = oge;
		this.oge._sprites = {};
		for (var n in fns) {
			this.oge[n] = fns[n];
		};
		this.oge.Sprite = Sprite;
		Object.assign(this.oge.Sprite.prototype, {_oge:this.oge});
	}
}

/*++++++++++++++++

addEventListener("project_load",function(event){
	_sprites = {};
	if (event.detail.sprites) {
		let list = event.detail.sprites;
		for (var name in list) {
			let sprite = list[name];
			sprite.name = name;
			if (sprite.src[0] == "/") {sprite.src = sprite.src.substr(1);};
			sprite.src = event.detail.path+sprite.src;
			regSprite(sprite);
		};
	};
})

addEventListener("after_init",function(event){

	Instance.prototype.setSprite = function(sprite) {
		this.check__sprites();

		if (_sprites[sprite]) {
			this.sprite = sprite;
			if (this.__sprites[sprite]) {this.__sprites[sprite].frame = 0;};
		}
	}

	Instance.prototype.setSpriteSpeed = function(speed) {
		this.spriteSpeed = speed;
	}

	Instance.prototype.setSpriteFrame = function(sprite,frame) {
		this.check__sprites();

		if (this.__sprites[sprite]) {
			this.__sprites[sprite].frame = frame;
		} else {
			this.__sprites[sprite] = {
				frame:frame,
				lastFrameTime:Date.now()
			}
		}
	}

	Instance.prototype.check__sprites = function() {
		if (!this.__sprites) {this.__sprites = {};};
		if (this.spriteSpeed == undefined) { this.spriteSpeed = 1; };
	}

	Instance.prototype.drawSprite = function(info) {

		this.check__sprites();

		inf = {
			sprite:false,
			layer:oge.buffer.defaultLayer,
			x:0,
			y:0,
			offset_x:0,
			offset_y:0
		};

		info = $.extend(inf,info);
		
		if (info.sprite.constructor !== Sprite) {
			if (_sprites[info.sprite]) {
				info.sprite = _sprites[info.sprite];
			} else {
				return false;
			};
		};

		if (!this.__sprites[info.sprite.name]) {this.__sprites[info.sprite.name] = {
			frame:0,
			lastFrameTime:Date.now()
		}};

		let spInf = this.__sprites[info.sprite.name];

		if (info.sprite.frames > 1) {
			if ((this.spriteSpeed > 0) && (info.sprite.speed > 0)) {
				if (Date.now() >= spInf.lastFrameTime+(1000*(info.sprite.speed/info.sprite.frames))*this.spriteSpeed) {
					if (spInf.frame == info.sprite.frames-1) {
						spInf.lastFrameTime = Date.now();
						spInf.frame = 0;
					} else {
						spInf.lastFrameTime = Date.now();
						spInf.frame++;
					};
				};
			};
			info.offset_x = spInf.frame*info.sprite.width;
		};

		this.__sprites[info.sprite.name] = spInf;


		info.image = info.sprite.image;
		
		info.swidth = info.sprite.width;
		info.sheight = info.sprite.height;

		info.dwidth = info.sprite.width;
		info.dheight = info.sprite.height;

		info.x -= info.sprite.center_x;
		info.y -= info.sprite.center_y;

		if (this.rotation) {info.rotation = this.rotation;};

		info.canvas = info.layer;

		delete info.layer;

		return oge._graph.drawImage(info);
	}
})

*/