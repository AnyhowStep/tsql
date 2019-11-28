import * as tm from "type-mapping";
import {TableData, ITable, TableWithPrimaryKey, DeletableTable, InsertableTable, TableWithoutAutoIncrement, TableWithAutoIncrement} from "./table";
import * as TableUtil from "./util";
import {MapperMap} from "../mapper-map";
import {Ast} from "../ast";
import {ColumnUtil} from "../column";
import {SelectConnection, ExecutionUtil, DeleteConnection, InsertOneConnection, InsertOneResult, DeleteResult, InsertIgnoreOneResult, InsertIgnoreOneConnection, ReplaceOneResult, ReplaceOneConnection, ReplaceManyResult, ReplaceManyConnection, InsertIgnoreManyResult, InsertIgnoreManyConnection, InsertManyResult, InsertManyConnection, IsolableDeleteConnection, UpdateConnection, UpdateResult, IsolableUpdateConnection, IsolableInsertOneConnection} from "../execution";
import {CandidateKey_NonUnion} from "../candidate-key";
import {QueryUtil} from "../unified-query";
import {StrictUnion, AssertNonUnion} from "../type-util";
import * as ExprLib from "../expr-library";
import {PrimaryKey_Input} from "../primary-key";
import {SuperKey_Input} from "../super-key";
import {Row_NonUnion, Row} from "../row";
import {SelectClause, SelectDelegate, SelectValueDelegate, SelectClauseUtil} from "../select-clause";
import {FromClauseUtil} from "../from-clause";
import {WhereDelegate} from "../where-clause";
import {AnyBuiltInExpr} from "../raw-expr";
import {InsertRow_Input, InsertRowRequireCandidateKey_Input} from "../insert";
import {InsertOneWithAutoIncrementReturnType, InsertIgnoreOneWithAutoIncrementReturnType, DeleteOneResult, DeleteZeroOrOneResult, UpdateOneResult, UpdateZeroOrOneResult} from "../execution/util";
import {AssignmentMapDelegate} from "../update";
/*import {PrimaryKey, PrimaryKeyUtil} from "../primary-key";
import {CandidateKey, CandidateKeyUtil} from "../candidate-key";
import {SuperKey, SuperKeyUtil} from "../super-key";*/
/*import {
    IConnection,
    UpdateOneResult,
    UpdateZeroOrOneResult,
    DeleteOneResult,
    DeleteZeroOrOneResult,
} from "../execution";
import {QueryUtil} from "../query";
import {Row} from "../row";
import {RawExprUtil} from "../raw-expr";
import {InsertRow, InsertUtil} from "../insert";
import {UpdateUtil} from "../update";
import {DeleteUtil} from "../delete";*/

export class Table<DataT extends TableData> implements ITable {
    readonly isLateral : DataT["isLateral"];
    readonly alias : DataT["alias"];
    readonly columns : DataT["columns"];
    readonly usedRef : DataT["usedRef"];

    readonly unaliasedAst : Ast;

    readonly insertEnabled : DataT["insertEnabled"];
    readonly deleteEnabled : DataT["deleteEnabled"];

    readonly autoIncrement : DataT["autoIncrement"];
    readonly id : DataT["id"];
    readonly primaryKey : DataT["primaryKey"];
    readonly candidateKeys : DataT["candidateKeys"];

    readonly generatedColumns : DataT["generatedColumns"];
    readonly nullableColumns : DataT["nullableColumns"];
    readonly explicitDefaultValueColumns : DataT["explicitDefaultValueColumns"];
    readonly mutableColumns : DataT["mutableColumns"];

    /**
     * You should never need to explicitly instantiate a `Table`.
     * Use `table()` instead.
     *
     * @param data
     * @param unaliasedAst
     */
    constructor (
        data : DataT,
        unaliasedAst : Ast
    ) {
        this.isLateral = data.isLateral;
        this.alias = data.alias;
        this.columns = data.columns;
        this.usedRef = data.usedRef;

        this.unaliasedAst = unaliasedAst;

        this.insertEnabled = data.insertEnabled;
        this.deleteEnabled = data.deleteEnabled;

        this.autoIncrement = data.autoIncrement;
        this.id = data.id;
        this.primaryKey = data.primaryKey;
        this.candidateKeys = data.candidateKeys;

        this.generatedColumns = data.generatedColumns;
        this.nullableColumns = data.nullableColumns;
        this.explicitDefaultValueColumns = data.explicitDefaultValueColumns;
        this.mutableColumns = data.mutableColumns;
    }

    /**
     * Makes all non-generated columns mutable.
     *
     * + Mutable columns may be modified with `UPDATE` statements using this library.
     * + Immutable columns may not be modified with this library
     *   (but could still be modified outside of this library)
     */
    addAllMutable () : TableUtil.AddAllMutable<this> {
        return TableUtil.addAllMutable(this);
    }

