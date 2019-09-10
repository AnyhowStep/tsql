import {TokenType} from "./TokenType";
import {Indentation} from "./Indentation";
import {InlineBlock} from "./InlineBlock";
import {Params} from "./Params";
import {Tokenizer} from "./Tokenizer";
import {Token} from "./Token";

export interface FormatterConfig {
    indent? : string,
    params? : string[]|{ [key : string] : string }|undefined,
}

/* eslint-disable local/no-method */
export class Formatter {
    private readonly cfg : FormatterConfig;
    private readonly indentation : Indentation;
    private readonly inlineBlock : InlineBlock;
    private readonly params : Params;
    private readonly tokenizer : Tokenizer;
    private previousReservedWord : Token|undefined;
    private tokens : Token[];
    private index : number;
    /**
     * @param {Object} cfg
     *   @param {Object} cfg.indent
     *   @param {Object} cfg.params
     * @param {Tokenizer} tokenizer
     */
    constructor(cfg : FormatterConfig|undefined, tokenizer : Tokenizer) {
        this.cfg = (cfg == undefined) ?
            {} :
            cfg;
        this.indentation = new Indentation(this.cfg.indent);
        this.inlineBlock = new InlineBlock();
        this.params = new Params(this.cfg.params);
        this.tokenizer = tokenizer;
        this.previousReservedWord = undefined;
        this.tokens = [];
        this.index = 0;
    }

    /**
     * Formats whitespaces in a SQL string to make it easier to read.
     *
     * @param {String} query The SQL query string
     * @return {String} formatted query
     */
    format(query : string) {
        this.tokens = this.tokenizer.tokenize(query);
        const formattedQuery = this.getFormattedQueryFromTokens();

        return formattedQuery.trim();
    }

    getFormattedQueryFromTokens() {
        let formattedQuery = "";

        this.tokens.forEach((token, index) => {
            this.index = index;

            if (token.type === TokenType.WHITESPACE) {
                // ignore (we do our own whitespace formatting)
            }
            else if (token.type === TokenType.LINE_COMMENT) {
                formattedQuery = this.formatLineComment(token, formattedQuery);
            }
            else if (token.type === TokenType.BLOCK_COMMENT) {
                formattedQuery = this.formatBlockComment(token, formattedQuery);
            }
            else if (token.type === TokenType.RESERVED_TOPLEVEL) {
                formattedQuery = this.formatToplevelReservedWord(token, formattedQuery);
                this.previousReservedWord = token;
            }
            else if (token.type === TokenType.RESERVED_NEWLINE) {
                formattedQuery = this.formatNewlineReservedWord(token, formattedQuery);
                this.previousReservedWord = token;
            }
            else if (token.type === TokenType.RESERVED_PRE_NEWLINE) {
                formattedQuery = this.formatPreNewlineReservedWord(token, formattedQuery);
                this.previousReservedWord = token;
            }
            else if (token.type === TokenType.RESERVED) {
                formattedQuery = this.formatWithSpaces(token, formattedQuery);
                this.previousReservedWord = token;
            }
            else if (token.type === TokenType.OPEN_PAREN) {
                formattedQuery = this.formatOpeningParentheses(token, formattedQuery);
            }
            else if (token.type === TokenType.CLOSE_PAREN) {
                formattedQuery = this.formatClosingParentheses(token, formattedQuery);
            }
            else if (token.type === TokenType.PLACEHOLDER) {
                formattedQuery = this.formatPlaceholder(token, formattedQuery);
            }
            else if (token.value === ",") {
                formattedQuery = this.formatComma(token, formattedQuery);
            }
            else if (token.value === ":") {
                formattedQuery = this.formatWithSpaceAfter(token, formattedQuery);
            }
            else if (token.value === "." || token.value === ";") {
                formattedQuery = this.formatWithoutSpaces(token, formattedQuery);
            }
            else {
                formattedQuery = this.formatWithSpaces(token, formattedQuery);
            }
        });
        return formattedQuery;
    }

    formatLineComment(token : Token, query : string) {
        return this.addNewline(query + token.value);
    }

    formatBlockComment(token : Token, query : string) {
        return this.addNewline(this.addNewline(query) + this.indentComment(token.value));
    }

    indentComment(comment : string) {
        return comment.replace(/\n/g, "\n" + this.indentation.getIndent());
    }

