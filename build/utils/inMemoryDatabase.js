class InMemoryDatabase {
    static instance;
    db = {};
    constructor() {
        // empty constructor
    }
    static getInstance() {
        if (!InMemoryDatabase.instance) {
            InMemoryDatabase.instance = new InMemoryDatabase();
        }
        return InMemoryDatabase.instance;
    }
    hasAddressNonce = (address) => {
        return this.db[address] ? true : false;
    };
    setNonce = (address, nonce) => {
        this.db[address] = nonce;
    };
    getNonce = (address) => {
        return this.db[address];
    };
}
export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
export const dbInstance = InMemoryDatabase.getInstance();
