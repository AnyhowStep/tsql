import {isObjectWithOwnEnumerableKeys} from "../type-util";

export interface IdentifierNode {
    readonly type : "Identifier";
    /**
     * Must have at least one identifier.
     *
     * MySQL will add backticks to each identifier, and separate each identifier with a dot.
     * PostgreSQL will add double quotes to each identifier, and separate each identifier with a dot.
     */
    readonly identifiers : readonly [string, ...string[]];
}

export function identifierNode (...identifiers : IdentifierNode["identifiers"]) : IdentifierNode {
    return {
        type : "Identifier",
        identifiers,
    };
}

/**
 * Does not check that each element of the `identifiers` property is a `string`
 *
 * @param mixed
 */
export function isIdentifierNode (mixed : unknown) : mixed is IdentifierNode {
    if (!isObjectWithOwnEnumerableKeys<IdentifierNode>()(
        mixed,
        [
            "type",
            "identifiers",
        ]
    )) {
        return false;
    }
    return (
        mixed.type === "Identifier" &&
        Array.isArray(mixed.identifiers) &&
        mixed.identifiers.length >= 1
    );
}