    formatToplevelReservedWord(token : Token, query : string) {
        this.indentation.decreaseTopLevel();

        query = this.addNewline(query);

        this.indentation.increaseToplevel();

        query += this.equalizeWhitespace(token.value);
        return this.addNewline(query);
    }

    formatNewlineReservedWord(token : Token, query : string) {
        //Different from original implementation. I think this looks nicer.
        if (query.length > 0 && !query.endsWith(" ")) {
            query += " ";
        }
        return this.addNewline(query + this.equalizeWhitespace(token.value));
    }

    formatPreNewlineReservedWord(token : Token, query : string) {
        //The original formatNewlineReservedWord() implementation
        //Useful for WHEN clause of CASE
        return this.addNewline(query) + this.equalizeWhitespace(token.value) + " ";
    }

    // Replace any sequence of whitespace characters with single space
    equalizeWhitespace(string : string) {
        return string.replace(/\s+/g, " ");
    }

    // Opening parentheses increase the block indent level and start a new line
    formatOpeningParentheses(token : Token, query : string) {
        // Take out the preceding space unless there was whitespace there in the original query
        // or another opening parens or line comment
        const preserveWhitespaceFor = [
            TokenType.WHITESPACE,
            TokenType.OPEN_PAREN,
            TokenType.LINE_COMMENT,
        ];

        if (!this.hasPreviousToken() || !preserveWhitespaceFor.includes(this.previousToken().type)) {
            query = query.trimRight();
        }
        query += token.value;

        this.inlineBlock.beginIfPossible(this.tokens, this.index);

        if (!this.inlineBlock.isActive()) {
            this.indentation.increaseBlockLevel();
            query = this.addNewline(query);
        }
        return query;
    }

    // Closing parentheses decrease the block indent level
    formatClosingParentheses(token : Token, query : string) {
        if (this.inlineBlock.isActive()) {
            this.inlineBlock.end();
            return this.formatWithSpaceAfter(token, query);
        }
        else {
            this.indentation.decreaseBlockLevel();
            return this.formatWithSpaces(token, this.addNewline(query));
        }
    }

    formatPlaceholder(token : Token, query : string) {
        return query + this.params.get(token) + " ";
    }

    // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
    formatComma(token : Token, query : string) {
        query = this.trimTrailingWhitespace(query) + token.value + " ";

        if (this.inlineBlock.isActive()) {
            return query;
        }
        else if (this.previousReservedWord != undefined && /^LIMIT$/i.test(this.previousReservedWord.value)) {
            return query;
        }
        else {
            return this.addNewline(query);
        }
    }

    formatWithSpaceAfter(token : Token, query : string) {
        return this.trimTrailingWhitespace(query) + token.value + " ";
    }

    formatWithoutSpaces(token : Token, query : string) {
        return this.trimTrailingWhitespace(query) + token.value;
    }

    formatWithSpaces(token : Token, query : string) {
        if (token.value == "HACKED_AND_NO_NEW_LINE") {
            return query + "AND" + " ";
        }
        return query + token.value + " ";
    }

    addNewline(query : string) {
        return query.trimRight() + "\n" + this.indentation.getIndent();
    }

    trimTrailingWhitespace(query : string) {
        if (this.hasPreviousNonWhitespaceToken() && this.previousNonWhitespaceToken().type === TokenType.LINE_COMMENT) {
            return query.trimRight() + "\n";
        }
        else {
            return query.trimRight();
        }
    }

    hasPreviousNonWhitespaceToken () : boolean {
        let n = 1;
        while (this.hasPreviousToken(n) && this.previousToken(n).type === TokenType.WHITESPACE) {
            n++;
        }
        return this.hasPreviousToken(n);
    }
    previousNonWhitespaceToken() {
        let n = 1;
        while (this.previousToken(n).type === TokenType.WHITESPACE) {
            n++;
        }
        return this.previousToken(n);
    }

    hasPreviousToken (offset = 1) : boolean {
        return (this.index - offset) >= 0;
    }
    previousToken(offset = 1) : Token {
        const result = this.tokens[this.index - offset];
        if (result == undefined) {
            throw new Error(`No previous token. index ${this.index}, offset ${offset}`);
        }
        return result;
    }
}
