import {TokenType} from "./TokenType";
import {Token} from "./Token";

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = RegExp(reRegExpChar.source);
function escapeRegExp (str : string) {
    return (str != "" && reHasRegExpChar.test(str))
        ? str.replace(reRegExpChar, '\\$&')
        : str;
}

/* eslint-disable local/no-method */
export class Tokenizer {
    private readonly WHITESPACE_REGEX : RegExp;
    private readonly NUMBER_REGEX : RegExp;
    private readonly OPERATOR_REGEX : RegExp;

    private readonly BLOCK_COMMENT_REGEX = /^(\/\*[^]*?(?:\*\/|$))/;
    private readonly LINE_COMMENT_REGEX : RegExp;

    private readonly RESERVED_TOPLEVEL_REGEX : RegExp;
    private readonly RESERVED_NEWLINE_REGEX : RegExp;
    private readonly RESERVED_PRE_NEWLINE_REGEX : RegExp;
    private readonly RESERVED_PLAIN_REGEX : RegExp;

    private readonly WORD_REGEX : RegExp;
    private readonly STRING_REGEX : RegExp;

    private readonly OPEN_PAREN_REGEX : RegExp;
    private readonly CLOSE_PAREN_REGEX : RegExp;

    private readonly INDEXED_PLACEHOLDER_REGEX : RegExp|undefined;
    private readonly IDENT_NAMED_PLACEHOLDER_REGEX : RegExp|undefined;
    private readonly STRING_NAMED_PLACEHOLDER_REGEX : RegExp|undefined;
    /**
     * @param {Object} cfg
     *  @param {String[]} cfg.reservedWords Reserved words in SQL
     *  @param {String[]} cfg.reservedToplevelWords Words that are set to new line separately
     *  @param {String[]} cfg.reservedNewlineWords Words that are set to newline
     *  @param {String[]} cfg.stringTypes String types to enable: "", '', ``, [], N''
     *  @param {String[]} cfg.openParens Opening parentheses to enable, like (, [
     *  @param {String[]} cfg.closeParens Closing parentheses to enable, like ), ]
     *  @param {String[]} cfg.indexedPlaceholderTypes Prefixes for indexed placeholders, like ?
     *  @param {String[]} cfg.namedPlaceholderTypes Prefixes for named placeholders, like @ and :
     *  @param {String[]} cfg.lineCommentTypes Line comments to enable, like # and --
     *  @param {String[]} cfg.specialWordChars Special chars that can be found inside of words, like @ and #
     */
    constructor(cfg : {
        reservedWords : string[],
        reservedToplevelWords : string[],
        reservedNewlineWords : string[],
        reservedPreNewlineWords : string[],
        stringTypes : ("``"|"[]"|"\"\""|"''"|"N''"|"X''")[],
        openParens : string[],
        closeParens : string[],
        indexedPlaceholderTypes : string[],
        namedPlaceholderTypes : string[],
        lineCommentTypes : string[],
        specialWordChars : string[]|undefined,
    }) {
        this.WHITESPACE_REGEX = /^(\s+)/;
        this.NUMBER_REGEX = /^((-\s*)?[0-9]+(\.[0-9]+)?|0x[0-9a-fA-F]+|0b[01]+)\b/;
        //Added <=> as the NULL-safe equality operator
        this.OPERATOR_REGEX = /^(<=>|!=|<>|==|<=|>=|!<|!>|\|\||::|->>|->|~~\*|~~|!~~\*|!~~|~\*|!~\*|!~|.)/;

        this.BLOCK_COMMENT_REGEX = /^(\/\*[^]*?(?:\*\/|$))/;
        this.LINE_COMMENT_REGEX = this.createLineCommentRegex(cfg.lineCommentTypes);

        this.RESERVED_TOPLEVEL_REGEX = this.createReservedWordRegex(cfg.reservedToplevelWords);
        this.RESERVED_NEWLINE_REGEX = this.createReservedWordRegex(cfg.reservedNewlineWords);
        this.RESERVED_PRE_NEWLINE_REGEX = this.createReservedWordRegex(cfg.reservedPreNewlineWords);
        this.RESERVED_PLAIN_REGEX = this.createReservedWordRegex(cfg.reservedWords);

        this.WORD_REGEX = this.createWordRegex(cfg.specialWordChars);
        this.STRING_REGEX = this.createStringRegex(cfg.stringTypes);

        this.OPEN_PAREN_REGEX = this.createParenRegex(cfg.openParens);
        this.CLOSE_PAREN_REGEX = this.createParenRegex(cfg.closeParens);

        this.INDEXED_PLACEHOLDER_REGEX = this.createPlaceholderRegex(cfg.indexedPlaceholderTypes, "[0-9]*");
        this.IDENT_NAMED_PLACEHOLDER_REGEX = this.createPlaceholderRegex(cfg.namedPlaceholderTypes, "[a-zA-Z0-9._$]+");
        this.STRING_NAMED_PLACEHOLDER_REGEX = this.createPlaceholderRegex(
            cfg.namedPlaceholderTypes,
            this.createStringPattern(cfg.stringTypes)
        );
    }