    /**
     * Adds a candidate key to the table.
     *
     * A candidate key is a minimal set of columns that uniquely identifies a row in a table.
     *
     * + A table may have zero-to-many candidate keys. (recommended to have at least one)
     * + A candidate key cannot be a subset of other candidate keys.
     * + A candidate key cannot be a superset of other candidate keys.
     * + A candidate key can intersect other candidate keys.
     * + A candidate key can be disjoint from other candidate keys.
     */
    addCandidateKey<
        KeyT extends readonly ColumnUtil.FromColumnMap<this["columns"]>[]
    > (
        delegate : (
            TableUtil.AddCandidateKeyDelegate<
                this,
                (
                    & KeyT
                    & TableUtil.AssertValidCandidateKey<
                        this,
                        KeyT
                    >
                )
            >
        )
    ) : (
        TableUtil.AddCandidateKey<this, KeyT>
    ) {
        return TableUtil.addCandidateKey<this, KeyT>(this, delegate);
    }

    /**
     * Adds columns to the table
     */
    addColumns<FieldsT extends tm.AnyField[]> (
        fields : FieldsT
    ) : (
        TableUtil.AddColumnsFromFieldArray<this, FieldsT>
    );
    addColumns<MapperMapT extends MapperMap> (
        mapperMap : MapperMapT
    ) : (
        TableUtil.AddColumnsFromMapperMap<this, MapperMapT>
    );
    addColumns (rawColumns : any) : any {
        return TableUtil.addColumns(this, rawColumns);
    }

    /**
     * Tells the library that these columns have explicit `DEFAULT` values.
     *
     * An example of an "explicit" default value,
     * ```sql
     * `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
     * ```
     *
     * + Columns with server default values are optional with `INSERT` statements.
     * + Generated columns have implicit default values.
     * + Nullable columns have implicit default values.
     * + `AUTO_INCREMENT` columns have implicit default values
     */
    addExplicitDefaultValue<
        ColumnsT extends readonly ColumnUtil.FromColumnMap<TableUtil.AddExplicitDefaultValueColumnMap<this>>[]
    > (
        delegate : (
            TableUtil.AddExplicitDefaultValueDelegate<
                this,
                ColumnsT
            >
        )
    ) : (
        TableUtil.AddExplicitDefaultValue<this, ColumnsT>
    ) {
        return TableUtil.addExplicitDefaultValue<this, ColumnsT>(this, delegate);
    }
    /**
     * Adds a `GENERATED` column to the table.
     *
     * + Setting generated column values will not be allowed with `INSERT` statements.
     * + Updating generated column values will also not be allowed with `UPDATE` statements.
     */
    addGenerated<
        ColumnsT extends readonly ColumnUtil.FromColumnMap<TableUtil.AddGeneratedColumnMap<this>>[]
    > (
        delegate : (
            TableUtil.AddGeneratedDelegate<
                this,
                ColumnsT
            >
        )
    ) : (
        TableUtil.AddGenerated<this, ColumnsT>
    ) {
        return TableUtil.addGenerated<this, ColumnsT>(this, delegate);
    }
    /**
     * Lets these columns be updated through this library.
     */
    addMutable<
        ColumnsT extends readonly ColumnUtil.FromColumnMap<TableUtil.AddMutableColumnMap<this>>[]
    > (
        delegate : (
            TableUtil.AddMutableDelegate<
                this,
                ColumnsT
            >
        )
    ) : (
        TableUtil.AddMutable<this, ColumnsT>
    ) {
        return TableUtil.addMutable<this, ColumnsT>(this, delegate);
    }

    /**
     * Aliases a table reference in a query.
     *
     * ```sql
     *  SELECT
     *      *
     *  FROM
     *      myTable AS aliasedTable
     * ```
     */
    as<NewTableAliasT extends string> (newTableAlias : NewTableAliasT) : TableUtil.As<this, NewTableAliasT> {
        return TableUtil.as(this, newTableAlias);
    }

    /**
     * Prevents rows of this table from being deleted through this library.
     *
     * Good for look-up tables, or append-only tables.
     */
    disableDelete () : TableUtil.DisableDelete<this> {
        return TableUtil.disableDelete(this);
    }
    /**
     * Prevents rows from being inserted through this library.
     *
     * Good for look-up tables.
     */
    disableInsert () : TableUtil.DisableInsert<this> {
        return TableUtil.disableInsert(this);
    }

    /**
     * Makes all columns immutable.
     */
    removeAllMutable () : TableUtil.RemoveAllMutable<this> {
        return TableUtil.removeAllMutable(this);
    }
    /**
     * Removes columns from the set of columns with explicit `DEFAULT` values
     *
     */
    removeExplicitDefaultValue<
        ColumnsT extends readonly ColumnUtil.FromColumnMap<TableUtil.RemoveExplicitDefaultValueColumnMap<this>>[]
    > (
        delegate : (
            TableUtil.RemoveExplicitDefaultValueDelegate<
                this,
                ColumnsT
            >
        )
    ) : (
        TableUtil.RemoveExplicitDefaultValue<this, ColumnsT>
    ) {
        return TableUtil.removeExplicitDefaultValue<this, ColumnsT>(this, delegate);
    }
    /**
     * Removes columns from the set of `GENERATED` columns.
     *
     */
    removeGenerated<
        ColumnsT extends readonly ColumnUtil.FromColumnMap<TableUtil.RemoveGeneratedColumnMap<this>>[]
    > (
        delegate : (
            TableUtil.RemoveGeneratedDelegate<
                this,
                ColumnsT
            >
        )
    ) : (
        TableUtil.RemoveGenerated<this, ColumnsT>
    ) {
        return TableUtil.removeGenerated<this, ColumnsT>(this, delegate);
    }
    /**
     * Removes columns from the set of mutable columns.
     *
     * You will not be able to update them through this library.
     *
     */
    removeMutable<
        ColumnsT extends readonly ColumnUtil.FromColumnMap<TableUtil.RemoveMutableColumnMap<this>>[]
    > (
        delegate : (
            TableUtil.RemoveMutableDelegate<
                this,
                ColumnsT
            >
        )
    ) : (
        TableUtil.RemoveMutable<this, ColumnsT>
    ) {
        return TableUtil.removeMutable<this, ColumnsT>(this, delegate);
    }

