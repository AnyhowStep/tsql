import {TokenType} from "./TokenType";
export interface Token {
    type : TokenType,
    value : string,
    key? : string,
}