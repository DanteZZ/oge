module.exports = {
	init:function(oge) {
		this.oge = oge;
		this.modules_list = this.oge._fs.readdirSync("modules");

		for (var k in this.modules_list) {
			this.loadModule("modules/"+this.modules_list[k]+"/module.js");
		};
	},

	loadModule:function(path) {
		this.oge.requireUncached(path)._init(this.oge);
	}
}