    /**
     * Designates one column as the `AUTO_INCREMENT` column.
     *
     * -----
     *
     * + `AUTO_INCREMENT` columns cannot be nullable
     * + `AUTO_INCREMENT` columns must be a candidate key
     * + `AUTO_INCREMENT` columns must be a `PRIMARY KEY`
     * + The `number|string|bigint` requirement is only a compile-time constraint
     */
    setAutoIncrement<
        AutoIncrementT extends ColumnUtil.FromColumnMap<TableUtil.SetAutoIncrementColumnMap<this>>
    > (
        delegate : (
            TableUtil.SetAutoIncrementDelegate<
                this,
                (
                    & AutoIncrementT
                    & TableUtil.AssertValidAutoIncrement<
                        this,
                        AutoIncrementT
                    >
                )
            >
        )
    ) : (
        TableUtil.SetAutoIncrement<this, AutoIncrementT>
    ) {
        return TableUtil.setAutoIncrement<this, AutoIncrementT>(this, delegate);
    }

    /**
     * Sets a column as the single-column identifier for this table.
     *
     * -----
     *
     * + `id-column`s cannot be nullable
     * + `id-column`s must be a candidate key
     * + `id-column`s must be a `PRIMARY KEY`
     *
     */
    setId<
        IdT extends ColumnUtil.FromColumnMap<TableUtil.SetIdColumnMap<this>>
    > (
        delegate : (
            TableUtil.SetIdDelegate<
                this,
                (
                    & IdT
                    & TableUtil.AssertValidId<
                        this,
                        IdT
                    >
                )
            >
        )
    ) : (
        TableUtil.SetId<this, IdT>
    ) {
        return TableUtil.setId<this, IdT>(this, delegate);
    }

    /**
     * Sets the `PRIMARY KEY` of the table.
     *
     * In MySQL, a `PRIMARY KEY` is just a candidate key
     * where all its columns are non-nullable.
     *
     * -----
     *
     * + `PRIMARY KEY` columns cannot be nullable
     * + `PRIMARY KEY` columns must be a candidate key
     */
    setPrimaryKey<
        KeyT extends readonly ColumnUtil.FromColumnMap<TableUtil.SetPrimaryKeyColumnMap<this>>[]
    > (
        delegate : (
            TableUtil.SetPrimaryKeyDelegate<
                this,
                (
                    & KeyT
                    & TableUtil.AssertValidPrimaryKey<
                        this,
                        KeyT
                    >
                )
            >
        )
    ) : (
        TableUtil.SetPrimaryKey<this, KeyT>
    ) {
        return TableUtil.setPrimaryKey<this, KeyT>(this, delegate);
    }

    /**
     * Sets the `schema` that this table belongs to.
     *
     * This is usually not required because the schema used
     * will be the one your database connection session is using.
     *
     * -----
     *
     * This library does not support cross-schema compile-time safe queries.
     *
     * However, if you **do** need cross-schema support,
     * this library can support it somewhat.
     */
    setSchemaName (
        newSchemaName : string
    ) : (
        TableUtil.SetSchemaName<this>
    ) {
        return TableUtil.setSchemaName(this, newSchemaName);
    }

    /**
     * Changes the alias of the table.
     *
     * Useful if you have multiple tables with exactly the same structure.
     *
     * This is different from `.as()`!
     *
     * -----
     *
     * You will have to call `.setSchemaName()` again if you called it before.
     */
    setTableAlias <NewTableAliasT extends string>(
        newTableAlias : NewTableAliasT
    ) : TableUtil.SetTableAlias<this, NewTableAliasT> {
        return TableUtil.setTableAlias(this, newTableAlias);
    };

    /*
    addParent<
        ParentT extends ITable
    > (
        parent : TableUtil.Parent<this, ParentT>
    ) : (
        TableUtil.AddParent<this, ParentT>
    ) {
        return TableUtil.addParent<this, ParentT>(this, parent);
    }

    /*
    validate (connection : IConnection, result : TableUtil.ValidateTableResult) {
        return TableUtil.validate(this, connection, result);
    }*/

    async assertExists (
        connection : SelectConnection,
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >
        >
    ) : (
        Promise<void>
    ) {
        return TableUtil.assertExists(
            this,
            connection,
            whereDelegate
        );
    }
    async assertExistsByCandidateKey (
        connection : SelectConnection,
        candidateKey : StrictUnion<CandidateKey_NonUnion<this>>
    ) : (
        Promise<void>
    ) {
        return this.assertExists(
            connection,
            () => ExprLib.eqCandidateKey(this, candidateKey) as any
        );
    }
    async assertExistsByPrimaryKey (
        this : Extract<this, TableWithPrimaryKey>,
        connection : SelectConnection,
        primaryKey : PrimaryKey_Input<Extract<this, TableWithPrimaryKey>>
    ) : (
        Promise<void>
    ) {
        return this.assertExists(
            connection,
            () => ExprLib.eqPrimaryKey(this, primaryKey) as any
        );
    }
    async assertExistsBySuperKey (
        connection : SelectConnection,
        superKey : SuperKey_Input<this>
    ) : (
        Promise<void>
    ) {
        return this.assertExists(
            connection,
            () => ExprLib.eqSuperKey(this, superKey) as any
        );
    }

