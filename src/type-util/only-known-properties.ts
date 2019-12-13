/**
 * Object literal may only specify known properties
 */
export type OnlyKnownProperties<ConcreteT extends ConstraintT, ConstraintT> =
    ConcreteT extends ConstraintT ?
    (
        & ConcreteT
        & {
            [k in keyof ConcreteT] : (
                k extends keyof ConstraintT ?
                ConstraintT[k] :
                never
            )
        }
    ) :
    never
;
