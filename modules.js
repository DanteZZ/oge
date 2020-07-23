class Modules {
	constructor() {

		this.modules_list = _fs.readdirSync("modules");

		for (var k in this.modules_list) {
			this.loadModule("modules/"+this.modules_list[k]+"/module.js");
		};
	}

	loadModule($path) {
		loadScriptAsync($path);
	}
}