    async exists (
        connection : SelectConnection,
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >
        >
    ) : (
        Promise<boolean>
    ) {
        return QueryUtil.newInstance()
            .from<this>(
                this as (
                    this &
                    QueryUtil.AssertValidCurrentJoin<QueryUtil.NewInstance, this>
                )
            )
            .where(whereDelegate)
            .exists(connection);
    }
    async existsByCandidateKey (
        connection : SelectConnection,
        candidateKey : StrictUnion<CandidateKey_NonUnion<this>>
    ) : (
        Promise<boolean>
    ) {
        return this.exists(
            connection,
            () => ExprLib.eqCandidateKey(this, candidateKey) as any
        );
    }
    async existsByPrimaryKey (
        this : Extract<this, TableWithPrimaryKey>,
        connection : SelectConnection,
        primaryKey : PrimaryKey_Input<Extract<this, TableWithPrimaryKey>>
    ) : (
        Promise<boolean>
    ) {
        return this.exists(
            connection,
            () => ExprLib.eqPrimaryKey(this, primaryKey) as any
        );
    }
    async existsBySuperKey (
        connection : SelectConnection,
        superKey : SuperKey_Input<this>
    ) : (
        Promise<boolean>
    ) {
        return this.exists(
            connection,
            () => ExprLib.eqSuperKey(this, superKey) as any
        );
    }

    fetchOne (
        connection : SelectConnection,
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >
        >
    ) : ExecutionUtil.FetchOnePromise<Row_NonUnion<this>>;
    fetchOne<
        SelectsT extends SelectClause
    > (
        connection : SelectConnection,
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >
        >,
        selectDelegate : SelectDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >,
            undefined,
            SelectsT
        >
    ) : ExecutionUtil.FetchOneReturnType<
        QueryUtil.Select<
            QueryUtil.From<
                QueryUtil.NewInstance,
                this
            >,
            SelectsT
        >
    >;
    fetchOne (
        connection : SelectConnection,
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >
        >,
        selectDelegate? : (...args : any[]) => any[]
    ) : ExecutionUtil.FetchOnePromise<any> {
        return TableUtil.__fetchOneHelper(
            this,
            connection,
            whereDelegate,
            selectDelegate
        );
    }

    fetchOneByCandidateKey (
        connection : SelectConnection,
        candidateKey : StrictUnion<CandidateKey_NonUnion<this>>
    ) : ExecutionUtil.FetchOnePromise<Row_NonUnion<this>>;
    fetchOneByCandidateKey<
        SelectsT extends SelectClause
    > (
        connection : SelectConnection,
        candidateKey : StrictUnion<CandidateKey_NonUnion<this>>,
        selectDelegate : SelectDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >,
            undefined,
            SelectsT
        >
    ) : ExecutionUtil.FetchOneReturnType<
        QueryUtil.Select<
            QueryUtil.From<
                QueryUtil.NewInstance,
                this
            >,
            SelectsT
        >
    >;
    fetchOneByCandidateKey (
        connection : SelectConnection,
        candidateKey : StrictUnion<CandidateKey_NonUnion<this>>,
        selectDelegate? : (...args : any[]) => any[]
    ) : ExecutionUtil.FetchOnePromise<any> {
        return TableUtil.__fetchOneHelper(
            this,
            connection,
            () => ExprLib.eqCandidateKey(this, candidateKey) as any,
            selectDelegate
        );
    }
    fetchOneByPrimaryKey (
        this : Extract<this, TableWithPrimaryKey>,
        connection : SelectConnection,
        primaryKey : PrimaryKey_Input<Extract<this, TableWithPrimaryKey>>
    ) : ExecutionUtil.FetchOnePromise<Row_NonUnion<this>>;
    fetchOneByPrimaryKey<
        SelectsT extends SelectClause
    > (
        this : Extract<this, TableWithPrimaryKey>,
        connection : SelectConnection,
        primaryKey : PrimaryKey_Input<Extract<this, TableWithPrimaryKey>>,
        selectDelegate : SelectDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >,
            undefined,
            SelectsT
        >
    ) : ExecutionUtil.FetchOneReturnType<
        QueryUtil.Select<
            QueryUtil.From<
                QueryUtil.NewInstance,
                this
            >,
            SelectsT
        >
    >;
    fetchOneByPrimaryKey (
        this : Extract<this, TableWithPrimaryKey>,
        connection : SelectConnection,
        primaryKey : PrimaryKey_Input<Extract<this, TableWithPrimaryKey>>,
        selectDelegate? : (...args : any[]) => any[]
    ) : ExecutionUtil.FetchOnePromise<any> {
        return TableUtil.__fetchOneHelper(
            this,
            connection,
            () => ExprLib.eqPrimaryKey(this, primaryKey) as any,
            selectDelegate
        );
    }
    fetchOneBySuperKey (
        connection : SelectConnection,
        superKey : SuperKey_Input<this>
    ) : ExecutionUtil.FetchOnePromise<Row_NonUnion<this>>;
    fetchOneBySuperKey<
        SelectsT extends SelectClause
    > (
        connection : SelectConnection,
        superKey : SuperKey_Input<this>,
        selectDelegate : SelectDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >,
            undefined,
            SelectsT
        >
    ) : ExecutionUtil.FetchOneReturnType<
        QueryUtil.Select<
            QueryUtil.From<
                QueryUtil.NewInstance,
                this
            >,
            SelectsT
        >
    >;
    fetchOneBySuperKey (
        connection : SelectConnection,
        superKey : SuperKey_Input<this>,
        selectDelegate? : (...args : any[]) => any[]
    ) : ExecutionUtil.FetchOnePromise<any> {
        return TableUtil.__fetchOneHelper(
            this,
            connection,
            () => ExprLib.eqSuperKey(this, superKey) as any,
            selectDelegate
        );
    }

