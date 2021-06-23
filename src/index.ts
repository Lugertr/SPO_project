import Lexer from "./Lexer";
import Parser from "./Parser";
import HashTable from "./HashTable";
import {Hash} from "./Hash";
import StackMachine from "./StackMachine";

const code = './src/HashTest/Add_in_Hash.txt';
//const code = './src/HashTest/ClearHash.txt';
//const code = './src/HashTest/Get_from_Hash.txt';
//const code = './src/HashTest/Remove.txt';
//const code = './src/HashTest/Size.txt';

//const code = './src/TestEndless.txt';
//const code = './src/TestIf.txt';
//const code = './src/TestIf_ELSE.txt';
//const code = './src/TestOPeration.txt';
//const code = './src/TestWhile.txt';


const lexer = new Lexer(code); //создание лексера
lexer.lexAnalysis()            //разборка кода на токены
//lexer.printCode()
//lexer.printTokens()

const parser = new Parser(lexer.tokenList);     //Создание парсера
const rootNode = parser.parseCode();            //Парсинг кода, распределение токенов по дереву,
                                                //Их запись в стек и обработка
const runCode = new StackMachine();
runCode.run(rootNode);                           //Выполнение кода
