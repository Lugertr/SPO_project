import Token from "./Token";
import TokenType, {tokenTypesList} from "./TokenType";
import ExpressionNode from "./AST/ExpressionNode";
import StatementsNode from "./AST/StatementsNode";
import NumberNode from "./AST/NumberNode";
import VariableNode from "./AST/VariableNode";
import BinOperationNode from "./AST/BinOperationNode";
import UnarOperationNode from "./AST/UnarOperationNode";
import  stack from "./stack";
import  RPN from "./RPN";

export default class Parser {        // Помимо парсера в функции parseFormula() представлен ПОЛИЗ
    tokens: Token[];                 // В этой же функции этот ПОЛИЗ обрабатывается в функции Calculation
    pos: number = 0;                 // В функции run() код исполняется
    scope: any = {};

    constructor(tokens: Token[]) {   //Загрузка токенов из лексера
        this.tokens = tokens;
    }

    match(...expected: TokenType[]): Token | null {     //Функция проверяет, является ли входящий токен необходимого типа
        if (this.pos < this.tokens.length) {
            const currentToken = this.tokens[this.pos];
            if (expected.find(type => type.name === currentToken.type.name)) {
                this.pos += 1;
                return currentToken;
            }
        }
        return null;
    }

    require(...expected: TokenType[]): Token {                      //Вывод ошибки в случае неправильного типа
        const token = this.match(...expected);
        if (!token) {
            throw new Error(`на позиции ${this.pos} ошибка синтаксиса `)
        }
        return token;
    }

    parseVariableOrNumber(): ExpressionNode {                   //Проверка Токена

        const number = this.match(tokenTypesList.NUMBER);
        if (number != null) {
            return new NumberNode(number);
        }
        const variable = this.match(tokenTypesList.VARIABLE);
        if (variable != null) {
            return new VariableNode(variable);
        }
        throw new Error(`Ожидается переменная или число на ${this.pos} позиции`)
    }


    PostIfChek(): ExpressionNode {                                             // проверка не выполнения if перед else_if или else
        let I = this.pos;
        this.pos = this.pos - 3;
        if (this.match(tokenTypesList.CycleEnd)!= null) {
            while ((this.match(tokenTypesList.ELSE) == null) && (this.match(tokenTypesList.IF) == null) && (this.pos > 1)) {
                this.pos = this.pos - 1;
            }

            if (this.pos != 0) {
                this.pos = this.pos - 1;
            }
            if (this.match(tokenTypesList.IF) != null) {
                let condition = this.parseLogic();
                this.pos = I;
                return condition
            }
        }
        this.pos = I-1;
        throw new Error(`Ошибка на ${this.pos} позиции `)
    }

    //NotCondition(): ExpressionNode {
      //  let lnode = new NumberNode(new Token(tokenTypesList.NUMBER, '1', this.pos));
    //    let Rnode =   new NumberNode(new Token(tokenTypesList.NUMBER, '2', this.pos));
      //  const NCondition = new Token(tokenTypesList.LOGIC, '==', this.pos);
     //   return new BinOperationNode(NCondition, lnode, Rnode);
   /// }

    NotFCondition(F: ExpressionNode,T: ExpressionNode): ExpressionNode {
        const NCondition = new Token(tokenTypesList.LOGIC, '!=', this.pos);
        return new BinOperationNode(NCondition, T, F);
    }

    parseCommand(): ExpressionNode {                        //Обработка команд вывода, while и if
        let operatorLog = this.match(tokenTypesList.LOG);
        if (operatorLog != null) {
            return new UnarOperationNode(operatorLog, this.parseFormula())
        }
        else {
            operatorLog = this.match(tokenTypesList.WHILE);
            if ((operatorLog) == null)
            {
                operatorLog = this.match(tokenTypesList.IF);
            }
            if ((operatorLog == null)) {
                    operatorLog = this.match(tokenTypesList.ELSE_IF);
                    if (operatorLog != null) {
                        let out = this.parseELSEIF(operatorLog, this.PostIfChek());
                        if (out != null) {
                            return out;
                    }
                }
            }
            if (operatorLog == null) {
                    operatorLog = this.match(tokenTypesList.ELSE);
                if (operatorLog != null) {
                    let out = this.parseELSE(operatorLog, this.PostIfChek());
                    if (out != null) {
                        return out;
                    }
                }
            }
            else {
                let out = this.parseIf(operatorLog);
                if (out != null) {
                    return out;
                }
            }
        }
        throw new Error(`Ошибка на ${this.pos} позиции `)
    }