    createLineCommentRegex(lineCommentTypes : string[]) {
        return new RegExp(`^((?:${lineCommentTypes.map(c => escapeRegExp(c)).join("|")}).*?(?:\n|$))`);
    }

    createReservedWordRegex(reservedWords : string[]) {
        const reservedWordsPattern = reservedWords.join("|").replace(/ /g, "\\s+");
        return new RegExp(`^(${reservedWordsPattern})\\b`, "i");
    }

    createWordRegex(specialChars : string[] = []) {
        return new RegExp(`^([\\w${specialChars.join("")}]+)`);
    }

    createStringRegex(stringTypes : ("``"|"[]"|"\"\""|"''"|"N''"|"X''")[]) {
        return new RegExp(
            "^(" + this.createStringPattern(stringTypes) + ")"
        );
    }

    // This enables the following string patterns:
    // 1. backtick quoted string using `` to escape
    // 2. square bracket quoted string (SQL Server) using ]] to escape
    // 3. double quoted string using "" or \" to escape
    // 4. single quoted string using '' or \' to escape
    // 5. national character quoted string using N'' or N\' to escape
    createStringPattern(stringTypes : ("``"|"[]"|"\"\""|"''"|"N''"|"X''")[]) {
        const patterns = {
            "``": "((`[^`]*($|`))+)",
            "[]": "((\\[[^\\]]*($|\\]))(\\][^\\]]*($|\\]))*)",
            "\"\"": "((\"[^\"\\\\]*(?:\\\\.[^\"\\\\]*)*(\"|$))+)",
            "''": "(('[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
            "N''": "((N'[^N'\\\\]*(?:\\\\.[^N'\\\\]*)*('|$))+)",
            "X''": "((X'[^X'\\\\]*(?:\\\\.[^X'\\\\]*)*('|$))+)",
        };

        return stringTypes.map(t => patterns[t]).join("|");
    }

    createParenRegex(parens : string[]) {
        return new RegExp(
            "^(" + parens.map(p => this.escapeParen(p)).join("|") + ")",
            "i"
        );
    }

    escapeParen(paren : string) {
        if (paren.length === 1) {
            // A single punctuation character
            return escapeRegExp(paren);
        }
        else {
            // longer word
            return "\\b" + paren + "\\b";
        }
    }

    createPlaceholderRegex(types : string[], pattern : string) {
        if (types.length == 0) {
            return undefined;
        }
        const typesRegex = types.map(escapeRegExp).join("|");

        return new RegExp(`^((?:${typesRegex})(?:${pattern}))`);
    }

    /**
     * Takes a SQL string and breaks it into tokens.
     * Each token is an object with type and value.
     *
     * @param {String} input The SQL string
     * @return {Object[]} tokens An array of tokens.
     *  @return {String} token.type
     *  @return {String} token.value
     */
    tokenize(input : string) {
        const tokens = [];
        let token : Token|undefined;

        // Keep processing the string until it is empty
        while (input.length > 0) {
            // Get the next token and the token type
            token = this.getNextToken(input, token);
            if (token == undefined) {
                throw new Error(`No token found`);
            }
            // Advance the string
            input = input.substring(token.value.length);

            tokens.push(token);
        }
        return tokens;
    }

    getNextToken(input : string, previousToken : Token|undefined) {
        //eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        return this.getWhitespaceToken(input) ||
            this.getCommentToken(input) ||
            this.getStringToken(input) ||
            this.getOpenParenToken(input) ||
            this.getCloseParenToken(input) ||
            this.getPlaceholderToken(input) ||
            this.getNumberToken(input) ||
            this.getReservedWordToken(input, previousToken) ||
            this.getWordToken(input) ||
            this.getOperatorToken(input);
    }

    getWhitespaceToken(input : string) {
        return this.getTokenOnFirstMatch({
            input,
            type: TokenType.WHITESPACE,
            regex: this.WHITESPACE_REGEX
        });
    }

    getCommentToken(input : string) {
        //eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        return this.getLineCommentToken(input) || this.getBlockCommentToken(input);
    }

    getLineCommentToken(input : string) {
        return this.getTokenOnFirstMatch({
            input,
            type: TokenType.LINE_COMMENT,
            regex: this.LINE_COMMENT_REGEX
        });
    }

    getBlockCommentToken(input : string) {
        return this.getTokenOnFirstMatch({
            input,
            type: TokenType.BLOCK_COMMENT,
            regex: this.BLOCK_COMMENT_REGEX
        });
    }

