import Token from "./Token";
import {tokenTypesList} from "./TokenType";

export default class Lexer {
    code: string;
    pos: number = 0;
    tokenList: Token[] = []


    constructor(path: string) {                                         //чтение файла
         try {
                        var fs = require('fs');
                        var readMe = fs.readFileSync(path,'utf8')
                    }
                    catch{
                        throw new Error(`Не удалось прочитать файл`)
                    }
         this.code = readMe;
    }



    lexAnalysis(): Token[] {                                //Обработка текста
        while (this.nextToken()) {}                         //После обработки из него удаляются пробелы
        this.tokenList = this.tokenList.filter(token => token.type.name !== tokenTypesList.SPACE.name);

        return this.tokenList;
    }

    nextToken(): boolean {
        if (this.pos >= this.code.length) {
            return false;
        }
        const tokenTypesValues = Object.values(tokenTypesList)
        for (let i = 0; i < tokenTypesValues.length; i++) {     //через каждый символ прогоняются
            const tokenType = tokenTypesValues[i];              //регулярные выражения токенов
            const regex = new RegExp('^' + tokenType.regex);
            const result = this.code.substr(this.pos).match(regex);
            if(result && result[0]) {                                           //в случае совпадения создается токен
                const token = new Token(tokenType, result[0], this.pos);        //и добавляется в TokenList
                this.pos += result[0].length;
                this.tokenList.push(token);
                return true;
            }
        }
        console.log(this.code[this.pos])
        throw new Error(`На позиции ${this.pos} обнаружена ошибка`)
    }

   printCode():void {
        console.log(this.code);
   }

    printTokens():void {
            console.log(this.tokenList);
       }
}