    parseLogic(): ExpressionNode {                                                  //функция сравнения двух переменных
        let leftNode = this.parseParentheses();
        let operator = this.match(tokenTypesList.LOGIC);
        while (operator != null) {
            const rightNode = this.parseParentheses();
            leftNode = new BinOperationNode(operator, leftNode, rightNode);
            operator = this.match(  tokenTypesList.LOGIC);}
    return leftNode;
}

    parseELSE(operatorLog: Token | null,PostIf: ExpressionNode): ExpressionNode | null{                    //Обработка else
            if (operatorLog != null) {
                    let Cycle = this.parseCycle();
                    if (Cycle != undefined) {
                        let FStep = this.NotFCondition(PostIf,PostIf);
                        return new BinOperationNode(operatorLog,Cycle, FStep)
                    }
            }
        return null
    }

    parseELSEIF(operatorLog: Token | null,PostIf: ExpressionNode): ExpressionNode | null{                    //Обработка else
        if (this.match(tokenTypesList.LPAR) != null) {
            let CycleChek = this.parseLogic();
            this.require(tokenTypesList.RPAR);
        if ((CycleChek != null) && (operatorLog != null)) {
            let Cycle = this.parseCycle();
            if (Cycle != undefined) {
                let FStep = this.NotFCondition(PostIf,CycleChek);
                return new BinOperationNode(operatorLog,Cycle, FStep)
            }
        }
        }
        return null
    }

    parseIf(operatorLog: Token | null): ExpressionNode | null{              //Обработка while, if и else if
        if (this.match(tokenTypesList.LPAR) != null) {
            let CycleChek = this.parseLogic();
            this.require(tokenTypesList.RPAR);
                if ((CycleChek != null) && (operatorLog != null))  {
                    let Cycle = this.parseCycle();
                    if (Cycle != undefined) {
                        return new BinOperationNode(operatorLog,Cycle, CycleChek)
               }
            }
        }
        return null
    }


    parseCycle(): ExpressionNode | null{                                //обработка вложенного цикла
                    this.require(tokenTypesList.CycleBeg);
                        return this.parseCode(true);
    }


    parseParentheses(): ExpressionNode {                                //Обработка скобок и значения внутри них
        if (this.match(tokenTypesList.LPAR) != null) {
            const node = this.parseFormula();
            this.require(tokenTypesList.RPAR);
            return node;
        } else {
            return this.parseVariableOrNumber();
        }
    }


    priority(a: Token | null, b:any): number {                  //Установка приоритета заполнения ПОЛИЗа
        if (a != null) {
            if (a.type == tokenTypesList.OP) {
                if (b != null) {
                    return 1;
                } else {
                    //this.pos = this.pos - 1;
                    return 2;
                }
            }
            if (b != null) {
               return 1;
            }
            return 3;
        } else {
            return 1;
        }
    }

    parseBinOperation(a:any,b:any,c:any): ExpressionNode {                  //Создание формул из переменых или других формул
            return new BinOperationNode(a, b, c);
    }

