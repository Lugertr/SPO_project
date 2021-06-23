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
    'LOGIC': new TokenType('LOGIC', '(>=|>|<=|<|==|!=)'),
    'ASSIGN': new TokenType('ASSIGN', '='),
    'CycleEnd': new TokenType('CycleEnd', 'END'),
    'WHILE': new TokenType('WHILE', 'while'),
    'IF': new TokenType('IF', 'if'),
    'ELSE': new TokenType('ELSE', 'else'),
    'ELSE_IF': new TokenType('ELSE_IF', 'another'),
    "NEW": new TokenType("NEW", 'new'),
    "HASHMAP": new TokenType("HASHMAP", "HashMap"),
    "PUTHASH": new TokenType("PUTHASH", "put"),
    "COMMA": new TokenType("COMMA", ","),
    'SPACE': new TokenType('SPACE', '[ \\n\\t\\r]'),
    'LOG': new TokenType('LOG', 'print'),
    "HASHCLEAR":new TokenType("HASHCLEAR", "clear"),
    "HASHSIZE":new TokenType("HASHSIZE", "size"),
    "HASHREMOVE":new TokenType("HASHREMOVE", "remove"),
    "HASHGET":new TokenType("HASHGET", "get"),
    'VARIABLE': new TokenType('VARIABLE', '[a-zA-Z_][a-zA-Z_0-9]*'),
    'OP_1': new TokenType('OP_1', '[/*]'),
    'NUMBER': new TokenType('NUMBER', "-?[0-9][0-9]*"),
    'OP': new TokenType('OP', '[+-]'),
    //'NUMBER': new TokenType('NUMBER', "-?[0-9]*"),

}
