addEventListener("after_init",function(event){

	Instance.prototype.createCollider = function(info) {
		this.check__colliders();
		if (!info) {return false;};
		if (!info.name) {return false;};

		if (!this.__colliders[info.name]) {
			this.__colliders[info.name] = new Collider(info);
			return this.__colliders[info.name];
		};
		return false;
	}

	Instance.prototype.drawColliders = function() {
		if (this.__colliders) {
			let ctx = oge._graph.getCanvas(oge.buffer.defaultLayer);
			ctx.beginPath();
			ctx.fillStyle = "rgba(58,111,155,0.3)";
			ctx.strokeStyle = "rgba(255,255,255,0.4)";
			for (var k in this.__colliders) {
				let col = this.__colliders[k];
				ctx.fillRect(this.x+col.x-ctx.offset_x, this.y+col.y-ctx.offset_y, col.width, col.height);
				ctx.rect(this.x+col.x-ctx.offset_x+1, this.y+col.y-ctx.offset_y+1, col.width-2, col.height-2);
			};
			ctx.stroke();
		};
	}

	Instance.prototype.onCollide = function(a,b) {
		if (!a) {return false;}

		if (a.constructor == Instance) {
			a = Array(a);
		} else if (findInstances(a).length) {
			a = findInstances(a);
		} else {
			return false;
		}

		if (b) {
			if (b.constructor == Instance) {
				b = Array(b);
			} else if (findInstances(b).length) {
				b = findInstances(b);
			} else {
				b = Array(this);
			}
		} else {
			b = Array(this);
		};

		if (a.length && b.length) {
			for (var ak in a) {
				let ainst = a[ak];
				for (var bk in b) {
					let binst = b[bk];
					
					if (ainst.__colliders && binst.__colliders) {

						for (var ca in ainst.__colliders) {
							for (var cb in binst.__colliders) {
								let acol = ainst.__colliders[ca];
								let bcol = binst.__colliders[cb];

								if (_onBoxMeeting({
									x:acol.x+ainst.x,
									y:acol.y+ainst.y,
									width:acol.width,
									height:acol.height
								},{
									x:bcol.x+binst.x,
									y:bcol.y+binst.y,
									width:bcol.width,
									height:bcol.height
								})) {return true;};
							}
						};

					}
				}
			};
		};
		return false;
	}

	Instance.prototype.onFree = function(x,y) {

		for (var k in oge.buffer.instances) {
			let inst = oge.buffer.instances[k];
			if (inst == this) { continue; }
			for (var ck in inst.__colliders) {
				col = inst.__colliders[ck];
				if (col.solid) {
					if (_onBoxMeeting({
						x:x,
						y:y,
						width:1,
						height:1
					},{
						x:inst.x+col.x,
						y:inst.y+col.y,
						width:col.width,
						height:col.height
					})) {return false;};
				};
			}
		};
		return true;
	}

	Instance.prototype.freeDistance = function(x,y) {

		let size = oge.buffer.scene.layers[oge.buffer.defaultLayer].height;

		for (var k in oge.buffer.instances) {
			let inst = oge.buffer.instances[k];
			if (inst == this) { continue; }
			for (var ck in inst.__colliders) {
				col = inst.__colliders[ck];
				if (col.solid) {
					for (var dist = 0; dist<size;dist++) {
						if (_onBoxMeeting({
							x:this.x+x*dist,
							y:this.y+y*dist,
							width:1,
							height:1
						},{
							x:inst.x+col.x,
							y:inst.y+col.y,
							width:col.width,
							height:col.height
						})) {return false;};
					}
					
				};
			}
		};

		return true;
	}

	Instance.prototype.freeDistanceCol = function(direction,collider) {

		let dirs = ["left","right","top","bottom"];

		if (dirs.indexOf(direction) > -1) {return false;};

		if (this.__colliders) {
			if (collider) {
				if (this.__colliders[collider]) {
					collider = this.__colliders[collider];
				} else {
					return false;
				};
			} else {
				for (var k in this.__colliders) {
					collider = this.__colliders[k];
					break;
				};
			}
		} else {
			return false;
		}
		
		/*
		let x = Math.cos(direction/ 180 * Math.PI);
		let y = Math.sin(direction/ 180 * Math.PI);
		*/

		let distantion = true;
		let size = oge.buffer.scene.layers[oge.buffer.defaultLayer].height;

		for (var k in oge.buffer.instances) {
			let inst = oge.buffer.instances[k];
			if (inst == this) { continue; }
			for (var ck in inst.__colliders) {
				col = inst.__colliders[ck];
				if (col.solid) {
					for (var dist = 0; dist<size;dist++) {
						let sx = 0;
						let sy = 0;

						switch (direction) {
							case "left":
								sx = this.x+x*dist+collider.x;
								sy = this.y+y*dist+collider.y;
								collider.width = 1;
							break;
							case "right":
								sx = this.x+x*dist+collider.x;
								sy = this.y+y*dist+collider.y;
								collider.width = 1;
							break;
							case "bottom":
								sx = this.x+x*dist+collider.x;
								sy = this.y+y*dist+collider.y;
								collider.width = 1;
							break;
							case "top":
								sx = this.x+x*dist+collider.x;
								sy = this.y+y*dist+collider.y;
								collider.width = 1;
							break;
						};

						if (_onBoxMeeting({
							x:sx,
							y:sy,
							width:collider.width,
							height:collider.height
						},{
							x:inst.x+col.x,
							y:inst.y+col.y,
							width:col.width,
							height:col.height
						})) {if ((distantion > dist) || (distantion === true)) {distantion = dist;}};
					}
					
				};
			}
		};
		return distantion;
	}

	Instance.prototype.check__colliders = function() {
		if (!this.__colliders) {this.__colliders = {};};
	}

})

class Collider {
	
	constructor(info) {
		let inf = {
			name:"collider",
			width:0,
			height:0,
			x:0,
			y:0,
			solid:true
		}
		info = $.extend(inf,info);
		for (var k in info) {
			this[k] = info[k];
		};
		return this;
	}

}

function _onBoxMeeting(one,two) {
	//console.log(one,two);
	return one.x < two.x + two.width && one.x + one.width > two.x && one.y < two.y + two.height && one.y + one.height > two.y;
}