    fetchValue<
        BuiltInExprT extends AnyBuiltInExpr
    > (
        connection : SelectConnection,
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >
        >,
        selectValueDelegate : SelectValueDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >,
            undefined,
            BuiltInExprT
        >
    ) : ExecutionUtil.FetchValueReturnType<
        /**
         * @todo Report assignability bug to TS issues page
         */
        /*
            QueryUtil.SelectValue<
                QueryUtil.From<
                    QueryUtil.NewInstance,
                    this
                >,
                BuiltInExprT
            >
        */
        QueryUtil.SelectNoSelectClause<
            QueryUtil.From<
                QueryUtil.NewInstance,
                this
            >,
            SelectClauseUtil.ValueFromRawExpr<BuiltInExprT>
        >
    > {
        return TableUtil.fetchValue<this, BuiltInExprT>(
            this,
            connection,
            whereDelegate,
            selectValueDelegate
        );
    }

    fetchValueByCandidateKey<
        BuiltInExprT extends AnyBuiltInExpr
    > (
        connection : SelectConnection,
        candidateKey : StrictUnion<CandidateKey_NonUnion<this>>,
        selectValueDelegate : SelectValueDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >,
            undefined,
            BuiltInExprT
        >
    ) : ExecutionUtil.FetchValueReturnType<
        QueryUtil.SelectNoSelectClause<
            QueryUtil.From<
                QueryUtil.NewInstance,
                this
            >,
            SelectClauseUtil.ValueFromRawExpr<BuiltInExprT>
        >
    > {
        return this.fetchValue(
            connection,
            () => ExprLib.eqCandidateKey(this, candidateKey) as any,
            selectValueDelegate
        );
    }
    fetchValueByPrimaryKey<
        BuiltInExprT extends AnyBuiltInExpr
    > (
        this : Extract<this, TableWithPrimaryKey>,
        connection : SelectConnection,
        primaryKey : PrimaryKey_Input<Extract<this, TableWithPrimaryKey>>,
        selectValueDelegate : SelectValueDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                Extract<this, TableWithPrimaryKey>
            >,
            undefined,
            BuiltInExprT
        >
    ) : ExecutionUtil.FetchValueReturnType<
        QueryUtil.SelectNoSelectClause<
            QueryUtil.From<
                QueryUtil.NewInstance,
                Extract<this, TableWithPrimaryKey>
            >,
            SelectClauseUtil.ValueFromRawExpr<BuiltInExprT>
        >
    > {
        return this.fetchValue(
            connection,
            () => ExprLib.eqPrimaryKey(this, primaryKey) as any,
            selectValueDelegate
        );
    }
    fetchValueBySuperKey<
        BuiltInExprT extends AnyBuiltInExpr
    > (
        connection : SelectConnection,
        superKey : SuperKey_Input<this>,
        selectValueDelegate : SelectValueDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >,
            undefined,
            BuiltInExprT
        >
    ) : ExecutionUtil.FetchValueReturnType<
        QueryUtil.SelectNoSelectClause<
            QueryUtil.From<
                QueryUtil.NewInstance,
                this
            >,
            SelectClauseUtil.ValueFromRawExpr<BuiltInExprT>
        >
    > {
        return this.fetchValue(
            connection,
            () => ExprLib.eqSuperKey(this, superKey) as any,
            selectValueDelegate
        );
    }

    insertOne (
        this : Extract<this, TableWithAutoIncrement & InsertableTable>,
        connection : InsertOneConnection,
        row : InsertRow_Input<Extract<this, TableWithAutoIncrement & InsertableTable>>
    ) : Promise<InsertOneWithAutoIncrementReturnType<Extract<this, TableWithAutoIncrement & InsertableTable>>>;
    insertOne (
        this : Extract<this, TableWithoutAutoIncrement & InsertableTable>,
        connection : InsertOneConnection,
        row : InsertRow_Input<Extract<this, TableWithoutAutoIncrement & InsertableTable>>
    ) : Promise<InsertOneResult>;
    insertOne (
        connection : InsertOneConnection,
        row : any
    ) : Promise<InsertOneResult> {
        return ExecutionUtil.insertOne(
            this as any,
            connection,
            row as any
        );
    }

