import * as tm from "type-mapping";
import {TableData, ITable} from "./table";
import * as TableUtil from "./util";
import {MapperMap} from "../mapper-map";
import {Ast} from "../ast";
import {ColumnUtil} from "../column";
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

export class Table<DataT extends TableData> implements ITable<DataT> {
    readonly lateral : DataT["lateral"];
    readonly tableAlias : DataT["tableAlias"];
    readonly columns : DataT["columns"];
    readonly usedRef : DataT["usedRef"];

    readonly unaliasedAst : Ast;

    readonly insertAllowed : DataT["insertAllowed"];
    readonly deleteAllowed : DataT["deleteAllowed"];

    readonly autoIncrement : DataT["autoIncrement"];
    readonly id : DataT["id"];
    readonly primaryKey : DataT["primaryKey"];
    readonly candidateKeys : DataT["candidateKeys"];

    readonly generatedColumns : DataT["generatedColumns"];
    readonly nullableColumns : DataT["nullableColumns"];
    readonly explicitDefaultValueColumns : DataT["explicitDefaultValueColumns"];
    readonly mutableColumns : DataT["mutableColumns"];

    readonly parents : DataT["parents"];

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
        this.lateral = data.lateral;
        this.tableAlias = data.tableAlias;
        this.columns = data.columns;
        this.usedRef = data.usedRef;

        this.unaliasedAst = unaliasedAst;

        this.insertAllowed = data.insertAllowed;
        this.deleteAllowed = data.deleteAllowed;

        this.autoIncrement = data.autoIncrement;
        this.id = data.id;
        this.primaryKey = data.primaryKey;
        this.candidateKeys = data.candidateKeys;

        this.generatedColumns = data.generatedColumns;
        this.nullableColumns = data.nullableColumns;
        this.explicitDefaultValueColumns = data.explicitDefaultValueColumns;
        this.mutableColumns = data.mutableColumns;

