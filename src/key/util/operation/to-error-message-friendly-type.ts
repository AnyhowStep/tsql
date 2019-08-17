import {Key} from "../../key";

/**
 * Used to generate nicer looking error messages
 */
export type ToErrorMessageFriendlyType<KeyT extends Key> = (
    KeyT extends Key ?
    (KeyT[number])[] :
    never
);
