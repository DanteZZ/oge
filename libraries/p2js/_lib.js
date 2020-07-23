let libInf = libLoad;
loadScriptAsync(libInf.path+"/p2.js");

function drawBox(body){
    ctx.beginPath();
    var x = body.position[0],
        y = body.position[1],
        s = body.shapes[0];
    ctx.save();
    ctx.translate(x, y);     // Translate to the center of the box
    ctx.rotate(body.angle);  // Rotate to the box body frame
    ctx.fillRect(-s.width/2, -s.height/2, s.width, s.height);
    ctx.restore();
}


addEventListener("before_update",function(event){
	if (oge.buffer._p2World) {
		if (typeof(deltaTime) !== "undefined") {
			oge.buffer._p2World.step(deltaTime,deltaTime, 10);
			for (var k in oge.buffer.instances) {
				let inst = oge.buffer.instances[k];
				if (inst.p2Body) {
					let pos = inst.p2Body.position;
					inst.x = pos[0]+inst.p2Body.offset[0];
					inst.y = pos[1]+inst.p2Body.offset[1];
					inst.rotation = inst.p2Body.angle;
				}
			}
		}
		
	};
});
