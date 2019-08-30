import {SortDirection} from "../../sort-direction";

export function isSortDirection (mixed : unknown) : mixed is SortDirection {
    return (
        mixed == SortDirection.ASC ||
        mixed == SortDirection.DESC
    );
}
