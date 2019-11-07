import {ILog} from "../../../log";
import {IsolableInsertOneConnection} from "../../../../execution";
import {PrimaryKey_Input} from "../../../../primary-key";
import {AssertAllTrackedHasDefaultValue, assertAllTrackedHasDefaultValue} from "./fetch-default";
import {UnsafeTrackRow, UnsafeTrack, unsafeTrack} from "./unsafe-track";

export async function track<LogT extends ILog> (
    log : LogT & AssertAllTrackedHasDefaultValue<LogT>,
    connection : IsolableInsertOneConnection,
    primaryKey : PrimaryKey_Input<LogT["ownerTable"]>,
    trackRow : UnsafeTrackRow<LogT>
) : (
    Promise<UnsafeTrack<LogT>>
) {
    assertAllTrackedHasDefaultValue(log);
    return unsafeTrack(log, connection, primaryKey, trackRow);
}
