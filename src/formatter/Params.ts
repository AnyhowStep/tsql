import {Token} from "./Token";

/* eslint-disable local/no-method */
/**
 * Handles placeholder replacement with given params.
 */
export class Params {
    private readonly params : string[]|{ [key : string] : string }|undefined;
    private index : number;
    /**
     * @param {Object} params
     */
    constructor(params : string[]|{ [key : string] : string }|undefined) {
        this.params = params;
        this.index = 0;
    }

    /**
     * Returns param value that matches given placeholder with param key.
     * @param {Object} token
     * @param {String} token.key Placeholder key
     * @param {String} token.value Placeholder value
     * @return {String} param or token.value when params are missing
     */
    get({key, value} : Token) {
        if (this.params == undefined) {
            return value;
        }
        if (key != undefined) {
            if (Array.isArray(this.params)) {
                throw new Error(`Cannot use array params with named placeholders`);
            } else {
                return this.params[key];
            }
        } else {
            if (Array.isArray(this.params)) {
                return this.params[this.index ++];
            } else {
                throw new Error(`Cannot use object params with index placeholders`);
            }
        }
    }
}
