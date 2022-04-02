import parser from './parser.js'
import { equal } from 'assert/strict'

enum Bytecode {
    NOP,
    CONST,
    MEMBER,
    CALL,
    CALL_PROPERTY,
    GLOBAL,
    GLOBAL_MEMBER,
    DUP,
    NOT,
    OP_EQ,
    OP_FEQ,
    OP_LT,
    OP_LE,
    OP_GT,
    OP_GE,
    OP_ADD,
    OP_SUB,
    OP_MUL,
    OP_DIV,
    OP_LAND,
    OP_LOR,
}

type BC = any[]

type AST = {
    type: string
    [x: string]: any
}

class ASTProcessor {

    private ctx: BC = []
    private exprs: Record<string, (ast: AST) => void> = {
        BinaryExpression: this.BinaryExpression,
        UnaryExpression: this.UnaryExpression,
        LogicalExpression: this.BinaryExpression,
        MemberExpression: this.MemberExpression,
        CallExpression: this.CallExpression,
        Literal: this.Literal,
        Identifier: this.Identifier,
    }

    ExpressionStatement(ast: AST) {
        equal(ast.type, 'ExpressionStatement')
        this._Expression(ast.expression)
    }

    _Expression(ast: AST) {
        const exec = this.exprs[ast.type]
        if (exec === undefined) {
            throw new Error(`Unhandled expression ${ast.type}`)
        }
        exec.call(this, ast)
    }

    BinaryExpression(ast: AST) {
        this._Expression(ast.left)
        this._Expression(ast.right)

        let op
        let not = false
        switch (ast.operator) {
            case '===': op = Bytecode.OP_FEQ; break;
            case '!==': op = Bytecode.OP_FEQ; not = true; break;
            case '==': op = Bytecode.OP_EQ; break;
            case '!=': op = Bytecode.OP_EQ; not = true; break;
            case '<': op = Bytecode.OP_LT; break;
            case '>': op = Bytecode.OP_GT; break;
            case '<=': op = Bytecode.OP_LE; break;
            case '>=': op = Bytecode.OP_GE; break;
            case '+': op = Bytecode.OP_ADD; break;
            case '-': op = Bytecode.OP_SUB; break;
            case '*': op = Bytecode.OP_MUL; break;
            case '/': op = Bytecode.OP_DIV; break;
            case '&&': op = Bytecode.OP_LAND; break;
            case '||': op = Bytecode.OP_LOR; break;
            default: throw new Error(`Unhandled operator ${ast.operator}`)
        }
        this.ctx.push(op)
        if (not) this.ctx.push(Bytecode.NOT)
    }

    UnaryExpression (ast: AST) {
        this._Expression(ast.argument)

        let op
        switch(ast.operator) {
            case '!': op = Bytecode.NOT; break;
            default: throw new Error(`Unhandled operator ${ast.operator}`)
        }
        this.ctx.push(op)
    }

    MemberExpression(ast: AST, keepLeft = false) {
        this._Expression(ast.object)
        if (keepLeft) {
            this.ctx.push(Bytecode.DUP)
        }

        if (ast.computed) {
            this._Expression(ast.property)
        } else {
            this.ctx.push(Bytecode.CONST, ast.property.name)
        }

        this.ctx.push(Bytecode.MEMBER)
    }

    CallExpression(ast: AST) {
        let bc
        if (ast.callee.type === 'MemberExpression') {
            this.MemberExpression(ast.callee, true)
            bc = Bytecode.CALL_PROPERTY
        } else {
            this._Expression(ast.callee)
            bc = Bytecode.CALL
        }

        let i = ast.arguments.length - 1
        for (; i >= 0; i--) {
            this._Expression(ast.arguments[i])
        }
        this.ctx.push(bc, ast.arguments.length)
    }

    Literal(ast: AST) {
        this.ctx.push(Bytecode.CONST, ast.value)
    }

    Identifier(ast: AST) {
        this.ctx.push(Bytecode.GLOBAL_MEMBER, ast.name)
    }

    public process(ast: AST): BC {
        this.ExpressionStatement(ast)
        return this.ctx
    }
}


export function run(bc: BC, ctx?: Record<string, any>) {
    const stack: any[] = []
    const global : typeof ctx = {
        undefined: undefined
    }

    Object.assign(global, ctx)

    function operator(cb: (c: any, d: any) => any) {
        const a = stack.pop() as any
        const b = stack.pop() as any
        stack.push(cb(b, a))
    }

    function call(ptr: number, getCtx: boolean) {
        const popcount = bc[++ptr]
        const args = new Array(popcount)
        for (let i = 0; i < popcount; i++) {
            args[i] = stack.pop()
        }
        const callee = stack.pop()
        const ctx = getCtx ? stack.pop() : global
        stack.push(callee.apply(ctx, args))
        return ptr
    }

    for (let k = 0; k < bc.length; k++) {
        switch (bc[k]) {
            case Bytecode.NOP:
                break
            case Bytecode.CONST:
                stack.push(bc[++k])
                break
            case Bytecode.MEMBER:
                operator((a, b) => a[b])
                break
            case Bytecode.CALL:
                k = call(k, false)
                break
            case Bytecode.CALL_PROPERTY:
                k = call(k, true)
                break
            case Bytecode.GLOBAL:
                stack.push(global)
                break
            case Bytecode.GLOBAL_MEMBER:
                stack.push(global[bc[++k]])
                break
            case Bytecode.DUP:
                stack.push(stack[stack.length - 1])
                break
            case Bytecode.NOT:
                stack.push(!stack.pop())
                break
            case Bytecode.OP_EQ:
                operator((a, b) => a == b)
                break
            case Bytecode.OP_FEQ:
                operator((a, b) => a === b)
                break
            case Bytecode.OP_LT:
                operator((a, b) => a < b)
                break
            case Bytecode.OP_LE:
                operator((a, b) => a <= b)
                break
            case Bytecode.OP_GT:
                operator((a, b) => a > b)
                break
            case Bytecode.OP_GE:
                operator((a, b) => a >= b)
                break
            case Bytecode.OP_ADD:
                operator((a, b) => a + b)
                break
            case Bytecode.OP_SUB:
                operator((a, b) => a - b)
                break
            case Bytecode.OP_MUL:
                operator((a, b) => a * b)
                break
            case Bytecode.OP_DIV:
                operator((a, b) => a / b)
                break
            case Bytecode.OP_LAND:
                operator((a, b) => a && b)
                break
            case Bytecode.OP_LOR:
                operator((a, b) => a || b)
                break
            default: throw new Error(`Unknown bytecode ${bc[k]} at ${k}`)
        }
    }

    if (stack.length !== 1) {
        console.warn('script: stack is not balanced with stack length', stack.length)
        console.log(bc)
    }

    return stack[0]
}

export function compile(code: string): BC {
    const ast = parser.parse(code, {})
    console.dir(ast, { depth: Infinity })
    const bc = new ASTProcessor().process(ast)
    return bc
}

// TESTER
// const code = ``
// const bc = compile(code)
// console.log(bc)
// console.log(run(bc))
// TESTER
