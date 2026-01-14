"use strict";

/**
 * Safe Formula Parser
 * Replaces eval() for formula calculations to comply with CSP
 * Supports: +, -, *, /, ^ (power), parentheses, numbers (including scientific notation), and ignores commas
 */

type TokenType = 'NUMBER' | 'PLUS' | 'MINUS' | 'MUL' | 'DIV' | 'POWER' | 'LPAREN' | 'RPAREN' | 'EOF';

interface Token {
    type: TokenType;
    value: number | null;
}

const createLexer = (text: string) => {
    // Pre-process: remove commas to handle numbers like 1,000 or 1,5 (becomes 15 like in calculator)
    const processedText = text.replace(/,/g, '');
    let pos = 0;

    const getCurrentChar = () => pos < processedText.length ? processedText[pos] : null;

    const advance = () => {
        pos++;
    };

    const number = (): number => {
        let result = '';
        let char = getCurrentChar();

        while (char !== null && /[\d.]/.test(char)) {
            result += char;
            advance();
            char = getCurrentChar();
        }

        // Handle scientific notation (e.g., 1e5, 1.2E-3)
        if (char !== null && /[eE]/.test(char)) {
            result += char;
            advance();
            char = getCurrentChar();

            if (char !== null && /[+-]/.test(char)) {
                result += char;
                advance();
                char = getCurrentChar();
            }
            while (char !== null && /\d/.test(char)) {
                result += char;
                advance();
                char = getCurrentChar();
            }
        }

        return parseFloat(result);
    };

    const getNextToken = (): Token => {
        let char = getCurrentChar();

        while (char !== null) {
            if (/\s/.test(char)) {
                advance();
                char = getCurrentChar();
                continue;
            }

            if (/[\d.]/.test(char)) {
                return { type: 'NUMBER', value: number() };
            }

            if (char === '+') { advance(); return { type: 'PLUS', value: null }; }
            if (char === '-') { advance(); return { type: 'MINUS', value: null }; }
            if (char === '*') { advance(); return { type: 'MUL', value: null }; }
            if (char === '/') { advance(); return { type: 'DIV', value: null }; }
            if (char === '^') { advance(); return { type: 'POWER', value: null }; }
            if (char === '(') { advance(); return { type: 'LPAREN', value: null }; }
            if (char === ')') { advance(); return { type: 'RPAREN', value: null }; }

            throw new Error(`Invalid character: ${char}`);
        }

        return { type: 'EOF', value: null };
    };

    return { getNextToken };
};

const parseExpression = (text: string): number => {
    const lexer = createLexer(text);
    let currentToken = lexer.getNextToken();

    const eat = (tokenType: TokenType) => {
        if (currentToken.type === tokenType) {
            currentToken = lexer.getNextToken();
        } else {
            throw new Error(`Expected ${tokenType}, got ${currentToken.type}`);
        }
    };

    const factor = (): number => {
        const token = currentToken;

        if (token.type === 'NUMBER') {
            eat('NUMBER');
            return token.value as number;
        }

        if (token.type === 'LPAREN') {
            eat('LPAREN');
            const result = expr();
            eat('RPAREN');
            return result;
        }

        // Handle unary minus
        if (token.type === 'MINUS') {
            eat('MINUS');
            return -factor();
        }

        // Handle unary plus
        if (token.type === 'PLUS') {
            eat('PLUS');
            return factor();
        }

        throw new Error(`Unexpected token: ${token.type}`);
    };

    const power = (): number => {
        let result = factor();

        while (currentToken.type === 'POWER') {
            eat('POWER');
            const exponent = factor();
            result = Math.pow(result, exponent);
        }

        return result;
    };

    const term = (): number => {
        let result = power();

        while (currentToken.type === 'MUL' || currentToken.type === 'DIV') {
            const token = currentToken;
            if (token.type === 'MUL') {
                eat('MUL');
                result *= power();
            } else if (token.type === 'DIV') {
                eat('DIV');
                const divisor = power();
                if (divisor === 0) {
                    throw new Error('Division by zero');
                }
                result /= divisor;
            }
        }

        return result;
    };

    const expr = (): number => {
        let result = term();

        while (currentToken.type === 'PLUS' || currentToken.type === 'MINUS') {
            const token = currentToken;
            if (token.type === 'PLUS') {
                eat('PLUS');
                result += term();
            } else if (token.type === 'MINUS') {
                eat('MINUS');
                result -= term();
            }
        }

        return result;
    };

    const result = expr();

    // Ensure we consumed the entire expression
    if (currentToken.type !== 'EOF') {
        throw new Error(`Unexpected token at end of expression: ${currentToken.type}`);
    }

    return result;
};

/**
 * Safely evaluate a mathematical expression without using eval()
 * 
 * @param expression - The mathematical expression to evaluate (e.g., "2 + 3 * 4")
 * @returns The calculated result, or NaN if the expression is invalid
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
        return parseExpression(cleanExpr);
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
