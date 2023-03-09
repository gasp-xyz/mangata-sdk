"use strict";
exports.__esModule = true;
exports.dbInstance = exports.sleep = void 0;
var InMemoryDatabase = /** @class */ (function () {
    function InMemoryDatabase() {
        var _this = this;
        this.db = {};
        this.hasAddressNonce = function (address) {
            return _this.db[address] ? true : false;
        };
        this.setNonce = function (address, nonce) {
            _this.db[address] = nonce;
        };
        this.getNonce = function (address) {
            return _this.db[address];
        };
        // empty constructor
    }
    InMemoryDatabase.getInstance = function () {
        if (!InMemoryDatabase.instance) {
            InMemoryDatabase.instance = new InMemoryDatabase();
        }
        return InMemoryDatabase.instance;
    };
    return InMemoryDatabase;
}());
var sleep = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.sleep = sleep;
exports.dbInstance = InMemoryDatabase.getInstance();
