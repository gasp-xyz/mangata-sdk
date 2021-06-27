"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mangata = void 0;
const api_1 = require("@polkadot/api");
/**
 * The Mangata class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
class Mangata {
    /**
     * The Mangata's constructor is private to prevent direct
     * construction calls with the `new` operator.
     * Initialised via isReady & new with specific provider
     */
    constructor(uri) {
        this.apiPromise = null;
        this.uri = uri;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.apiPromise) {
                const provider = new api_1.WsProvider(this.uri);
                this.apiPromise = new api_1.ApiPromise({ provider }).isReady;
            }
            return this.apiPromise;
        });
    }
    /**
     * The static method that controls the access to the Mangata instance.
     */
    static getInstance(uri) {
        if (!Mangata.instance) {
            Mangata.instance = new Mangata(uri);
        }
        return Mangata.instance;
    }
    /**
     * Retrieve the chain name
     */
    getChain() {
        return __awaiter(this, void 0, void 0, function* () {
            const api = yield this.connect();
            const chain = yield api.rpc.system.chain();
            return chain;
        });
    }
    /**
     * Retrieve the node name
     */
    getNodeName() {
        return __awaiter(this, void 0, void 0, function* () {
            const api = yield this.connect();
            const name = yield api.rpc.system.name();
            return name;
        });
    }
    /**
     * Retrieve the node version
     */
    getNodeVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const api = yield this.connect();
            const version = yield api.rpc.system.version();
            return version;
        });
    }
}
exports.Mangata = Mangata;
