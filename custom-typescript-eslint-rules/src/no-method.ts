import {
    TSESTree,
    TSESLint,
    AST_NODE_TYPES,
} from '@typescript-eslint/experimental-utils';
import * as util from "@typescript-eslint/experimental-utils/dist/eslint-utils";
const createRule = util.RuleCreator(ruleName => ruleName);

type MessageIds = 'methodNotAllowed';

const rule = createRule<[], MessageIds>({
    name: 'no-method',
    meta: {
        type: 'problem',
        docs: {
            description: 'Ban methods; use function properties instead',
            category: 'Best Practices',
            recommended: 'error',
        },
        messages: {
            methodNotAllowed: 'Instance method not allowed. Use --strictFunctionTypes and function property instead. {{classOrInterfaceName}}.{{methodName}}({{params}})',
        },
        schema: [
            /*{
                type: 'object',
                properties: {},
                additionalProperties: false,
            },*/
        ],
    },
    defaultOptions: [],
    create(context, []) {
        const sourceCode = context.getSourceCode();

        function checkNoMethodDefinition (
            methodDefinition: TSESTree.MethodDefinition,
        ) : void {
            const methodName = getNameFromClassMember(
                methodDefinition,
                sourceCode,
            );
            if (methodDefinition.static) {
                //Static methods are okay, in general
                return;
            }
            if (methodDefinition.value.params.length == 0) {
                //No parameters to be bivariant
                //@todo Should this always return?
                //Or is consistency more important?
                //return;
            }
            if (methodName == "constructor") {
                //Can't have constructor function
                return;
            }

            context.report({
                node: methodDefinition,
                messageId: 'methodNotAllowed',
                data: {
                    classOrInterfaceName : getClassOrInterfaceName(methodDefinition),
                    methodName,
                    params : getParamsSignature(methodDefinition.value.params),
                },
            });
        }

        function checkNoMethodSignature (
            methodSignature: TSESTree.TSMethodSignature,
        ) : void {
            const methodName = getNameFromClassMember(
                methodSignature,
                sourceCode,
            );
            if (methodSignature.params.length == 0) {
                //No parameters to be bivariant
                //@todo Should this always return?
                //Or is consistency more important?
                //return;
            }

            context.report({
                node: methodSignature,
                messageId: 'methodNotAllowed',
                data: {
                    classOrInterfaceName : getClassOrInterfaceName(methodSignature),
                    methodName,
                    params : getParamsSignature(methodSignature.params),
                },
            });
        }

        return {
            MethodDefinition: checkNoMethodDefinition,
            TSMethodSignature: checkNoMethodSignature,
        };
    },
});
export = rule;

/**
 * Gets a string name representation of the name of the given MethodDefinition
 * or ClassProperty node, with handling for computed property names.
 */
function getNameFromClassMember(
    methodDefinition: TSESTree.MethodDefinition | TSESTree.ClassProperty | TSESTree.TSMethodSignature,
    sourceCode: TSESLint.SourceCode,
): string {
    if (keyCanBeReadAsPropertyName(methodDefinition.key)) {
        return getNameFromPropertyName(methodDefinition.key);
    }

    return sourceCode.text.slice(...methodDefinition.key.range);
}

/**
 * This covers both actual property names, as well as computed properties that are either
 * an identifier or a literal at the top level.
 */
function keyCanBeReadAsPropertyName(
    node: TSESTree.Expression,
): node is TSESTree.PropertyName {
    return (
        node.type === AST_NODE_TYPES.Literal ||
        node.type === AST_NODE_TYPES.Identifier
    );
}

/**
 * Gets a string name representation of the given PropertyName node
 */
function getNameFromPropertyName(
    propertyName: TSESTree.PropertyName,
): string {
    if (propertyName.type === AST_NODE_TYPES.Identifier) {
        return propertyName.name;
    }
    return `${propertyName.value}`;
}

function getParamsSignature (
    params : TSESTree.Parameter[]
) : string {
    return params.map(p => {
        switch (p.type) {
            case AST_NODE_TYPES.Identifier: {
                return p.name;
            }
            case AST_NODE_TYPES.AssignmentPattern: {
                if (p.left.type == AST_NODE_TYPES.Identifier) {
                    return p.left.name;
                } else {
                    console.log("AssignmentPattern.left", p);
                    return `<Unknown AssignmentPattern.left ${p.left.type}>`;
                }
            }
            case AST_NODE_TYPES.ObjectPattern: {
                const properties = p.properties.map(p => {
                    if (p.type == AST_NODE_TYPES.Property) {
                        if (p.key.type == AST_NODE_TYPES.Identifier) {
                            return p.key.name;
                        }
                        console.log("ObjectPattern.property", p);
                        return `<Unknown ObjectPattern.property.key.type ${p.type}>`;
                    } else {
                        console.log("ObjectPattern.property", p);
                        return `<Unknown ObjectPattern.property ${p.type}>`;
                    }
                }).join(", ");
                return `{${properties}}`;
            }
            case AST_NODE_TYPES.RestElement: {
                if (p.argument.type == AST_NODE_TYPES.Identifier) {
                    return `...${p.argument.name}`;
                } else {
                    console.log("RestElement.argument", p);
                    return `<Unknown RestElement.argument.type ${p.type}>`;
                }
            }
            default: {
                console.log("Unknown param", p.type, p);
                return `<Unknown param ${p.type}>`;
            }
        }
    }).join(", ");
}

function getClassOrInterfaceName (
    method : TSESTree.MethodDefinition|TSESTree.TSMethodSignature
) : string {
    if (method.parent == undefined) {
        return `<Unknown Type>`;
    }
    if (method.parent.type == AST_NODE_TYPES.ClassBody) {
        if (
            method.parent.parent != undefined &&
            method.parent.parent.type == AST_NODE_TYPES.ClassDeclaration &&
            method.parent.parent.id != undefined
        ) {
            return method.parent.parent.id.name;
        }
    } else if (method.parent.type == AST_NODE_TYPES.TSInterfaceBody) {
        if (
            method.parent.parent != undefined &&
            method.parent.parent.type == AST_NODE_TYPES.TSInterfaceDeclaration &&
            method.parent.parent.id != undefined
        ) {
            return method.parent.parent.id.name;
        }
    }

    return `<Unknown Parent Type>`;
}