        this.parents = data.parents;
    }

    /**
     *
     * ```sql
     *  SELECT
     *      *
     *  FROM
     *      myTable AS newTableAlias
     * ```
     */
    readonly as = <NewTableAliasT extends string> (newTableAlias : NewTableAliasT) : TableUtil.As<Table<DataT>, NewTableAliasT> => {
        return TableUtil.as(this, newTableAlias);
    };

    /**
     * Change the table's `tableAlias` entirely without an `AS` clause
     *
     * @param newTableAlias
     */
    readonly setTableAlias = <NewTableAliasT extends string>(
        newTableAlias : NewTableAliasT
    ) : TableUtil.SetTableAlias<Table<DataT>, NewTableAliasT> => {
        return TableUtil.setTableAlias(this, newTableAlias);
    };

    /**
     * Adds columns to the table
     */
    readonly addColumns : (
        & (
            <FieldsT extends tm.AnyField[]> (
                fields : FieldsT
            ) => (
                TableUtil.AddColumnsFromFieldArray<this, FieldsT>
            )
        )
        & (
            <MapperMapT extends MapperMap> (
                mapperMap : MapperMapT
            ) => (
                TableUtil.AddColumnsFromMapperMap<this, MapperMapT>
            )
        )
    ) = (rawColumns : any) : any => {
        return TableUtil.addColumns(this, rawColumns);
    };

    readonly addCandidateKey = <
        KeyT extends readonly ColumnUtil.FromColumnMap<this["columns"]>[]
    > (
        delegate : (
            TableUtil.CandidateKeyDelegate<
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
        TableUtil.AddCandidateKey<Table<DataT>, KeyT>
    ) => {
        return TableUtil.addCandidateKey<this, KeyT>(this, delegate);
    };

    readonly setPrimaryKey = <
        KeyT extends readonly ColumnUtil.FromColumnMap<TableUtil.AllowedPrimaryKeyColumnMap<Table<DataT>>>[]
    > (
        delegate : (
            TableUtil.PrimaryKeyDelegate<
                Table<DataT>,
                (
                    & KeyT
                    & TableUtil.AssertValidPrimaryKey<
                        Table<DataT>,
                        KeyT
                    >
                )
            >
        )
    ) : (
        TableUtil.SetPrimaryKey<Table<DataT>, KeyT>
    ) => {
        return TableUtil.setPrimaryKey<Table<DataT>, KeyT>(this, delegate);
    };

    readonly setId = <
        IdT extends ColumnUtil.FromColumnMap<TableUtil.AllowedIdColumnMap<Table<DataT>>>
    > (
        delegate : (
            TableUtil.IdDelegate<
                Table<DataT>,
                (
                    & IdT
                    & TableUtil.AssertValidId<
                        Table<DataT>,
                        IdT
                    >
                )
            >
        )
    ) : (
        TableUtil.SetId<Table<DataT>, IdT>
    ) => {
        return TableUtil.setId<
            Table<DataT>,
            IdT
        >(this, delegate);
    };
    /**
     * Designates one column as the `AUTO_INCREMENT` column
     *
     * @param delegate - A function that returns the `AUTO_INCREMENT` column
     */
    readonly setAutoIncrement = <
        AutoIncrementT extends ColumnUtil.FromColumnMap<TableUtil.AllowedAutoIncrementColumnMap<Table<DataT>>>
    > (
        delegate : (
            TableUtil.AutoIncrementDelegate<
                Table<DataT>,
                (
                    & AutoIncrementT
                    & TableUtil.AssertValidAutoIncrement<
                        Table<DataT>,
                        AutoIncrementT
                    >
                )
            >
        )
    ) : (
        TableUtil.SetAutoIncrement<Table<DataT>, AutoIncrementT>
    ) => {
        return TableUtil.setAutoIncrement<
            Table<DataT>,
            AutoIncrementT
        >(this, delegate);
    };

    readonly setDatabaseName = (
        newDatabaseName : string
    ) : (
        TableUtil.SetDatabaseName<Table<DataT>>
    ) => {
        return TableUtil.setDatabaseName(this, newDatabaseName);
    };

    readonly addGenerated = <
        ColumnsT extends readonly ColumnUtil.FromColumnMap<TableUtil.AllowedGeneratedColumnMap<Table<DataT>>>[]
    > (
        delegate : (
            TableUtil.GeneratedDelegate<
                Table<DataT>,
                ColumnsT
            >
        )
    ) : (
        TableUtil.AddGenerated<Table<DataT>, ColumnsT>
    ) => {
        return TableUtil.addGenerated<Table<DataT>, ColumnsT>(this, delegate);
    };
    readonly addExplicitDefaultValue = <
        ColumnsT extends readonly ColumnUtil.FromColumnMap<TableUtil.AllowedExplicitDefaultValueColumnMap<Table<DataT>>>[]
    > (
        delegate : (
            TableUtil.ExplicitDefaultValueDelegate<
                Table<DataT>,
                ColumnsT
            >
        )
    ) : (
        TableUtil.AddExplicitDefaultValue<Table<DataT>, ColumnsT>
    ) => {
        return TableUtil.addExplicitDefaultValue<Table<DataT>, ColumnsT>(this, delegate);
    };
    /*
    setImmutable () : TableUtil.SetImmutable<this> {
        return TableUtil.setImmutable(this);
    }
    setMutable<
        DelegateT extends TableUtil.MutableDelegate<this>
    > (
        delegate : DelegateT
    ) : (
        TableUtil.SetMutable<this, DelegateT>
    ) {
        return TableUtil.setMutable(this, delegate);
    }
    addParent<
        ParentT extends ITable
    > (
        parent : TableUtil.Parent<this, ParentT>
    ) : (
        TableUtil.AddParent<this, ParentT>
    ) {
        return TableUtil.addParent<this, ParentT>(this, parent);
    }
    disallowInsert () : TableUtil.DisallowInsert<this> {
        return TableUtil.disallowInsert(this);
    }
    disallowDelete () : TableUtil.DisallowDelete<this> {
        return TableUtil.disallowDelete(this);
    }

    /*
    validate (connection : IConnection, result : TableUtil.ValidateTableResult) {
        return TableUtil.validate(this, connection, result);
    }

    assertExistsByCk (
        connection : IConnection,
        ck : CandidateKey<this>
    ) : (
        Promise<void>
    ) {
        return QueryUtil.assertExistsByCk(connection, this, ck);
    }
    assertExistsByPk (
        this : Extract<this, TableWithPk>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, TableWithPk>>
    ) : (
        Promise<void>
    ) {
        return QueryUtil.assertExistsByPk(connection, this, pk);
    }
    assertExistsBySk (
        connection : IConnection,
        sk : SuperKey<this>
    ) : (
        Promise<void>
    ) {
        return QueryUtil.assertExistsBySk(connection, this, sk);
    }

    existsByCk (
        connection : IConnection,
        ck : CandidateKey<this>
    ) : (
        Promise<boolean>
    ) {
        return QueryUtil.existsByCk(connection, this, ck);
    }
    existsByPk (
        this : Extract<this, TableWithPk>,
        connection : IConnection,
        pk : PrimaryKey<Extract<this, TableWithPk>>
    ) : (
        Promise<boolean>
    ) {
        return QueryUtil.existsByPk(connection, this, pk);
    }
    existsBySk (
        connection : IConnection,
        sk : SuperKey<this>
    ) : (
        Promise<boolean>
    ) {
        return QueryUtil.existsBySk(connection, this, sk);
    }

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
