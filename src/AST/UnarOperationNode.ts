import Token from "../Token";
import ExpressionNode from "./ExpressionNode";
import {tokenTypesList} from "../TokenType";

export default class UnarOperationNode {
    operator: Token;
    operand: ExpressionNode;


    constructor(operator: Token, operand: ExpressionNode) {
        this.operator = operator;
        this.operand = operand;
    }
}
