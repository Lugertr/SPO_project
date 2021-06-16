import ExpressionNode from "./AST/ExpressionNode";
import Token from "./Token";
import {tokenTypesList} from "./TokenType";

export default class RPN {          //стек для хранения ПОЛИЗ
    NodeType: any [] = [];

    constructor() {
    }

    Poland(): void {
        console.log(this.NodeType)
    }

    push(token: ExpressionNode ): void {
                this.NodeType.push(token);
    }

    out(i:number): ExpressionNode {
        return this.NodeType[i];
    }
    outToken(i:number): Token {
        return <Token>this.NodeType[i];
    }

    size(): number {
        return this.NodeType.length;
    }

    pop(): ExpressionNode  {
        return this.NodeType.pop();
    }

    peek(): ExpressionNode  {
        return this.NodeType[this.size() - 1];
    }

}