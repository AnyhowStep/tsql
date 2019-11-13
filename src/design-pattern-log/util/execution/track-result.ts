import {LatestOrDefault} from "./fetch-latest-or-default";

export type TrackResult<LatestRowT, DefaultRowT> =
    | {
        changed : true,
        previous : LatestOrDefault<LatestRowT, DefaultRowT>,
        current : LatestRowT,
    }
    | {
        changed : false,
        previous : LatestOrDefault<LatestRowT, DefaultRowT>,
    }
;
