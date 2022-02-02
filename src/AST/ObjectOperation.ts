import ExpressionNode from "./ExpressionNode";
import Token from "../Token";

export default class ObjectOperation extends ExpressionNode {
    funk: Token;
    obj: ExpressionNode;
    leftNode: ExpressionNode;
    rightNode: ExpressionNode;


    constructor(operator: ExpressionNode, leftNode: ExpressionNode, rightNode: ExpressionNode,funk: Token) {
        super();
        this.funk = funk;
        this.obj = operator;
        this.leftNode = leftNode;
        this.rightNode = rightNode;
    }

}