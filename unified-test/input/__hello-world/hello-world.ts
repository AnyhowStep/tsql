import {Test} from "../../test";

export const test : Test = ({tape}) => {
    tape(__filename, t => {
        t.pass("Hello, world");
        t.end();
    });
};
