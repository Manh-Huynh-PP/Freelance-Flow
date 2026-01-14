
// Mocking the FormulaParser logic inline to avoid import issues in standalone script
class FormulaLexer {
    constructor(text) {
        this.text = text.replace(/,/g, '');
        this.pos = 0;
        this.currentChar = this.text.length > 0 ? this.text[0] : null;
    }

    advance() {
        this.pos++;
        this.currentChar = this.pos < this.text.length ? this.text[this.pos] : null;
    }

    skipWhitespace() {
        while (this.currentChar !== null && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    number() {
        let result = '';
        while (this.currentChar !== null && /[\d.]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }

        if (this.currentChar !== null && /[eE]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
            if (this.currentChar !== null && /[+-]/.test(this.currentChar)) {
                result += this.currentChar;
                this.advance();
            }
            while (this.currentChar !== null && /\d/.test(this.currentChar)) {
                result += this.currentChar;
                this.advance();
            }
        }

        return parseFloat(result);
    }

    getNextToken() {
        while (this.currentChar !== null) {
            if (/\s/.test(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }

            if (/[\d.]/.test(this.currentChar)) {
                return { type: 'NUMBER', value: this.number() };
            }

            if (this.currentChar === '+') { this.advance(); return { type: 'PLUS', value: null }; }
            if (this.currentChar === '-') { this.advance(); return { type: 'MINUS', value: null }; }
            if (this.currentChar === '*') { this.advance(); return { type: 'MUL', value: null }; }
            if (this.currentChar === '/') { this.advance(); return { type: 'DIV', value: null }; }
            if (this.currentChar === '^') { this.advance(); return { type: 'POWER', value: null }; }
            if (this.currentChar === '(') { this.advance(); return { type: 'LPAREN', value: null }; }
            if (this.currentChar === ')') { this.advance(); return { type: 'RPAREN', value: null }; }

            throw new Error(`Invalid character: ${this.currentChar}`);
        }
        return { type: 'EOF', value: null };
    }
}

class FormulaParser {
    constructor(text) {
        this.lexer = new FormulaLexer(text);
        this.currentToken = this.lexer.getNextToken();
    }

    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            throw new Error(`Expected ${tokenType}, got ${this.currentToken.type}`);
        }
    }

    factor() {
        const token = this.currentToken;
        if (token.type === 'NUMBER') {
            this.eat('NUMBER');
            return token.value;
        }
        if (token.type === 'LPAREN') {
            this.eat('LPAREN');
            const result = this.expr();
            this.eat('RPAREN');
            return result;
        }
        if (token.type === 'MINUS') {
            this.eat('MINUS');
            return -this.factor();
        }
        if (token.type === 'PLUS') {
            this.eat('PLUS');
            return this.factor();
        }
        throw new Error(`Unexpected token: ${token.type}`);
    }

    power() {
        let result = this.factor();
        while (this.currentToken.type === 'POWER') {
            this.eat('POWER');
            const exponent = this.factor();
            result = Math.pow(result, exponent);
        }
        return result;
    }

    term() {
        let result = this.power();
        while (this.currentToken.type === 'MUL' || this.currentToken.type === 'DIV') {
            const token = this.currentToken;
            if (token.type === 'MUL') {
                this.eat('MUL');
                result *= this.power();
            } else if (token.type === 'DIV') {
                this.eat('DIV');
                const divisor = this.power();
                if (divisor === 0) throw new Error('Division by zero');
                result /= divisor;
            }
        }
        return result;
    }

    expr() {
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

    parse() {
        return this.expr();
    }
}

function safeEval(expression) {
    if (!expression || typeof expression !== 'string') return NaN;
    const cleanExpr = expression.trim();
    if (cleanExpr === '') return NaN;
    try {
        const parser = new FormulaParser(cleanExpr);
        return parser.parse();
    } catch (error) {
        console.log('Parse error:', error.message);
        return NaN;
    }
}

const evaluateExpression = (expr) => {
    let sanitizedExpr = expr
        .replace(/[xX]/g, '*')
        .replace(/\*\*/g, '^')
        .replace(/(\d)\s*\(/g, '$1*(')
        .replace(/\)\s*(\d)/g, ')*$1');

    console.log(`Original: "${expr}" -> Sanitized: "${sanitizedExpr}"`);
    return safeEval(sanitizedExpr);
};

// Tests
const tests = [
    "2 + 2",
    "2 * (3 + 4)",
    "2(3)",
    "1,000 + 5",
    "1.5 + 2",
    "1,5 + 2", // Vietnam case
    "-5 + 3",
    "10 / 2",
    "2 ^ 3",
    "2 ** 3",
    "(2)3",
    "invalid",
    "1 ++ 2"
];

tests.forEach(t => {
    const res = evaluateExpression(t);
    console.log(`"${t}" = ${res}`);
});