    insertMany (
        this : Extract<this, InsertableTable>,
        connection : InsertManyConnection,
        rows : readonly InsertRow_Input<Extract<this, InsertableTable>>[]
    ) : Promise<InsertManyResult> {
        return ExecutionUtil.insertMany(
            this,
            connection,
            rows
        );
    }

    insertIgnoreOne (
        this : Extract<this, TableWithAutoIncrement & InsertableTable>,
        connection : InsertIgnoreOneConnection,
        row : InsertRow_Input<Extract<this, TableWithAutoIncrement & InsertableTable>>
    ) : Promise<InsertIgnoreOneWithAutoIncrementReturnType<Extract<this, TableWithAutoIncrement & InsertableTable>>>;
    insertIgnoreOne (
        this : Extract<this, TableWithoutAutoIncrement & InsertableTable>,
        connection : InsertIgnoreOneConnection,
        row : InsertRow_Input<Extract<this, TableWithoutAutoIncrement & InsertableTable>>
    ) : Promise<InsertIgnoreOneResult>;
    insertIgnoreOne (
        connection : InsertIgnoreOneConnection,
        row : any
    ) : Promise<InsertIgnoreOneResult> {
        return ExecutionUtil.insertIgnoreOne(
            this as any,
            connection,
            row as any
        );
    }

    insertIgnoreMany (
        this : Extract<this, InsertableTable>,
        connection : InsertIgnoreManyConnection,
        rows : readonly InsertRow_Input<Extract<this, InsertableTable>>[]
    ) : Promise<InsertIgnoreManyResult> {
        return ExecutionUtil.insertIgnoreMany(
            this,
            connection,
            rows
        );
    }

    replaceOne (
        this : Extract<this, InsertableTable & DeletableTable>,
        connection : ReplaceOneConnection,
        row : InsertRow_Input<Extract<this, InsertableTable & DeletableTable>>
    ) : Promise<ReplaceOneResult> {
        return ExecutionUtil.replaceOne(
            this,
            connection,
            row
        );
    }

    replaceMany (
        this : Extract<this, InsertableTable & DeletableTable>,
        connection : ReplaceManyConnection,
        rows : readonly InsertRow_Input<Extract<this, InsertableTable & DeletableTable>>[]
    ) : Promise<ReplaceManyResult> {
        return ExecutionUtil.replaceMany(
            this,
            connection,
            rows
        );
    }

    delete (
        this : Extract<this, DeletableTable>,
        connection : DeleteConnection,
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                Extract<this, DeletableTable>
            >
        >
    ) : Promise<DeleteResult> {
        return ExecutionUtil.delete(this, connection, whereDelegate);
    }

    deleteOne (
        this : Extract<this, DeletableTable>,
        connection : IsolableDeleteConnection,
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                Extract<this, DeletableTable>
            >
        >
    ) : Promise<DeleteOneResult> {
        return ExecutionUtil.deleteOne(this, connection, whereDelegate);
    }

    deleteZeroOrOne (
        this : Extract<this, DeletableTable>,
        connection : IsolableDeleteConnection,
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                Extract<this, DeletableTable>
            >
        >
    ) : Promise<DeleteZeroOrOneResult> {
        return ExecutionUtil.deleteZeroOrOne(this, connection, whereDelegate);
    }

    deleteOneByCandidateKey (
        this : Extract<this, DeletableTable>,
        connection : IsolableDeleteConnection,
        candidateKey : StrictUnion<CandidateKey_NonUnion<this>>
    ) : Promise<DeleteOneResult> {
        return this.deleteOne(
            connection,
            () => ExprLib.eqCandidateKey(
                this,
                candidateKey
            ) as any
        );
    }

    deleteOneByPrimaryKey (
        this : Extract<this, DeletableTable & TableWithPrimaryKey>,
        connection : IsolableDeleteConnection,
        primaryKey : PrimaryKey_Input<Extract<this, DeletableTable & TableWithPrimaryKey>>
    ) : Promise<DeleteOneResult> {
        return this.deleteOne(
            connection,
            () => ExprLib.eqPrimaryKey(
                this,
                primaryKey
            ) as any
        );
    }

    deleteOneBySuperKey (
        this : Extract<this, DeletableTable>,
        connection : IsolableDeleteConnection,
        superKey : SuperKey_Input<this>
    ) : Promise<DeleteOneResult> {
        return this.deleteOne(
            connection,
            () => ExprLib.eqSuperKey(
                this,
                superKey
            ) as any
        );
    }

    deleteZeroOrOneByCandidateKey (
        this : Extract<this, DeletableTable>,
        connection : IsolableDeleteConnection,
        candidateKey : StrictUnion<CandidateKey_NonUnion<this>>
    ) : Promise<DeleteZeroOrOneResult> {
        return this.deleteZeroOrOne(
            connection,
            () => ExprLib.eqCandidateKey(
                this,
                candidateKey
            ) as any
        );
    }

    deleteZeroOrOneByPrimaryKey (
        this : Extract<this, DeletableTable & TableWithPrimaryKey>,
        connection : IsolableDeleteConnection,
        primaryKey : PrimaryKey_Input<Extract<this, DeletableTable & TableWithPrimaryKey>>
    ) : Promise<DeleteZeroOrOneResult> {
        return this.deleteZeroOrOne(
            connection,
            () => ExprLib.eqPrimaryKey(
                this,
                primaryKey
            ) as any
        );
    }

