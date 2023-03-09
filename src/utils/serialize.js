"use strict";
exports.__esModule = true;
exports.serializeTx = void 0;
var serializeTx = function (api, tx) {
    if (!process.env.TX_VERBOSE)
        return "";
    var methodObject = JSON.parse(tx.method.toString());
    var args = JSON.stringify(methodObject.args);
    var callDecoded = api.registry.findMetaCall(tx.method.callIndex);
    if (callDecoded.method == "sudo" && callDecoded.method == "sudo") {
        var sudoCallIndex = tx.method.args[0].callIndex;
        var sudoCallArgs = JSON.stringify(methodObject.args.call.args);
        var sudoCallDecoded = api.registry.findMetaCall(sudoCallIndex);
        return " (sudo:: ".concat(sudoCallDecoded.section, ":: ").concat(sudoCallDecoded.method, "(").concat(sudoCallArgs, ")");
    }
    else {
        return " (".concat(callDecoded.section, ":: ").concat(callDecoded.method, "(").concat(args, "))");
    }
};
exports.serializeTx = serializeTx;