    Calculation(MyRPN: RPN): ExpressionNode  {                         //Обработка полиза в виде выражений
        let rightNode;
        let leftNode;
        let I1 = 0;
        let FinalRPN = new RPN();                               //Промежуточный стек для расчёта ПОЛИЗ
        while (MyRPN.out(I1) != undefined) {
            //console.log(MyRPN.out(I1))               //Единственный способ как получилось вывести полиз на консоль
            let oper = MyRPN.outToken(I1);
            if ((oper.type == tokenTypesList.OP) || (oper.type == tokenTypesList.OP_1)) {
                rightNode = FinalRPN.peek();
                FinalRPN.pop();
                leftNode = FinalRPN.peek();
                FinalRPN.pop();
                FinalRPN.push(this.parseBinOperation(oper, leftNode, rightNode));
            } else {
                FinalRPN.push(MyRPN.outToken(I1));
            }
            I1 = I1 + 1;
        }
        leftNode=FinalRPN.peek();
        if (leftNode != undefined)
        {
        return leftNode;
        }
        throw new Error(`Не удалось произвести рассчёт`);
    }

    parseFormula(): ExpressionNode {                                        //Создание полиза и его распределение на операции

        let tokenadd = this.parseParentheses();                         //проверка на скобки и присвоение значения первой переменной
        let operation = this.match(tokenTypesList.OP_1);   //присвоение значения первой операции
        if (operation == null) {
            operation = this.match(tokenTypesList.OP);
        }
        if ((operation == null) && (this.match(tokenTypesList.LOGIC)!=null)) {   //если это не математическая операция,
            this.pos = this.pos - 2;                                             //её обработка  как логическую
            tokenadd=this.parseLogic();
        }
        let MyRPN = new RPN();                              //создание стека для хранения полиза
        let s = new stack<Token | null>();                  //создание промежуточного стека для операций
        let CHek1 = 0;
        let Chekfirst = true;
        while (operation != null) {                     //Создание полиза
            MyRPN.push(tokenadd);
            tokenadd = this.parseParentheses();
            this.pos = this.pos - 2;
            let korrekt = this.match(tokenTypesList.OP);    //Переменная для анализа нынешнего и предущего операторов
            if (korrekt!= null) {                           //на случай умножения переменных
                this.pos = this.pos - 1;
            }
            if ((s.size() == 0) || ((s.size() != 0) && (this.priority(s.peek(), korrekt) == 2))) {  //Запись операции
                s.push(operation);                                                          //в стек, если нет операции
                CHek1 = CHek1 + 1;                                                          // с большим приоритетом
            }

           else if ((this.priority(s.peek(), korrekt) == 3))        //Случай, когда операции умножения/деления
            {   if (Chekfirst) {                                    //идут последовательно
                this.pos = this.pos - 2;
                korrekt = this.match(tokenTypesList.OP_1);
                this.pos=this.pos + 1;
            }
                s.pop();
                s.push(operation);
                if (korrekt!= null) {
                    MyRPN.push(korrekt);
                }
           }
            else{
                while ((s.size() != 0) && (this.priority(s.peek(), korrekt) == 1)) { //Перераспределение чисел в
                    operation = s.peek();                                            //стеке в случае
                    if (operation != null) {                                         //операции с большим приоритетом
                        MyRPN.push(operation);
                        if (CHek1 == 2) {
                            CHek1 = 0;
                            s.pop();
                            operation = s.peek();
                            if (operation != null) {
                                MyRPN.push(operation);
                            }
                        }
                        s.pop();
                    }
                }
                CHek1 = CHek1 + 1;
                s.push(korrekt);
            }
           this.pos = this.pos +  2;
            operation = this.match(tokenTypesList.OP_1);
            if (operation == null) {
                operation = this.match(tokenTypesList.OP);
            }
        }

        MyRPN.push(tokenadd);
            while (s.size() != 0) {                                 // добавление в полиз операций оставшихся в стеке
                operation = s.peek();
                if (operation != null) {
                    MyRPN.push(operation);
                    s.pop();
                }
            }
        return this.Calculation(MyRPN);                 //Обработка полиза
    }


