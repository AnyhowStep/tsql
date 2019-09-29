import * as tm from "type-mapping";
import {TableData, ITable, TableWithPrimaryKey} from "./table";
import * as TableUtil from "./util";
import {MapperMap} from "../mapper-map";
import {Ast} from "../ast";
import {ColumnUtil} from "../column";
import {SelectConnection} from "../execution";
import {CandidateKey_NonUnion} from "../candidate-key";
import {QueryUtil} from "../unified-query";
import {StrictUnion} from "../type-util";
import * as ExprLib from "../expr-library";
import {PrimaryKey_Input} from "../primary-key";
import {SuperKey_Input} from "../super-key";
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

    async assertExistsByCandidateKey (
        connection : SelectConnection,
        candidateKey : StrictUnion<CandidateKey_NonUnion<this>>
    ) : (
        Promise<void>
    ) {
        return QueryUtil.newInstance()
            .from<this>(
                this as (
                    this &
                    QueryUtil.AssertValidCurrentJoin<QueryUtil.NewInstance, this>
                )
            )
            .where(() => (
                ExprLib.eqCandidateKey(this, candidateKey) as any
            ))
            .assertExists(connection);
    }
    async assertExistsByPrimaryKey (
        this : Extract<this, TableWithPrimaryKey>,
        connection : SelectConnection,
        primaryKey : PrimaryKey_Input<Extract<this, TableWithPrimaryKey>>
    ) : (
        Promise<void>
    ) {
        return QueryUtil.newInstance()
            .from<Extract<this, TableWithPrimaryKey>>(
                this as (
                    Extract<this, TableWithPrimaryKey> &
                    QueryUtil.AssertValidCurrentJoin<QueryUtil.NewInstance, Extract<this, TableWithPrimaryKey>>
                )
            )
            .where(() => (
                ExprLib.eqPrimaryKey(this, primaryKey) as any
            ))
            .assertExists(connection);
    }
    async assertExistsBySuperKey (
        connection : SelectConnection,
        superKey : SuperKey_Input<this>
    ) : (
        Promise<void>
    ) {
        return QueryUtil.newInstance()
            .from<this>(
                this as (
                    this &
                    QueryUtil.AssertValidCurrentJoin<QueryUtil.NewInstance, this>
                )
            )
            .where(() => (
                ExprLib.eqSuperKey(this, superKey) as any
            ))
            .assertExists(connection);
    }

    async existsByCandidateKey (
        connection : SelectConnection,
        candidateKey : StrictUnion<CandidateKey_NonUnion<this>>
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
            .where(() => (
                ExprLib.eqCandidateKey(this, candidateKey) as any
            ))
            .exists(connection);
    }
    async existsByPrimaryKey (
        this : Extract<this, TableWithPrimaryKey>,
        connection : SelectConnection,
        primaryKey : PrimaryKey_Input<Extract<this, TableWithPrimaryKey>>
    ) : (
        Promise<boolean>
    ) {
        return QueryUtil.newInstance()
            .from<Extract<this, TableWithPrimaryKey>>(
                this as (
                    Extract<this, TableWithPrimaryKey> &
                    QueryUtil.AssertValidCurrentJoin<QueryUtil.NewInstance, Extract<this, TableWithPrimaryKey>>
                )
            )
            .where(() => (
                ExprLib.eqPrimaryKey(this, primaryKey) as any
            ))
            .exists(connection);
    }
    async existsBySuperKey (
        connection : SelectConnection,
        superKey : SuperKey_Input<this>
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
            .where(() => (
                ExprLib.eqSuperKey(this, superKey) as any
            ))
            .exists(connection);
    }

    /*
    fetchOneByCk (
        connection : IConnection,
        ck : CandidateKey<this>
    ) : Promise<Row<this>>;
    fetchOneByCk<
        DelegateT extends QueryUtil.SelectDelegate<
            QueryUtil.From<QueryUtil.NewInstance, this>
        >
    > (
        connection : IConnection,
        ck : CandidateKey<this>,
        delegate : QueryUtil.AssertValidSelectDelegate<
            QueryUtil.From<QueryUtil.NewInstance, this>,
            DelegateT
        >
    ) : Promise<QueryUtil.UnmappedTypeNoJoins<ReturnType<DelegateT>>>;
    fetchOneByCk (
        connection : IConnection,
        ck : CandidateKey<this>,
        delegate? : (...args : any[]) => any[]
    ) {
        if (delegate == undefined) {
            return QueryUtil.fetchOneByCk(connection, this, ck);
        } else {
            return QueryUtil.fetchOneByCk(connection, this, ck, delegate as any);
        }
    }
    fetchOneByPk (
        this : Extract<this, TableWithPk>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, TableWithPk>>
    ) : (
        Promise<Row<this>>
    );
    fetchOneByPk<
        DelegateT extends QueryUtil.SelectDelegate<
            QueryUtil.From<QueryUtil.NewInstance, Extract<this, TableWithPk>>
        >
    > (
        this : Extract<this, TableWithPk>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, TableWithPk>>,
        delegate : QueryUtil.AssertValidSelectDelegate<
            QueryUtil.From<QueryUtil.NewInstance, Extract<this, TableWithPk>>,
            DelegateT
        >
    ) : Promise<QueryUtil.UnmappedTypeNoJoins<ReturnType<DelegateT>>>;
    fetchOneByPk (
        this : Extract<this, TableWithPk>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, TableWithPk>>,
        delegate? : (...args : any[]) => any
    ) {
        if (delegate == undefined) {
            return QueryUtil.fetchOneByPk(connection, this, pk);
        } else {
            return QueryUtil.fetchOneByPk(connection, this, pk, delegate as any);
        }
    }
    fetchOneBySk (
        connection : IConnection,
        sk : SuperKey<this>
    ) : Promise<Row<this>>;
    fetchOneBySk<
        DelegateT extends QueryUtil.SelectDelegate<
            QueryUtil.From<QueryUtil.NewInstance, this>
        >
    > (
        connection : IConnection,
        sk : SuperKey<this>,
        delegate : QueryUtil.AssertValidSelectDelegate<
            QueryUtil.From<QueryUtil.NewInstance, this>,
            DelegateT
        >
    ) : Promise<QueryUtil.UnmappedTypeNoJoins<ReturnType<DelegateT>>>;
    fetchOneBySk (
        connection : IConnection,
        sk : SuperKey<this>,
        delegate? : (...args : any[]) => any[]
    ) {
        if (delegate == undefined) {
            return QueryUtil.fetchOneBySk(connection, this, sk);
        } else {
            return QueryUtil.fetchOneBySk(connection, this, sk, delegate as any);
        }
    }

    fetchValueByCk<
        DelegateT extends QueryUtil.SelectValueDelegate<this>
    > (
        connection : IConnection,
        ck : CandidateKey<this>,
        delegate : QueryUtil.AssertValidSelectValueDelegate<this, DelegateT>
    ) : (
        Promise<
            RawExprUtil.TypeOf<ReturnType<DelegateT>>
        >
    ) {
        return QueryUtil.fetchValueByCk<this, DelegateT>(
            connection,
            this,
            ck,
            delegate
        );
    }
    fetchValueByPk<
        DelegateT extends QueryUtil.SelectValueDelegate<Extract<this, TableWithPk>>
    > (
        this : Extract<this, TableWithPk>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, TableWithPk>>,
        delegate : QueryUtil.AssertValidSelectValueDelegate<Extract<this, TableWithPk>, DelegateT>
    ) : (
        Promise<
            RawExprUtil.TypeOf<ReturnType<DelegateT>>
        >
    ) {
        return QueryUtil.fetchValueByPk<Extract<this, TableWithPk>, DelegateT>(
            connection,
            this,
            pk,
            delegate
        );
    }
    fetchValueBySk<
        DelegateT extends QueryUtil.SelectValueDelegate<this>
    > (
        connection : IConnection,
        sk : SuperKey<this>,
        delegate : QueryUtil.AssertValidSelectValueDelegate<this, DelegateT>
    ) : (
        Promise<
            RawExprUtil.TypeOf<ReturnType<DelegateT>>
        >
    ) {
        return QueryUtil.fetchValueBySk<this, DelegateT>(
            connection,
            this,
            sk,
            delegate
        );
    }

    fetchValueOrUndefinedByCk<
        DelegateT extends QueryUtil.SelectValueDelegate<this>
    > (
        connection : IConnection,
        ck : CandidateKey<this>,
        delegate : QueryUtil.AssertValidSelectValueDelegate<this, DelegateT>
    ) : (
        Promise<
            RawExprUtil.TypeOf<ReturnType<DelegateT>>|undefined
        >
    ) {
        return QueryUtil.fetchValueOrUndefinedByCk<this, DelegateT>(
            connection,
            this,
            ck,
            delegate
        );
    }
    fetchValueOrUndefinedByPk<
        DelegateT extends QueryUtil.SelectValueDelegate<Extract<this, TableWithPk>>
    > (
        this : Extract<this, TableWithPk>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, TableWithPk>>,
        delegate : QueryUtil.AssertValidSelectValueDelegate<Extract<this, TableWithPk>, DelegateT>
    ) : (
        Promise<
            RawExprUtil.TypeOf<ReturnType<DelegateT>>|undefined
        >
    ) {
        return QueryUtil.fetchValueOrUndefinedByPk<Extract<this, TableWithPk>, DelegateT>(
            connection,
            this,
            pk,
            delegate
        );
    }
    fetchValueOrUndefinedBySk<
        DelegateT extends QueryUtil.SelectValueDelegate<this>
    > (
        connection : IConnection,
        sk : SuperKey<this>,
        delegate : QueryUtil.AssertValidSelectValueDelegate<this, DelegateT>
    ) : (
        Promise<
            RawExprUtil.TypeOf<ReturnType<DelegateT>>|undefined
        >
    ) {
        return QueryUtil.fetchValueOrUndefinedBySk<this, DelegateT>(
            connection,
            this,
            sk,
            delegate
        );
    }

    fetchZeroOrOneByCk (
        connection : IConnection,
        ck : CandidateKey<this>
    ) : Promise<Row<this>|undefined>;
    fetchZeroOrOneByCk<
        DelegateT extends QueryUtil.SelectDelegate<
            QueryUtil.From<QueryUtil.NewInstance, this>
        >
    > (
        connection : IConnection,
        ck : CandidateKey<this>,
        delegate : QueryUtil.AssertValidSelectDelegate<
            QueryUtil.From<QueryUtil.NewInstance, this>,
            DelegateT
        >
    ) : Promise<QueryUtil.UnmappedTypeNoJoins<ReturnType<DelegateT>>|undefined>;
    fetchZeroOrOneByCk (
        connection : IConnection,
        ck : CandidateKey<this>,
        delegate? : (...args : any[]) => any[]
    ) {
        if (delegate == undefined) {
            return QueryUtil.fetchZeroOrOneByCk(connection, this, ck);
        } else {
            return QueryUtil.fetchZeroOrOneByCk(connection, this, ck, delegate as any);
        }
    }
    fetchZeroOrOneByPk (
        this : Extract<this, TableWithPk>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, TableWithPk>>
    ) : (
        Promise<Row<this>|undefined>
    );
    fetchZeroOrOneByPk<
        DelegateT extends QueryUtil.SelectDelegate<
            QueryUtil.From<QueryUtil.NewInstance, Extract<this, TableWithPk>>
        >
    > (
        this : Extract<this, TableWithPk>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, TableWithPk>>,
        delegate : QueryUtil.AssertValidSelectDelegate<
            QueryUtil.From<QueryUtil.NewInstance, Extract<this, TableWithPk>>,
            DelegateT
        >
    ) : Promise<QueryUtil.UnmappedTypeNoJoins<ReturnType<DelegateT>>|undefined>;
    fetchZeroOrOneByPk (
        this : Extract<this, TableWithPk>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, TableWithPk>>,
        delegate? : (...args : any[]) => any
    ) {
        if (delegate == undefined) {
            return QueryUtil.fetchZeroOrOneByPk(connection, this, pk);
        } else {
            return QueryUtil.fetchZeroOrOneByPk(connection, this, pk, delegate as any);
        }
    }
    fetchZeroOrOneBySk (
        connection : IConnection,
        sk : SuperKey<this>
    ) : Promise<Row<this>|undefined>;
    fetchZeroOrOneBySk<
        DelegateT extends QueryUtil.SelectDelegate<
            QueryUtil.From<QueryUtil.NewInstance, this>
        >
    > (
        connection : IConnection,
        sk : SuperKey<this>,
        delegate : QueryUtil.AssertValidSelectDelegate<
            QueryUtil.From<QueryUtil.NewInstance, this>,
            DelegateT
        >
    ) : Promise<QueryUtil.UnmappedTypeNoJoins<ReturnType<DelegateT>>|undefined>;
    fetchZeroOrOneBySk (
        connection : IConnection,
        sk : SuperKey<this>,
        delegate? : (...args : any[]) => any[]
    ) {
        if (delegate == undefined) {
            return QueryUtil.fetchZeroOrOneBySk(connection, this, sk);
        } else {
            return QueryUtil.fetchZeroOrOneBySk(connection, this, sk, delegate as any);
        }
    }

    insertAndFetch<
        RowT extends InsertRow<Extract<this, InsertableTable>>
    > (
        this : Extract<this, InsertableTable> & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        insertRow : RowT
    ) : Promise<InsertUtil.InsertAndFetchResult<Extract<this, InsertableTable>, RowT>> {
        return InsertUtil.insertAndFetch<Extract<this, InsertableTable>, RowT>(
            connection,
            this,
            insertRow
        );
    }
    insertIgnore (
        this : Extract<this, InsertableTable>,
        connection : IConnection,
        insertRow : InsertRow<Extract<this, InsertableTable>>
    ) : (
        Promise<InsertUtil.InsertIgnoreResult<Extract<this, InsertableTable>>>
    ) {
        return InsertUtil.insertIgnore(connection, this, insertRow);
    }
    insert (
        this : Extract<this, InsertableTable>,
        connection : IConnection,
        insertRow : InsertRow<Extract<this, InsertableTable>>
    ) : (
        Promise<InsertUtil.InsertResult<Extract<this, InsertableTable>>>
    ) {
        return InsertUtil.insert(connection, this, insertRow);
    }
    replace (
        this : Extract<this, InsertableTable>,
        connection : IConnection,
        insertRow : InsertRow<Extract<this, InsertableTable>>
    ) : (
        Promise<InsertUtil.ReplaceResult<Extract<this, InsertableTable>>>
    ) {
        return InsertUtil.replace(connection, this, insertRow);
    }

    updateAndFetchOneByCk<
        DelegateT extends UpdateUtil.SingleTableSetDelegateFromTable<this>
    > (
        this : this & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        ck : CandidateKey<this>,
        delegate : DelegateT
    ) : (
        UpdateUtil.AssertValidSingleTableSetDelegateFromTable_Hack<
            this,
            DelegateT,
            Promise<UpdateUtil.UpdateAndFetchOneResult<
                this,
                DelegateT
            >>
        >
    ) {
        return UpdateUtil.updateAndFetchOneByCk<this, DelegateT>(
            connection,
            this,
            ck,
            delegate
        );
    }
    updateAndFetchOneByPk<
        DelegateT extends UpdateUtil.SingleTableSetDelegateFromTable<Extract<this, TableWithPk>>
    > (
        this : Extract<this, TableWithPk> & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, TableWithPk>>,
        delegate : DelegateT
    ) : (
        UpdateUtil.AssertValidSingleTableSetDelegateFromTable_Hack<
            Extract<this, TableWithPk>,
            DelegateT,
            Promise<UpdateUtil.UpdateAndFetchOneResult<
                Extract<this, TableWithPk>,
                DelegateT
            >>
        >
    ) {
        return UpdateUtil.updateAndFetchOneByPk<Extract<this, TableWithPk>, DelegateT>(
            connection,
            this,
            pk,
            delegate
        );
    }
    updateAndFetchOneBySk<
        DelegateT extends UpdateUtil.SingleTableSetDelegateFromTable<this>
    > (
        this : this & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        sk : SuperKey<this>,
        delegate : DelegateT
    ) : (
        UpdateUtil.AssertValidSingleTableSetDelegateFromTable_Hack<
            this,
            DelegateT,
            Promise<UpdateUtil.UpdateAndFetchOneResult<
                this,
                DelegateT
            >>
        >
    ) {
        return UpdateUtil.updateAndFetchOneBySk<this, DelegateT>(
            connection,
            this,
            sk,
            delegate
        );
    }

    updateAndFetchZeroOrOneByCk<
        DelegateT extends UpdateUtil.SingleTableSetDelegateFromTable<this>
    > (
        this : this & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        ck : CandidateKey<this>,
        delegate : DelegateT
    ) : (
        UpdateUtil.AssertValidSingleTableSetDelegateFromTable_Hack<
            this,
            DelegateT,
            Promise<UpdateUtil.UpdateAndFetchZeroOrOneResult<
                this,
                DelegateT
            >>
        >
    ) {
        return UpdateUtil.updateAndFetchZeroOrOneByCk<this, DelegateT>(
            connection,
            this,
            ck,
            delegate
        );
    }
    updateAndFetchZeroOrOneByPk<
        DelegateT extends UpdateUtil.SingleTableSetDelegateFromTable<Extract<this, TableWithPk>>
    > (
        this : Extract<this, TableWithPk> & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, TableWithPk>>,
        delegate : DelegateT
    ) : (
        UpdateUtil.AssertValidSingleTableSetDelegateFromTable_Hack<
            Extract<this, TableWithPk>,
            DelegateT,
            Promise<UpdateUtil.UpdateAndFetchZeroOrOneResult<
                Extract<this, TableWithPk>,
                DelegateT
            >>
        >
    ) {
        return UpdateUtil.updateAndFetchZeroOrOneByPk<Extract<this, TableWithPk>, DelegateT>(
            connection,
            this,
            pk,
            delegate
        );
    }
    updateAndFetchZeroOrOneBySk<
        DelegateT extends UpdateUtil.SingleTableSetDelegateFromTable<this>
    > (
        this : this & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        sk : SuperKey<this>,
        delegate : DelegateT
    ) : (
        UpdateUtil.AssertValidSingleTableSetDelegateFromTable_Hack<
            this,
            DelegateT,
            Promise<UpdateUtil.UpdateAndFetchZeroOrOneResult<
                this,
                DelegateT
            >>
        >
    ) {
        return UpdateUtil.updateAndFetchZeroOrOneBySk<this, DelegateT>(
            connection,
            this,
            sk,
            delegate
        );
    }

    updateOneByCk<
        DelegateT extends UpdateUtil.SingleTableSetDelegateFromTable<this>
    > (
        this : this & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        ck : CandidateKey<this>,
        delegate : DelegateT
    ) : (
        UpdateUtil.AssertValidSingleTableSetDelegateFromTable_Hack<
            this,
            DelegateT,
            Promise<UpdateOneResult>
        >
    ) {
        return UpdateUtil.updateOneByCk<this, DelegateT>(
            connection,
            this,
            ck,
            delegate
        );
    }
    updateOneByPk<
        DelegateT extends UpdateUtil.SingleTableSetDelegateFromTable<Extract<this, TableWithPk>>
    > (
        this : Extract<this, TableWithPk> & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, TableWithPk>>,
        delegate : DelegateT
    ) : (
        UpdateUtil.AssertValidSingleTableSetDelegateFromTable_Hack<
            Extract<this, TableWithPk>,
            DelegateT,
            Promise<UpdateOneResult>
        >
    ) {
        return UpdateUtil.updateOneByPk<Extract<this, TableWithPk>, DelegateT>(
            connection,
            this,
            pk,
            delegate
        );
    }
    updateOneBySk<
        DelegateT extends UpdateUtil.SingleTableSetDelegateFromTable<this>
    > (
        this : this & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        sk : SuperKey<this>,
        delegate : DelegateT
    ) : (
        UpdateUtil.AssertValidSingleTableSetDelegateFromTable_Hack<
            this,
            DelegateT,
            Promise<UpdateOneResult>
        >
    ) {
        return UpdateUtil.updateOneBySk<this, DelegateT>(
            connection,
            this,
            sk,
            delegate
        );
    }

    updateZeroOrOneByCk<
        DelegateT extends UpdateUtil.SingleTableSetDelegateFromTable<this>
    > (
        this : this & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        ck : CandidateKey<this>,
        delegate : DelegateT
    ) : (
        UpdateUtil.AssertValidSingleTableSetDelegateFromTable_Hack<
            this,
            DelegateT,
            Promise<UpdateZeroOrOneResult>
        >
    ) {
        return UpdateUtil.updateZeroOrOneByCk<this, DelegateT>(
            connection,
            this,
            ck,
            delegate
        );
    }
    updateZeroOrOneByPk<
        DelegateT extends UpdateUtil.SingleTableSetDelegateFromTable<Extract<this, TableWithPk>>
    > (
        this : Extract<this, TableWithPk> & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, TableWithPk>>,
        delegate : DelegateT
    ) : (
        UpdateUtil.AssertValidSingleTableSetDelegateFromTable_Hack<
            Extract<this, TableWithPk>,
            DelegateT,
            Promise<UpdateZeroOrOneResult>
        >
    ) {
        return UpdateUtil.updateZeroOrOneByPk<Extract<this, TableWithPk>, DelegateT>(
            connection,
            this,
            pk,
            delegate
        );
    }
    updateZeroOrOneBySk<
        DelegateT extends UpdateUtil.SingleTableSetDelegateFromTable<this>
    > (
        this : this & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        sk : SuperKey<this>,
        delegate : DelegateT
    ) : (
        UpdateUtil.AssertValidSingleTableSetDelegateFromTable_Hack<
            this,
            DelegateT,
            Promise<UpdateZeroOrOneResult>
        >
    ) {
        return UpdateUtil.updateZeroOrOneBySk<this, DelegateT>(
            connection,
            this,
            sk,
            delegate
        );
    }

    deleteOneByCk (
        this : Extract<this, DeletableTable> & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        ck : CandidateKey<Extract<this, DeletableTable>>
    ) : (
        Promise<DeleteOneResult>
    ) {
        return DeleteUtil.deleteOneByCk(connection, this, ck);
    }
    deleteOneByPk (
        this : Extract<this, DeletableTable & TableWithPk>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, DeletableTable & TableWithPk>>
    ) : (
        Promise<DeleteOneResult>
    ) {
        return DeleteUtil.deleteOneByPk(connection, this, pk);
    }
    deleteOneBySk (
        this : Extract<this, DeletableTable> & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        sk : SuperKey<Extract<this, DeletableTable>>
    ) : (
        Promise<DeleteOneResult>
    ) {
        return DeleteUtil.deleteOneBySk(connection, this, sk);
    }

    deleteZeroOrOneByCk (
        this : Extract<this, DeletableTable> & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        ck : CandidateKey<Extract<this, DeletableTable>>
    ) : (
        Promise<DeleteZeroOrOneResult>
    ) {
        return DeleteUtil.deleteZeroOrOneByCk(connection, this, ck);
    }
    deleteZeroOrOneByPk (
        this : Extract<this, DeletableTable & TableWithPk>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, DeletableTable & TableWithPk>>
    ) : (
        Promise<DeleteZeroOrOneResult>
    ) {
        return DeleteUtil.deleteZeroOrOneByPk(connection, this, pk);
    }
    deleteZeroOrOneBySk (
        this : Extract<this, DeletableTable> & TableUtil.AssertHasCandidateKey<this>,
        connection : IConnection,
        sk : SuperKey<Extract<this, DeletableTable>>
    ) : (
        Promise<DeleteZeroOrOneResult>
    ) {
        return DeleteUtil.deleteZeroOrOneBySk(connection, this, sk);
    }*/
}