    getStringToken(input : string) {
        return this.getTokenOnFirstMatch({
            input,
            type: TokenType.STRING,
            regex: this.STRING_REGEX
        });
    }

    getOpenParenToken(input : string) {
        return this.getTokenOnFirstMatch({
            input,
            type: TokenType.OPEN_PAREN,
            regex: this.OPEN_PAREN_REGEX
        });
    }

    getCloseParenToken(input : string) {
        return this.getTokenOnFirstMatch({
            input,
            type: TokenType.CLOSE_PAREN,
            regex: this.CLOSE_PAREN_REGEX
        });
    }

    getPlaceholderToken(input : string) {
        //eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        return this.getIdentNamedPlaceholderToken(input) ||
            this.getStringNamedPlaceholderToken(input) ||
            this.getIndexedPlaceholderToken(input);
    }

    getIdentNamedPlaceholderToken(input : string) {
        return this.getPlaceholderTokenWithKey({
            input,
            regex: this.IDENT_NAMED_PLACEHOLDER_REGEX,
            parseKey: (v) => v.slice(1)
        });
    }

    getStringNamedPlaceholderToken(input : string) {
        return this.getPlaceholderTokenWithKey({
            input,
            regex: this.STRING_NAMED_PLACEHOLDER_REGEX,
            parseKey: (v) => this.getEscapedPlaceholderKey({key: v.slice(2, -1), quoteChar: v.slice(-1)})
        });
    }

    getIndexedPlaceholderToken(input : string) {
        return this.getPlaceholderTokenWithKey({
            input,
            regex: this.INDEXED_PLACEHOLDER_REGEX,
            parseKey: (v) => v.slice(1)
        });
    }

    getPlaceholderTokenWithKey({input, regex, parseKey} : {input : string, regex : RegExp|undefined, parseKey : (v : string) => string}) {
        const token = this.getTokenOnFirstMatch({input, regex, type: TokenType.PLACEHOLDER});
        if (token == undefined) {
            return undefined;
        }
        token.key = parseKey(token.value);
        return token;
    }

    getEscapedPlaceholderKey({key, quoteChar} : {key : string, quoteChar : string}) {
        return key.replace(new RegExp(escapeRegExp("\\") + quoteChar, "g"), quoteChar);
    }

    // Decimal, binary, or hex numbers
    getNumberToken(input : string) {
        return this.getTokenOnFirstMatch({
            input,
            type: TokenType.NUMBER,
            regex: this.NUMBER_REGEX
        });
    }

    // Punctuation and symbols
    getOperatorToken(input : string) {
        return this.getTokenOnFirstMatch({
            input,
            type: TokenType.OPERATOR,
            regex: this.OPERATOR_REGEX
        });
    }

    getReservedWordToken(input : string, previousToken : Token|undefined) {
        // A reserved word cannot be preceded by a "."
        // this makes it so in "mytable.from", "from" is not considered a reserved word
        if (previousToken != undefined && previousToken.value === ".") {
            return;
        }
        return (
            //eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            this.getToplevelReservedToken(input) ||
            this.getNewlineReservedToken(input) ||
            this.getPreNewlineReservedToken(input) ||
            this.getPlainReservedToken(input)
        );
    }

    getToplevelReservedToken(input : string) {
        return this.getTokenOnFirstMatch({
            input,
            type: TokenType.RESERVED_TOPLEVEL,
            regex: this.RESERVED_TOPLEVEL_REGEX
        });
    }

    getNewlineReservedToken(input : string) {
        return this.getTokenOnFirstMatch({
            input,
            type: TokenType.RESERVED_NEWLINE,
            regex: this.RESERVED_NEWLINE_REGEX
        });
    }

    getPreNewlineReservedToken(input : string) {
        return this.getTokenOnFirstMatch({
            input,
            type: TokenType.RESERVED_PRE_NEWLINE,
            regex: this.RESERVED_PRE_NEWLINE_REGEX
        });
    }

    getPlainReservedToken(input : string) {
        return this.getTokenOnFirstMatch({
            input,
            type: TokenType.RESERVED,
            regex: this.RESERVED_PLAIN_REGEX
        });
    }

    getWordToken(input : string) {
        return this.getTokenOnFirstMatch({
            input,
            type: TokenType.WORD,
            regex: this.WORD_REGEX
        });
    }

    getTokenOnFirstMatch({input, type, regex} : {
        input : string,
        type : TokenType,
        regex : RegExp|undefined,
    }) : Token|undefined {
        const matches = (regex == undefined) ?
        undefined:
        input.match(regex);

        if (matches == undefined) {
            return undefined;
        }
        const value = matches[1];
        if (value == undefined) {
            throw new Error(`No value found; is the regex missing a capture group?`);
        }

        return {type, value};
    }
}
