//import {FullConnection} from "../full-connection";
import {IConnection} from "../connection";

export interface TryGetFullConnection {
    tryGetFullConnection () : IConnection|undefined;
}
