/*
@todo The following is valid

SELECT
	*
FROM
	myTable
WHERE
	(
    	SELECT
      		myTable2.myTable2Id
      	FROM
      		myTable2
      	JOIN
      		myTable3
      	ON
      		(
            	SELECT
              		myTable4.myTable4Id
              	FROM
              		myTable4
              	WHERE
              		myTable4.myTable4Id > myTable3.myTable3Id OR
              		myTable4.myTable4Id > myTable2.myTable2Id
              	LIMIT
              		1
            ) IS NULL
    ) IS NOT NULL
*/