    parseExpression(): ExpressionNode {                         //функция анализа входных значений
        if (this.match(tokenTypesList.VARIABLE) == null) {      //обработка команд print/while/if/else...
            return this.parseCommand();
        }
        this.pos -= 1;
        let variableNode = this.parseVariableOrNumber();
        const assignOperator = this.match(tokenTypesList.ASSIGN);
        if (assignOperator != null) {                                   //Обработка присвоения
            const rightFormulaNode = this.parseFormula();
            return new BinOperationNode(assignOperator, variableNode, rightFormulaNode);
        }
        throw new Error(`После переменной ожидается оператор присвоения на позиции ${this.pos}`);
    }

    parseCode(In?: boolean): ExpressionNode {                   //чтение токенов, входная переменная нужна
        const root = new StatementsNode();                      //на случай обработки вложенного цикла
        while ((this.pos < this.tokens.length)) {
                const codeStringNode = this.parseExpression();
                this.require(tokenTypesList.SEMICOLON);
                root.addNode(codeStringNode);

                if ((In) &&  this.match(tokenTypesList.CycleEnd)!= null)  //условие для проверки вложенный ли это цикл
                {
                    return root;
                }
        }
        return root;
    }


    run(node: ExpressionNode): any {                  //Обработка кода
        if (node instanceof NumberNode) {
            return parseInt(node.number.text);
        }
        if (node instanceof UnarOperationNode) {
            switch (node.operator.type.name) {
                case tokenTypesList.LOG.name:
                    console.log(this.run(node.operand))
                    return;
            }
        }
        if (node instanceof BinOperationNode) {
            switch (node.operator.type.name) {
                    case tokenTypesList.IF.name:
                        if (this.run(node.rightNode) != false) {
                         this.run(node.leftNode);
                        }
                        return;
                    case tokenTypesList.WHILE.name:

                        while (this.run(node.rightNode) != false) {
                            this.run(node.leftNode);
                            this.run(node.rightNode);
                        }
                        return;
                    case  tokenTypesList.ELSE_IF.name:

                                if ((this.run(node.rightNode)) != false) {
                                    this.run(node.leftNode);
                                }
                                return;

                    case  tokenTypesList.ELSE.name:
                        if ((this.run(node.rightNode)) == false) {
                            this.run(node.leftNode);
                        }
                        return;

                case tokenTypesList.LOGIC.name:
                    switch (node.operator.text) {
                        case ">":
                            return this.run(node.leftNode) > this.run(node.rightNode)
                        case "<":
                            return this.run(node.leftNode) < this.run(node.rightNode)
                        case ">=":
                            return this.run(node.leftNode) >= this.run(node.rightNode)
                        case "<=":
                            return this.run(node.leftNode) <= this.run(node.rightNode)
                        case "==":
                            return this.run(node.leftNode) == this.run(node.rightNode)
                        case "!=":
                            return this.run(node.leftNode) != this.run(node.rightNode)
                    }
                    return
                case tokenTypesList.OP.name:
                    if (node.operator.text=="-") {
                            return this.run(node.leftNode) - this.run(node.rightNode);}
                    else  {
                            return this.run(node.leftNode) + this.run(node.rightNode);}
                case tokenTypesList.OP_1.name:
                    if (node.operator.text=="/") {
                    return this.run(node.leftNode) / this.run(node.rightNode);}
                    else {
                    return this.run(node.leftNode) * this.run(node.rightNode);}

                case tokenTypesList.ASSIGN.name:
                    const result = this.run(node.rightNode)
                    const variableNode = <VariableNode>node.leftNode;
                    this.scope[variableNode.variable.text] = result;
                    return result;
            }
        }
        if (node instanceof VariableNode) {
            if ((this.scope[node.variable.text]) || (this.scope[node.variable.text]==0)) {
                return this.scope[node.variable.text]
            } else {
                throw new Error(`Переменная с названием ${node.variable.text} не обнаружена`)
            }
        }
        if (node instanceof StatementsNode) {
            node.codeStrings.forEach(codeString => {
                this.run(codeString);
            })
            return;
        }
        throw new Error('Ошибка!')
    }

}

