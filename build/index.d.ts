import { Text } from '@polkadot/types';
/**
 * The Mangata class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export declare class Mangata {
    private static instance;
    private apiPromise;
    private uri;
    /**
     * The Mangata's constructor is private to prevent direct
     * construction calls with the `new` operator.
     * Initialised via isReady & new with specific provider
     */
    private constructor();
    private connect;
    /**
     * The static method that controls the access to the Mangata instance.
     */
    static getInstance(uri: string): Mangata;
    /**
     * Retrieve the chain name
     */
    getChain(): Promise<Text>;
    /**
     * Retrieve the node name
     */
    getNodeName(): Promise<Text>;
    /**
     * Retrieve the node version
     */
    getNodeVersion(): Promise<Text>;
}
