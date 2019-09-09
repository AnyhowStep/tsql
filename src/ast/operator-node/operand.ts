import {Ast} from "../ast";

export type Operand0 = readonly [];
export type Operand1 = readonly [Ast];
export type Operand2 = readonly [Ast, Ast];
export type Operand3 = readonly [Ast, Ast, Ast];

export type Operand0ToN = readonly Ast[];
export type Operand1ToN = readonly [Ast, ...Ast[]];
export type Operand2ToN = readonly [Ast, Ast, ...Ast[]];
export type Operand3ToN = readonly [Ast, Ast, Ast, ...Ast[]];
export type Operand4ToN = readonly [Ast, Ast, Ast, Ast, ...Ast[]];

export type AnyArityOperand =
    | Operand0
    | Operand1
    | Operand2
    | Operand3

    | Operand0ToN
    | Operand1ToN
    | Operand2ToN
    | Operand3ToN
    | Operand4ToN
;
