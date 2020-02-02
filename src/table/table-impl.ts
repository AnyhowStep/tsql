import * as tm from "type-mapping";
import {TableData, ITable, TableWithPrimaryKey, DeletableTable, InsertableTable, TableWithAutoIncrement} from "./table";
import * as TableUtil from "./util";
import {MapperMap} from "../mapper-map";
import {Ast} from "../ast";
import {ColumnUtil} from "../column";
import {ExecutionUtil, InsertOneConnection, InsertOneResult, InsertIgnoreOneResult, InsertIgnoreOneConnection, ReplaceOneResult, ReplaceOneConnection, ReplaceManyResult, ReplaceManyConnection, InsertIgnoreManyResult, InsertIgnoreManyConnection, InsertManyResult, InsertManyConnection, UpdateConnection, UpdateResult, IsolableUpdateConnection, IsolableInsertOneConnection} from "../execution";
import {CandidateKey_NonUnion} from "../candidate-key";
import {StrictUnion, AssertNonUnion} from "../type-util";
import * as ExprLib from "../expr-library";
import {PrimaryKey_Input} from "../primary-key";
import {SuperKey_Input} from "../super-key";
import {Row} from "../row";
import {FromClauseUtil} from "../from-clause";
import {WhereDelegate} from "../where-clause";
import {CustomInsertRow} from "../insert";
import {InsertOneWithAutoIncrementReturnType, InsertIgnoreOneWithAutoIncrementReturnType, UpdateOneResult, UpdateZeroOrOneResult, ReplaceOneWithAutoIncrementReturnType} from "../execution/util";
import {AssignmentMapDelegate} from "../update";
import {TableWhere} from "../table-where";

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

    readonly explicitAutoIncrementValueEnabled : DataT["explicitAutoIncrementValueEnabled"];

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

        this.explicitAutoIncrementValueEnabled = data.explicitAutoIncrementValueEnabled;
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
     *
     * @deprecated
     */
    addColumns<FieldsT extends tm.AnyField[]> (
        fields : FieldsT
    ) : (
        TableUtil.AddColumnsFromFieldArray<this, FieldsT>
    );
    /**
     * Adds columns to the table
     */
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
     * The opposite of `disableInsert()`.
     * You really shouldn't need to use this as tables allow insert by default.
     */
    enableInsert () : TableUtil.EnableInsert<this> {
        return TableUtil.enableInsert(this);
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

    enableExplicitAutoIncrementValue () : (
        TableUtil.EnableExplicitAutoIncrementValue<this>
    ) {
        return TableUtil.enableExplicitAutoIncrementValue(this);
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

    pickColumns<
        NewColumnsT extends readonly ColumnUtil.FromColumnMap<this["columns"]>[]
    > (
        delegate : (
            TableUtil.PickColumnsDelegate<
                this,
                NewColumnsT
            >
        )
    ) : (
        TableUtil.PickColumns<this, NewColumnsT>
    ) {
        return TableUtil.pickColumns(this, delegate);
    }

    insertOne (
        this : Extract<this, InsertableTable>,
        connection : InsertOneConnection,
        row : CustomInsertRow<Extract<this, InsertableTable>>
    ) : Promise<
        this extends TableWithAutoIncrement ?
        InsertOneWithAutoIncrementReturnType<Extract<this, TableWithAutoIncrement>> :
        InsertOneResult
    > {
        return ExecutionUtil.insertOne<Extract<this, InsertableTable>>(
            this,
            connection,
            row
        );
    }

    insertMany (
        this : Extract<this, InsertableTable>,
        connection : InsertManyConnection,
        rows : readonly CustomInsertRow<Extract<this, InsertableTable>>[]
    ) : Promise<InsertManyResult> {
        return ExecutionUtil.insertMany(
            this,
            connection,
            rows
        );
    }

    insertIgnoreOne (
        this : Extract<this, InsertableTable>,
        connection : InsertIgnoreOneConnection,
        row : CustomInsertRow<Extract<this, InsertableTable>>
    ) : Promise<
        this extends TableWithAutoIncrement ?
        InsertIgnoreOneWithAutoIncrementReturnType<Extract<this, TableWithAutoIncrement>> :
        InsertIgnoreOneResult
    > {
        return ExecutionUtil.insertIgnoreOne<Extract<this, InsertableTable>>(
            this,
            connection,
            row
        );
    }

    insertIgnoreMany (
        this : Extract<this, InsertableTable>,
        connection : InsertIgnoreManyConnection,
        rows : readonly CustomInsertRow<Extract<this, InsertableTable>>[]
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
        row : CustomInsertRow<Extract<this, InsertableTable & DeletableTable>>
    ) : Promise<
        this extends TableWithAutoIncrement ?
        ReplaceOneWithAutoIncrementReturnType<Extract<this, TableWithAutoIncrement>> :
        ReplaceOneResult
    > {
        return ExecutionUtil.replaceOne(
            this,
            connection,
            row
        );
    }

    replaceMany (
        this : Extract<this, InsertableTable & DeletableTable>,
        connection : ReplaceManyConnection,
        rows : readonly CustomInsertRow<Extract<this, InsertableTable & DeletableTable>>[]
    ) : Promise<ReplaceManyResult> {
        return ExecutionUtil.replaceMany(
            this,
            connection,
            rows
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
        this : Extract<this, InsertableTable>,
        connection : IsolableInsertOneConnection,
        row : ExecutionUtil.InsertAndFetchRow<
            Extract<this, InsertableTable>
        >
    ) : Promise<Row<Extract<this, InsertableTable>>> {
        return ExecutionUtil.insertAndFetch<Extract<this, InsertableTable>>(
            this,
            connection,
            row
        );
    }

    updateAndFetchOneByCandidateKey<
        CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<this>>,
        AssignmentMapT extends ExecutionUtil.UpdateAndFetchOneByCandidateKeyAssignmentMap<this>
    > (
        connection : IsolableUpdateConnection,
        candidateKey : CandidateKeyT,// & AssertNonUnion<CandidateKeyT>,
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
        AssignmentMapT extends ExecutionUtil.UpdateAndFetchOneBySuperKeyAssignmentMap<this>
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
        AssignmentMapT extends ExecutionUtil.UpdateAndFetchOneByCandidateKeyAssignmentMap<this>
    > (
        connection : IsolableUpdateConnection,
        candidateKey : CandidateKeyT,// & AssertNonUnion<CandidateKeyT>,
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
        AssignmentMapT extends ExecutionUtil.UpdateAndFetchOneBySuperKeyAssignmentMap<this>
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

    where (
        whereDelegate : WhereDelegate<
            FromClauseUtil.From<
                FromClauseUtil.NewInstance,
                this
            >
        >
    ) : TableWhere<this> {
        return new TableWhere<this>(this, whereDelegate);
    }
    whereEqCandidateKey (
        candidateKey : StrictUnion<CandidateKey_NonUnion<this>>
    ) : TableWhere<this> {
        return new TableWhere<this>(
            this,
            () => ExprLib.eqCandidateKey(
                this,
                candidateKey
            ) as any
        );
    }
    whereEqPrimaryKey (
        this : Extract<this, TableWithPrimaryKey>,
        primaryKey : PrimaryKey_Input<Extract<this, TableWithPrimaryKey>>
    ) : TableWhere<this> {
        return new TableWhere<this>(
            this,
            () => ExprLib.eqPrimaryKey(
                this,
                primaryKey
            ) as any
        );
    }
    whereEqSuperKey (
        superKey : SuperKey_Input<this>
    ) : TableWhere<this> {
        return new TableWhere<this>(
            this,
            () => ExprLib.eqSuperKey(
                this,
                superKey
            ) as any
        );
    }
}
