import Lexer from "./Lexer";
import Parser from "./Parser";

const code = './src/TestWhile.txt';

const lexer = new Lexer(code); //создание лексера
lexer.lexAnalysis()            //разборка кода на токены
//lexer.printCode()
//lexer.printTokens()

const parser = new Parser(lexer.tokenList);     //Создание парсера
const rootNode = parser.parseCode();            //Парсинг кода, распределение токенов по дереву,
                                                //Их запись в стек и обработка

parser.run(rootNode);                           //Выполнение кода
