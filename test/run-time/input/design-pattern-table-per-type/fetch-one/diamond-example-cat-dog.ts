import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {createAnimalTableSql, animal, cat, dog, catDog, catDogTpt} from "../diamond-example";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const fetchOneResult = await pool.acquire(async (connection) => {
        await connection.exec(createAnimalTableSql);

        const animalInsertResult = await animal.insertOne(
            connection,
            {
                appId : BigInt(1),
                name : "cat-dog",
                createdAt : new Date(0),
            }
        );
        await cat.insertOne(
            connection,
            {
                animalId : animalInsertResult.animalId,
                name : "cat-dog",
                purrFrequency : 3.141,
            }
        );
        await dog.insertOne(
            connection,
            {
                animalId : animalInsertResult.animalId,
                name : "cat-dog",
                barksPerMinute : BigInt(90),
            }
        );
        await catDog.insertOne(
            connection,
            {
                animalId : animalInsertResult.animalId,
                name : "cat-dog",
                barksPerMinute : BigInt(90),
                headsOnSameEndOfBody : false,
            }
        );


        return catDogTpt.fetchOne(
            connection,
            (columns) => tsql.eq(
                columns.catDog.animalId,
                BigInt(1)
            )
        );
    });

    t.deepEqual(
        fetchOneResult,
        {
            appId: BigInt(1),
            animalId: BigInt(1),
            name : "cat-dog",
            createdAt: new Date(0),
            extinctAt: null,
            purrFrequency : 3.141,
            barksPerMinute : BigInt(90),
            headsOnSameEndOfBody : false,
        }
    );

    t.end();
});
