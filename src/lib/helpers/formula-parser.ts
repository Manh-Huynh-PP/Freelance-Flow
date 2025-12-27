"use strict";

/**
 * Safe Formula Parser
 * Replaces eval() for formula calculations to comply with CSP
 * Supports: +, -, *, /, parentheses, and numbers
 */

type TokenType = 'NUMBER' | 'PLUS' | 'MINUS' | 'MUL' | 'DIV' | 'LPAREN' | 'RPAREN' | 'EOF';

interface Token {
    type: TokenType;
    value: number | null;
}

class FormulaLexer {
    private text: string;
    private pos: number;
    private currentChar: string | null;

    constructor(text: string) {
        this.text = text;
        this.pos = 0;
        this.currentChar = text.length > 0 ? text[0] : null;
    }

    private advance(): void {
        this.pos++;
        this.currentChar = this.pos < this.text.length ? this.text[this.pos] : null;
    }

    private skipWhitespace(): void {
        while (this.currentChar !== null && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    private number(): number {
        let result = '';
        while (this.currentChar !== null && /[\d.]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return parseFloat(result);
    }

    getNextToken(): Token {
        while (this.currentChar !== null) {
            if (/\s/.test(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }

            if (/[\d.]/.test(this.currentChar)) {
                return { type: 'NUMBER', value: this.number() };
            }

            if (this.currentChar === '+') {
                this.advance();
                return { type: 'PLUS', value: null };
            }

            if (this.currentChar === '-') {
                this.advance();
                return { type: 'MINUS', value: null };
            }

            if (this.currentChar === '*') {
                this.advance();
                return { type: 'MUL', value: null };
            }

            if (this.currentChar === '/') {
                this.advance();
                return { type: 'DIV', value: null };
            }

            if (this.currentChar === '(') {
                this.advance();
                return { type: 'LPAREN', value: null };
            }

            if (this.currentChar === ')') {
                this.advance();
                return { type: 'RPAREN', value: null };
            }

            throw new Error(`Invalid character: ${this.currentChar}`);
        }

        return { type: 'EOF', value: null };
    }
}

class FormulaParser {
    private lexer: FormulaLexer;
    private currentToken: Token;

    constructor(text: string) {
        this.lexer = new FormulaLexer(text);
        this.currentToken = this.lexer.getNextToken();
    }

    private eat(tokenType: TokenType): void {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            throw new Error(`Expected ${tokenType}, got ${this.currentToken.type}`);
        }
    }

    private factor(): number {
        const token = this.currentToken;

        if (token.type === 'NUMBER') {
            this.eat('NUMBER');
            return token.value as number;
        }

        if (token.type === 'LPAREN') {
            this.eat('LPAREN');
            const result = this.expr();
            this.eat('RPAREN');
            return result;
        }

        // Handle unary minus
        if (token.type === 'MINUS') {
            this.eat('MINUS');
            return -this.factor();
        }

        // Handle unary plus
        if (token.type === 'PLUS') {
            this.eat('PLUS');
            return this.factor();
        }

        throw new Error(`Unexpected token: ${token.type}`);
    }

    private term(): number {
        let result = this.factor();

        while (this.currentToken.type === 'MUL' || this.currentToken.type === 'DIV') {
            const token = this.currentToken;
            if (token.type === 'MUL') {
                this.eat('MUL');
                result *= this.factor();
            } else if (token.type === 'DIV') {
                this.eat('DIV');
                const divisor = this.factor();
                if (divisor === 0) {
                    throw new Error('Division by zero');
                }
                result /= divisor;
            }
        }

        return result;
    }

    private expr(): number {
        let result = this.term();

        while (this.currentToken.type === 'PLUS' || this.currentToken.type === 'MINUS') {
            const token = this.currentToken;
            if (token.type === 'PLUS') {
                this.eat('PLUS');
                result += this.term();
            } else if (token.type === 'MINUS') {
                this.eat('MINUS');
                result -= this.term();
            }
        }

        return result;
    }

    parse(): number {
        return this.expr();
    }
}

/**
 * Safely evaluate a mathematical expression without using eval()
 * 
 * @param expression - The mathematical expression to evaluate (e.g., "2 + 3 * 4")
 * @returns The calculated result, or NaN if the expression is invalid
 * 
 * @example
 * safeEval("2 + 3 * 4") // returns 14
 * safeEval("(2 + 3) * 4") // returns 20
 * safeEval("10 / 2 - 1") // returns 4
 */
export function safeEval(expression: string): number {
    if (!expression || typeof expression !== 'string') {
        return NaN;
    }

    // Clean the expression
    const cleanExpr = expression.trim();

    if (cleanExpr === '') {
        return NaN;
    }

    try {
        const parser = new FormulaParser(cleanExpr);
        const result = parser.parse();
        return result;
    } catch (error) {
        console.warn('Formula parse error:', error, 'Expression:', expression);
        return NaN;
    }
}

/**
 * Evaluate a formula with variable substitution
 * 
 * @param formula - The formula template (e.g., "quantity * unitPrice + 100")
 * @param variables - Object with variable values (e.g., { quantity: 5, unitPrice: 1000 })
 * @returns The calculated result, or NaN if evaluation fails
 */
export function evaluateFormula(formula: string, variables: Record<string, number>): number {
    if (!formula || typeof formula !== 'string') {
        return NaN;
    }

    let expression = formula;

    // Replace all variables with their values
    Object.entries(variables).forEach(([key, value]) => {
        // Handle negative values properly by wrapping in parentheses
        const replacement = value < 0 ? `(${value})` : String(value);
        // Use word boundary matching to avoid partial replacements
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        expression = expression.replace(regex, replacement);
        // Also try direct replacement for column IDs that may contain underscores
        expression = expression.replaceAll(key, replacement);
    });

    return safeEval(expression);
}

export default safeEval;