    deleteZeroOrOneBySuperKey (
        this : Extract<this, DeletableTable>,
        connection : IsolableDeleteConnection,
        superKey : SuperKey_Input<this>
    ) : Promise<DeleteZeroOrOneResult> {
        return this.deleteZeroOrOne(
            connection,
            () => ExprLib.eqSuperKey(
                this,
                superKey
            ) as any
        );
    }

    update (
        connection : UpdateConnection,
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >
        >,
        assignmentMapDelegate : AssignmentMapDelegate<this>
    ) : Promise<UpdateResult> {
        return ExecutionUtil.update(this, connection, whereDelegate, assignmentMapDelegate);
    }

    updateOne (
        connection : IsolableUpdateConnection,
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >
        >,
        assignmentMapDelegate : AssignmentMapDelegate<this>
    ) : Promise<UpdateOneResult> {
        return ExecutionUtil.updateOne(this, connection, whereDelegate, assignmentMapDelegate);
    }

    updateZeroOrOne (
        connection : IsolableUpdateConnection,
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >
        >,
        assignmentMapDelegate : AssignmentMapDelegate<this>
    ) : Promise<UpdateZeroOrOneResult> {
        return ExecutionUtil.updateZeroOrOne(this, connection, whereDelegate, assignmentMapDelegate);
    }

    updateOneByCandidateKey (
        connection : IsolableUpdateConnection,
        candidateKey : StrictUnion<CandidateKey_NonUnion<this>>,
        assignmentMapDelegate : AssignmentMapDelegate<this>
    ) : Promise<UpdateOneResult> {
        return this.updateOne(
            connection,
            () => ExprLib.eqCandidateKey(
                this,
                candidateKey
            ) as any,
            assignmentMapDelegate
        );
    }

    updateOneByPrimaryKey (
        this : Extract<this, TableWithPrimaryKey>,
        connection : IsolableUpdateConnection,
        primaryKey : PrimaryKey_Input<Extract<this, TableWithPrimaryKey>>,
        assignmentMapDelegate : AssignmentMapDelegate<this>
    ) : Promise<UpdateOneResult> {
        return this.updateOne(
            connection,
            () => ExprLib.eqPrimaryKey(
                this,
                primaryKey
            ) as any,
            assignmentMapDelegate
        );
    }

    updateOneBySuperKey (
        connection : IsolableUpdateConnection,
        superKey : SuperKey_Input<this>,
        assignmentMapDelegate : AssignmentMapDelegate<this>
    ) : Promise<UpdateOneResult> {
        return this.updateOne(
            connection,
            () => ExprLib.eqSuperKey(
                this,
                superKey
            ) as any,
            assignmentMapDelegate
        );
    }

    updateZeroOrOneByCandidateKey (
        connection : IsolableUpdateConnection,
        candidateKey : StrictUnion<CandidateKey_NonUnion<this>>,
        assignmentMapDelegate : AssignmentMapDelegate<this>
    ) : Promise<UpdateZeroOrOneResult> {
        return this.updateZeroOrOne(
            connection,
            () => ExprLib.eqCandidateKey(
                this,
                candidateKey
            ) as any,
            assignmentMapDelegate
        );
    }

    updateZeroOrOneByPrimaryKey (
        this : Extract<this, TableWithPrimaryKey>,
        connection : IsolableUpdateConnection,
        primaryKey : PrimaryKey_Input<Extract<this, TableWithPrimaryKey>>,
        assignmentMapDelegate : AssignmentMapDelegate<this>
    ) : Promise<UpdateZeroOrOneResult> {
        return this.updateZeroOrOne(
            connection,
            () => ExprLib.eqPrimaryKey(
                this,
                primaryKey
            ) as any,
            assignmentMapDelegate
        );
    }

    updateZeroOrOneBySuperKey (
        connection : IsolableUpdateConnection,
        superKey : SuperKey_Input<this>,
        assignmentMapDelegate : AssignmentMapDelegate<this>
    ) : Promise<UpdateZeroOrOneResult> {
        return this.updateZeroOrOne(
            connection,
            () => ExprLib.eqSuperKey(
                this,
                superKey
            ) as any,
            assignmentMapDelegate
        );
    }

    insertAndFetch (
        this : Extract<this, TableWithAutoIncrement & InsertableTable>,
        connection : IsolableInsertOneConnection,
        row : InsertRow_Input<Extract<this, TableWithAutoIncrement & InsertableTable>>
    ) : Promise<Row<Extract<this, TableWithAutoIncrement & InsertableTable>>>;
    insertAndFetch (
        this : Extract<this, TableWithoutAutoIncrement & InsertableTable>,
        connection : IsolableInsertOneConnection,
        row : InsertRowRequireCandidateKey_Input<
            Extract<this, TableWithoutAutoIncrement & InsertableTable>
        >
    ) : Promise<Row<Extract<this, TableWithoutAutoIncrement & InsertableTable>>>;
    insertAndFetch (
        connection : IsolableInsertOneConnection,
        row : any
    ) : Promise<any> {
        return ExecutionUtil.insertAndFetch(
            this as any,
            connection,
            row as any
        );
    }

