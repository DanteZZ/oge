class Libs {
	constructor() {
		window.libLoad = {
			path:null,
			name:null
		};

		this.lib_list = _fs.readdirSync("libraries");

		for (var k in this.lib_list) {
			if (_fs.lstatSync("libraries/"+this.lib_list[k]).isDirectory()) {
				this.loadLibrary(k,"libraries/"+this.lib_list[k]);
			}
		};
	}

	loadLibrary(name, path) {
		if (_fs.lstatSync(path+"/_lib.js").isFile()) {
			window.libLoad.path = path;
			window.libLoad.name = name;
			loadScriptAsync(path+"/_lib.js");
		};
	}
}