import TokenType, {tokenTypesList} from "./TokenType";
import ExpressionNode from "./AST/ExpressionNode";
import StatementsNode from "./AST/StatementsNode";
import NumberNode from "./AST/NumberNode";
import VariableNode from "./AST/VariableNode";
import BinOperationNode from "./AST/BinOperationNode";
import UnarOperationNode from "./AST/UnarOperationNode";



export default class StackMachine {        // Помимо парсера в функции parseFormula() представлен ПОЛИЗ
    scope: any = {};                       // В этой же функции этот ПОЛИЗ обрабатывается в функции Calculation
                                       // В функции run() код исполняется



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
