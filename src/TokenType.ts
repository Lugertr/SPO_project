export default class TokenType {
    name: string;
    regex: string;


    constructor(name: string, regex: string) {                  //Типы токенов
        this.name = name;
        this.regex = regex;
    }
}

export const tokenTypesList = {
    'SEMICOLON': new TokenType('SEMICOLON', ';'),
    'CycleBeg': new TokenType('CycleBeg', ':'),
    'LPAR': new TokenType('LPAR', '\\('),
    'RPAR': new TokenType('RPAR', '\\)'),
    'CycleEnd': new TokenType('CycleEnd', 'END'),
    'WHILE': new TokenType('WHILE', 'while'),
    'IF': new TokenType('IF', 'if'),
    'ELSE': new TokenType('ELSE', 'else'),
    'ELSE_IF': new TokenType('ELSE_IF', 'another'),
    'SPACE': new TokenType('SPACE', '[ \\n\\t\\r]'),
    'LOGIC': new TokenType('LOGIC', '(>=|>|<=|<|==|!=)'),
    'ASSIGN': new TokenType('ASSIGN', '='),
    'LOG': new TokenType('LOG', 'print'),
    'VARIABLE': new TokenType('VARIABLE', '[a-zA-Z_][a-zA-Z_0-9]*'),
    'OP_1': new TokenType('OP_1', '[/*]'),
    'NUMBER': new TokenType('NUMBER', "-?[0-9][0-9]*"),
    'OP': new TokenType('OP', '[+-]'),
}
