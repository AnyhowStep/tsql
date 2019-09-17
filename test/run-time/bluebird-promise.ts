import * as bluebird from "bluebird";

bluebird.config({
    //warnings : true,
    longStackTraces : true,
});
global.Promise = bluebird;
