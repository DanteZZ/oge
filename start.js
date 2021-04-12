function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
};
document.oncontextmenu = function (){return false};
global.console = console;
const _oge = requireUncached("oge.js");
_oge.init();
//_oge.loadProject("projects/example");
//_oge.start();