import {LogData, ILog} from "./log";
import {SelectConnection, IsolableSelectConnection, IsolableInsertOneConnection} from "../execution";
import {PrimaryKey_Input} from "../primary-key";
import * as LogUtil from "./util";
import {AnyRawExpr} from "../raw-expr";

export class Log<DataT extends LogData> implements ILog<DataT> {
    readonly tracked : DataT["tracked"];
    readonly doNotCopy : DataT["doNotCopy"];
    readonly copy : DataT["copy"];
    readonly trackedWithDefaultValue : DataT["trackedWithDefaultValue"];

    readonly logTable : DataT["logTable"];
    readonly ownerTable : DataT["ownerTable"];

    readonly latestOrder : ILog["latestOrder"];
    readonly copyDefaultsDelegate : ILog["copyDefaultsDelegate"];
    readonly trackedDefaults : ILog["trackedDefaults"];

    constructor (
        data : DataT,
        extraData : Pick<
            ILog,
            | "latestOrder"
            | "copyDefaultsDelegate"
            | "trackedDefaults"
        >
    ) {
        this.tracked = data.tracked;
        this.doNotCopy = data.doNotCopy;
        this.copy = data.copy;
        this.trackedWithDefaultValue = data.trackedWithDefaultValue;

        this.logTable = data.logTable;
        this.ownerTable = data.ownerTable;

        this.latestOrder = extraData.latestOrder;
        this.copyDefaultsDelegate = extraData.copyDefaultsDelegate;
        this.trackedDefaults = extraData.trackedDefaults;
    }

    fetchDefault (
        connection : IsolableSelectConnection,
        primaryKey : PrimaryKey_Input<this["ownerTable"]>
    ) : (
        Promise<LogUtil.DefaultRow<this>>
    ) {
        return LogUtil.fetchDefault<this>(
            this,
            connection,
            primaryKey
        );
    }

    fetchLatest (
        connection : SelectConnection,
        primaryKey : PrimaryKey_Input<this["ownerTable"]>
    ) : (
        LogUtil.FetchLatest<this>
    ) {
        return LogUtil.fetchLatest<this>(
            this,
            connection,
            primaryKey
        );
    }

    fetchLatestValue<RawExprT extends AnyRawExpr> (
        connection : SelectConnection,
        primaryKey : PrimaryKey_Input<this["ownerTable"]>,
        selectValueDelegate : LogUtil.FetchLatestValueSelectValueDelegate<
            this,
            RawExprT
        >
    ) : (
        LogUtil.FetchLatestValue<RawExprT>
    ) {
        return LogUtil.fetchLatestValue<this, RawExprT>(
            this,
            connection,
            primaryKey,
            selectValueDelegate
        );
    }

    /**
     * @todo Make this part of fluent API of `fetchLatest()`?
     */
    fetchLatestOrDefault (
        connection : IsolableSelectConnection,
        primaryKey : PrimaryKey_Input<this["ownerTable"]>
    ) : (
        Promise<LogUtil.FetchLatestOrDefault<this>>
    ) {
        return LogUtil.fetchLatestOrDefault<this>(
            this,
            connection,
            primaryKey
        );
    }

    fetchLatestValueOrDefault<ColumnT extends LogUtil.FetchLatestValueOrDefaultColumn<this>> (
        connection : IsolableSelectConnection,
        primaryKey : PrimaryKey_Input<this["ownerTable"]>,
        selectValueDelegate : LogUtil.FetchLatestValueOrDefaultSelectValueDelegate<
            this,
            ColumnT
        >
    ) : (
        Promise<ReturnType<ColumnT["mapper"]>>
    ) {
        return LogUtil.fetchLatestValueOrDefault<this, ColumnT>(
            this,
            connection,
            primaryKey,
            selectValueDelegate
        );
    }

    exists (
        connection : IsolableSelectConnection,
        primaryKey : PrimaryKey_Input<this["ownerTable"]>
    ) : (
        Promise<boolean>
    ) {
        return LogUtil.exists<this>(
            this,
            connection,
            primaryKey
        );
    }

    trackOrInsert (
        connection : IsolableInsertOneConnection,
        primaryKey : PrimaryKey_Input<this["ownerTable"]>,
        trackOrInsertRow : LogUtil.TrackOrInsertRow<this>
    ) : (
        Promise<LogUtil.Track<this>>
    ) {
        return LogUtil.trackOrInsert(
            this,
            connection,
            primaryKey,
            trackOrInsertRow
        );
    }

    unsafeTrack (
        connection : IsolableInsertOneConnection,
        primaryKey : PrimaryKey_Input<this["ownerTable"]>,
        unsafeTrackRow : LogUtil.TrackRow<this>
    ) : (
        Promise<LogUtil.Track<this>>
    ) {
        return LogUtil.unsafeTrack(
            this,
            connection,
            primaryKey,
            unsafeTrackRow
        );
    }

    track (
        this : this & LogUtil.AssertAllTrackedHasDefaultValue<this>,
        connection : IsolableInsertOneConnection,
        primaryKey : PrimaryKey_Input<this["ownerTable"]>,
        trackRow : LogUtil.TrackRow<this>
    ) : (
        Promise<LogUtil.Track<this>>
    ) {
        return LogUtil.track(
            this,
            connection,
            primaryKey,
            trackRow
        );
    }

    /**
     * A collection of correlated subqueries/expressions,
     * these require the `ownerTable` to be in the `FROM` clause.
     */
    readonly correlatedSubquery : {
        exists : () => LogUtil.CorrelatedSubquery.Exists<ILog<DataT>>,
        latest : () => LogUtil.CorrelatedSubquery.Latest<ILog<DataT>>,
        latestValue : <RawExprT extends AnyRawExpr>(
            selectValueDelegate : LogUtil.CorrelatedSubquery.LatestValueSelectValueDelegate<
                ILog<DataT>,
                RawExprT
            >
        ) => LogUtil.CorrelatedSubquery.LatestValue<ILog<DataT>, RawExprT>,
    } = {
        exists : () : LogUtil.CorrelatedSubquery.Exists<ILog<DataT>> => {
            return LogUtil.CorrelatedSubquery.exists(this);
        },
        latest : () : LogUtil.CorrelatedSubquery.Latest<ILog<DataT>> => {
            return LogUtil.CorrelatedSubquery.latest(this);
        },
        latestValue : <RawExprT extends AnyRawExpr>(
            selectValueDelegate : LogUtil.CorrelatedSubquery.LatestValueSelectValueDelegate<
                ILog<DataT>,
                RawExprT
            >
        ) : LogUtil.CorrelatedSubquery.LatestValue<ILog<DataT>, RawExprT> => {
            return LogUtil.CorrelatedSubquery.latestValue(this, selectValueDelegate);
        },
    };
}
