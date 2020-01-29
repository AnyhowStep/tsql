import * as tm from "type-mapping";
import {DataType} from "../../data-type-impl";
import {isDataType} from "../predicate";
import {makeDataType} from "../constructor";
import {BuiltInExpr_NonCorrelated_NonAggregate, BuiltInExprUtil} from "../../../built-in-expr";
import {BuiltInValueExprUtil} from "../../../built-in-value-expr";

export type Merge<TypeA, TypeB> =
    DataType<TypeA & TypeB>
;

/**
 * @todo Implement something more efficient to generalize intersect `N` mappers.
 *
 * This runs a `mixed` value through both `mapperA` and `mapperB`.
 * Then, it checks that both mapped results are equal.
 *
 * It **does not** try to "deep-merge" both mapped results.
 *
 * So, you cannot combine mappers for `{x:number}` and `{y:number}`
 * and hope to have a value of type `{x:number, y:number}` during run-time.
 *
 * it will just throw a run-time error because a value of exactly type `{x:number}`
 * is not equal to a value of exactly type `{y:number}`.
 */
export function intersect<
    TypeA,
    TypeB
> (
    mapperA : tm.SafeMapper<TypeA>,
    mapperB : tm.SafeMapper<TypeB>,
) : (
    Merge<TypeA, TypeB>
) {
    if (isDataType(mapperA)) {
        if (isDataType(mapperB)) {
            return makeDataType(
                (name : string, mixed : unknown) : TypeA & TypeB => {
                    const mappedA = mapperA(name, mixed);
                    const mappedB = mapperB(name, mixed);

                    if (!mapperA.isNullSafeEqual(
                        mappedA,
                        /**
                         * This may throw
                         */
                        mapperA(name, mappedB)
                    )) {
                        /**
                         * @todo Find a way to make better messages.
                         */
                        throw tm.ErrorUtil.makeMappingError({
                            message : `${name} fails ${tm.TypeUtil.toTypeStr(mappedA)} LHS equality check`,
                            inputName : name,
                            actualValue : mixed,
                            expected : `${tm.TypeUtil.toTypeStr(mappedA)} LHS equality check`,
                            expectedMeta : {
                                mapperA,
                                mapperB,
                            },
                        });
                    }

                    if (!mapperB.isNullSafeEqual(
                        mappedB,
                        /**
                         * This may throw
                         */
                        mapperB(name, mappedA)
                    )) {
                        /**
                         * @todo Find a way to make better messages.
                         */
                        throw tm.ErrorUtil.makeMappingError({
                            message : `${name} ${tm.TypeUtil.toTypeStr(mappedB)} fails RHS equality check`,
                            inputName : name,
                            actualValue : mixed,
                            expected : `${tm.TypeUtil.toTypeStr(mappedB)} RHS equality check`,
                            expectedMeta : {
                                mapperA,
                                mapperB,
                            },
                        });
                    }

                    /**
                     * Since the two values are "equal",
                     * it should not matter which we return.
                     */
                    return mappedA as (TypeA & TypeB);
                },
                (value) => {
                    /**
                     * We assume that `a` and `b`
                     * have already gone through the above mapping function.
                     *
                     * So, we only need one mapper to convert to a built-in expr.
                     */
                    return mapperA.toBuiltInExpr_NonCorrelated(value) as BuiltInExpr_NonCorrelated_NonAggregate<TypeA & TypeB>;
                },
                (a, b) => {
                    /**
                     * We assume that `a` and `b`
                     * have already gone through the above mapping function.
                     *
                     * So, we only need one mapper to say they
                     * are null-safe-equal.
                     */
                    return mapperA.isNullSafeEqual(a, b);
                }
            );
        } else {
            return makeDataType(
                (name : string, mixed : unknown) : TypeA & TypeB => {
                    const mappedA = mapperA(name, mixed);
                    const mappedB = mapperB(name, mixed);

                    if (!mapperA.isNullSafeEqual(
                        mappedA,
                        /**
                         * This may throw
                         */
                        mapperA(name, mappedB)
                    )) {
                        /**
                         * @todo Find a way to make better messages.
                         */
                        throw tm.ErrorUtil.makeMappingError({
                            message : `${name} fails ${tm.TypeUtil.toTypeStr(mappedA)} LHS equality check`,
                            inputName : name,
                            actualValue : mixed,
                            expected : `${tm.TypeUtil.toTypeStr(mappedA)} LHS equality check`,
                            expectedMeta : {
                                mapperA,
                                mapperB,
                            },
                        });
                    }

                    /**
                     * Since the two values are "equal",
                     * it should not matter which we return.
                     *
                     * Well, we couldn't perform RHS equality checks...
                     */
                    return mappedA as (TypeA & TypeB);
                },
                (value) => {
                    /**
                     * We assume that `a` and `b`
                     * have already gone through the above mapping function.
                     *
                     * So, we only need one mapper to convert to a built-in expr.
                     */
                    return mapperA.toBuiltInExpr_NonCorrelated(value) as BuiltInExpr_NonCorrelated_NonAggregate<TypeA & TypeB>;
                },
                (a, b) => {
                    /**
                     * We assume that `a` and `b`
                     * have already gone through the above mapping function.
                     *
                     * So, we only need one mapper to say they
                     * are null-safe-equal.
                     */
                    return mapperA.isNullSafeEqual(a, b);
                }
            );
        }
    } else {
        if (isDataType(mapperB)) {
            return makeDataType(
                (name : string, mixed : unknown) : TypeA & TypeB => {
                    const mappedA = mapperA(name, mixed);
                    const mappedB = mapperB(name, mixed);

                    if (!mapperB.isNullSafeEqual(
                        mappedB,
                        /**
                         * This may throw
                         */
                        mapperB(name, mappedA)
                    )) {
                        /**
                         * @todo Find a way to make better messages.
                         */
                        throw tm.ErrorUtil.makeMappingError({
                            message : `${name} fails ${tm.TypeUtil.toTypeStr(mappedB)} RHS equality check`,
                            inputName : name,
                            actualValue : mixed,
                            expected : `${tm.TypeUtil.toTypeStr(mappedB)} RHS equality check`,
                            expectedMeta : {
                                mapperA,
                                mapperB,
                            },
                        });
                    }

                    /**
                     * Since the two values are "equal",
                     * it should not matter which we return.
                     *
                     * Well, we couldn't perform LHS equality checks...
                     */
                    return mappedB as (TypeA & TypeB);
                },
                (value) => {
                    /**
                     * We assume that `a` and `b`
                     * have already gone through the above mapping function.
                     *
                     * So, we only need one mapper to convert to a built-in expr.
                     */
                    return mapperB.toBuiltInExpr_NonCorrelated(value) as BuiltInExpr_NonCorrelated_NonAggregate<TypeA & TypeB>;
                },
                (a, b) => {
                    /**
                     * We assume that `a` and `b`
                     * have already gone through the above mapping function.
                     *
                     * So, we only need one mapper to say they
                     * are null-safe-equal.
                     */
                    return mapperB.isNullSafeEqual(a, b);
                }
            );
        } else {
            return makeDataType(
                (name : string, mixed : unknown) : TypeA & TypeB => {
                    const mappedA = mapperA(name, mixed);
                    const mappedB = mapperB(name, mixed);

                    if (BuiltInValueExprUtil.isBuiltInValueExpr(mappedA)) {
                        if (BuiltInValueExprUtil.isBuiltInValueExpr(mappedB)) {
                            if (!BuiltInValueExprUtil.isEqual(mappedA, mappedB)) {
                                /**
                                 * @todo Find a way to make better messages.
                                 */
                                throw tm.ErrorUtil.makeMappingError({
                                    message : `${name} fails ${tm.TypeUtil.toTypeStr(mappedA)} LHS equality check`,
                                    inputName : name,
                                    actualValue : mixed,
                                    expected : `${tm.TypeUtil.toTypeStr(mappedA)} LHS equality check`,
                                    expectedMeta : {
                                        mapperA,
                                        mapperB,
                                    },
                                });
                            }
                        } else {
                            /**
                             * @todo Find a way to make better messages.
                             */
                            throw tm.ErrorUtil.makeMappingError({
                                message : `${name} fails ${tm.TypeUtil.toTypeStr(mappedA)} LHS equality check`,
                                inputName : name,
                                actualValue : mixed,
                                expected : `${tm.TypeUtil.toTypeStr(mappedA)} LHS equality check`,
                                expectedMeta : {
                                    mapperA,
                                    mapperB,
                                },
                            });
                        }
                    } else {
                        if (BuiltInValueExprUtil.isBuiltInValueExpr(mappedB)) {
                            /**
                             * @todo Find a way to make better messages.
                             */
                            throw tm.ErrorUtil.makeMappingError({
                                message : `${name} fails ${tm.TypeUtil.toTypeStr(mappedB)} RHS equality check`,
                                inputName : name,
                                actualValue : mixed,
                                expected : `${tm.TypeUtil.toTypeStr(mappedB)} RHS equality check`,
                                expectedMeta : {
                                    mapperA,
                                    mapperB,
                                },
                            });
                        } else {
                            /**
                             * @todo Find a way to make better messages.
                             */
                            throw tm.ErrorUtil.makeMappingError({
                                message : `${name} fails ${tm.TypeUtil.toTypeStr(mappedA)}/${tm.TypeUtil.toTypeStr(mappedB)} LHS/RHS equality check; use IDataType instead of SafeMapper`,
                                inputName : name,
                                actualValue : mixed,
                                expected : `${tm.TypeUtil.toTypeStr(mappedA)}/${tm.TypeUtil.toTypeStr(mappedB)} LHS/RHS equality check`,
                                expectedMeta : {
                                    mapperA,
                                    mapperB,
                                },
                            });
                        }
                    }

                    /**
                     * Since the two values are "equal",
                     * it should not matter which we return.
                     */
                    return mappedA as unknown as (TypeA & TypeB);
                },
                (value) => {
                    /**
                     * We assume that `a` and `b`
                     * have already gone through the above mapping function.
                     *
                     * So, we only need one mapper to convert to a built-in expr.
                     *
                     * So, we can assume they are built-in values
                     */
                    return BuiltInExprUtil.fromValueExpr(mapperA, value) as BuiltInExpr_NonCorrelated_NonAggregate<TypeA & TypeB>;
                },
                (a, b) => {
                    /**
                     * We assume that `a` and `b`
                     * have already gone through the above mapping function.
                     *
                     * So, we can assume they are built-in values
                     */
                    return (
                        BuiltInValueExprUtil.isBuiltInValueExpr(a) &&
                        BuiltInValueExprUtil.isBuiltInValueExpr(b) &&
                        BuiltInValueExprUtil.isEqual(a, b)
                    );
                }
            );
        }
    }
}