    updateAndFetchOneByCandidateKey<
        CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<this>>,
        AssignmentMapT extends ExecutionUtil.UpdateAndFetchOneByCandidateKeyAssignmentMap<this, CandidateKeyT>
    > (
        connection : IsolableUpdateConnection,
        candidateKey : CandidateKeyT & AssertNonUnion<CandidateKeyT>,
        assignmentMapDelegate : AssignmentMapDelegate<this, AssignmentMapT>
    ) : Promise<ExecutionUtil.UpdateAndFetchOneResult<this, AssignmentMapT>> {
        return ExecutionUtil.updateAndFetchOneByCandidateKey<
            this,
            CandidateKeyT,
            AssignmentMapT
        >(
            this,
            connection,
            candidateKey,
            assignmentMapDelegate
        );
    }

    updateAndFetchOneByPrimaryKey<
        AssignmentMapT extends ExecutionUtil.UpdateAndFetchOneByPrimaryKeyAssignmentMap<
            Extract<this, TableWithPrimaryKey>
        >
    > (
        this : Extract<this, TableWithPrimaryKey>,
        connection : IsolableUpdateConnection,
        primaryKey : PrimaryKey_Input<
            Extract<this, TableWithPrimaryKey>
        >,
        assignmentMapDelegate : AssignmentMapDelegate<
            Extract<this, TableWithPrimaryKey>,
            AssignmentMapT
        >
    ) : Promise<ExecutionUtil.UpdateAndFetchOneResult<
        Extract<this, TableWithPrimaryKey>,
        AssignmentMapT
    >> {
        return ExecutionUtil.updateAndFetchOneByPrimaryKey<
            Extract<this, TableWithPrimaryKey>,
            AssignmentMapT
        >(
            this,
            connection,
            primaryKey,
            assignmentMapDelegate
        );
    }

    updateAndFetchOneBySuperKey<
        SuperKeyT extends SuperKey_Input<this>,
        AssignmentMapT extends ExecutionUtil.UpdateAndFetchOneBySuperKeyAssignmentMap<this, SuperKeyT>
    > (
        connection : IsolableUpdateConnection,
        superKey : SuperKeyT & AssertNonUnion<SuperKeyT>,
        assignmentMapDelegate : AssignmentMapDelegate<this, AssignmentMapT>
    ) : Promise<ExecutionUtil.UpdateAndFetchOneResult<this, AssignmentMapT>> {
        return ExecutionUtil.updateAndFetchOneBySuperKey<
            this,
            SuperKeyT,
            AssignmentMapT
        >(
            this,
            connection,
            superKey,
            assignmentMapDelegate
        );
    }

    updateAndFetchZeroOrOneByCandidateKey<
        CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<this>>,
        AssignmentMapT extends ExecutionUtil.UpdateAndFetchOneByCandidateKeyAssignmentMap<this, CandidateKeyT>
    > (
        connection : IsolableUpdateConnection,
        candidateKey : CandidateKeyT & AssertNonUnion<CandidateKeyT>,
        assignmentMapDelegate : AssignmentMapDelegate<this, AssignmentMapT>
    ) : Promise<ExecutionUtil.UpdateAndFetchZeroOrOneResult<this, AssignmentMapT>> {
        return ExecutionUtil.updateAndFetchZeroOrOneByCandidateKey<
            this,
            CandidateKeyT,
            AssignmentMapT
        >(
            this,
            connection,
            candidateKey,
            assignmentMapDelegate
        );
    }

    updateAndFetchZeroOrOneByPrimaryKey<
        AssignmentMapT extends ExecutionUtil.UpdateAndFetchOneByPrimaryKeyAssignmentMap<
            Extract<this, TableWithPrimaryKey>
        >
    > (
        this : Extract<this, TableWithPrimaryKey>,
        connection : IsolableUpdateConnection,
        primaryKey : PrimaryKey_Input<
            Extract<this, TableWithPrimaryKey>
        >,
        assignmentMapDelegate : AssignmentMapDelegate<
            Extract<this, TableWithPrimaryKey>,
            AssignmentMapT
        >
    ) : Promise<ExecutionUtil.UpdateAndFetchZeroOrOneResult<
        Extract<this, TableWithPrimaryKey>,
        AssignmentMapT
    >> {
        return ExecutionUtil.updateAndFetchZeroOrOneByPrimaryKey<
            Extract<this, TableWithPrimaryKey>,
            AssignmentMapT
        >(
            this,
            connection,
            primaryKey,
            assignmentMapDelegate
        );
    }

    updateAndFetchZeroOrOneBySuperKey<
        SuperKeyT extends SuperKey_Input<this>,
        AssignmentMapT extends ExecutionUtil.UpdateAndFetchOneBySuperKeyAssignmentMap<this, SuperKeyT>
    > (
        connection : IsolableUpdateConnection,
        superKey : SuperKeyT & AssertNonUnion<SuperKeyT>,
        assignmentMapDelegate : AssignmentMapDelegate<this, AssignmentMapT>
    ) : Promise<ExecutionUtil.UpdateAndFetchZeroOrOneResult<this, AssignmentMapT>> {
        return ExecutionUtil.updateAndFetchZeroOrOneBySuperKey<
            this,
            SuperKeyT,
            AssignmentMapT
        >(
            this,
            connection,
            superKey,
            assignmentMapDelegate
        );
    }
}
