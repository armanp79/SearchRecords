const db = require('../connection.js');

const retrieveRecords = (pattern, lastSeenID, dir, callback) => {
    // Using KeySet Pagination. Ordering records by personid and using the last known personid as a key to index next set of
    // records. If we move forward, we want to use the largest seen id and find the next 30 larger than that.
    // If we move backwards, we want to use the smallest seen if, sort in a descending order, find the next 30 that are smaller
    // and then reorder by ascending so records are not displayed in reverse.

    lastSeenID = parseInt(lastSeenID)
    if (dir === "1"){
        // Moving forward
        query = `
        WITH DATA_CTE AS (
        SELECT person.*, address.addressid, address.address_street, address.address_city,address.address_state,address.address_zip
        FROM person 
        JOIN address ON person.personid=address.personid 
        WHERE person.first_name || ' ' || person.last_name || ' ' || address.address_street || ' ' || address.address_city || ' ' || address.address_state || ' ' || address.address_zip
        LIKE '%${pattern}%'
        ORDER BY person.personid ASC
        ),
        COUNT_CTE AS (
            SELECT COUNT(*) AS TotalRows FROM DATA_CTE
        )
        SELECT *
        FROM DATA_CTE
        CROSS JOIN COUNT_CTE
        WHERE DATA_CTE.personid > ${lastSeenID}
        ORDER BY DATA_CTE.personid ASC
        LIMIT 30`;
    } else if (dir === "-1") {
        // Moving backward
        query = `
        WITH DATA_CTE AS (
        SELECT person.*, address.addressid, address.address_street, address.address_city,address.address_state,address.address_zip
        FROM person 
        JOIN address ON person.personid=address.personid 
        WHERE person.first_name || ' ' || person.last_name || ' ' || address.address_street || ' ' || address.address_city || ' ' || address.address_state || ' ' || address.address_zip
        LIKE '%${pattern}%'
        ORDER BY person.personid DESC
        ),
        COUNT_CTE AS (
            SELECT COUNT(*) AS TotalRows FROM DATA_CTE
        ),
        REVERSED AS (
            SELECT *
            FROM DATA_CTE
            CROSS JOIN COUNT_CTE
            WHERE DATA_CTE.personid < ${lastSeenID}
            LIMIT 30
        )
        SELECT * FROM REVERSED
        ORDER BY REVERSED.personid ASC
        `;
    } else {
        //Inital Load
        query = `
        WITH DATA_CTE AS (
        SELECT person.*, address.addressid, address.address_street, address.address_city,address.address_state,address.address_zip
        FROM person 
        JOIN address ON person.personid=address.personid 
        WHERE person.first_name || ' ' || person.last_name || ' ' || address.address_street || ' ' || address.address_city || ' ' || address.address_state || ' ' || address.address_zip
        LIKE '%${pattern}%'
        ORDER BY person.personid ASC
        ),
        COUNT_CTE AS (
            SELECT COUNT(*) AS TotalRows FROM DATA_CTE
        )
        SELECT *
        FROM DATA_CTE
        CROSS JOIN COUNT_CTE
        LIMIT 30`;
    }

    
    db.query(query,  (error, res) =>{
        if (error) {
            console.error('Error retrieving data', error);
            callback(error);
        }
        
        if (res.rows.length) { // if row exists
            callback(null, res.rows)
        } else { // return empty array
            callback(null, [])
        }
    });
}

module.exports = retrieveRecords;





// Pagination Simple
// const query = `
// WITH DATA_CTE AS (
// SELECT *
// FROM person 
// JOIN address ON person.personid=address.personid 
// WHERE person.first_name || ' ' || person.last_name || ' ' || address.address_street || ' ' || address.address_city || ' ' || address.address_state || ' ' || address.address_zip
// LIKE '%${pattern}%'
// ),
// COUNT_CTE AS (
//     SELECT COUNT(*) AS TotalRows FROM DATA_CTE
// )
// SELECT *
// FROM DATA_CTE
// CROSS JOIN COUNT_CTE
// LIMIT 30
// OFFSET ${(page - 1) * 30}`;


// Since using "like" can be inefficient, alternate solution is to use tsvector
// WHERE to_tsvector(person.first_name || ' ' || person.last_name || ' ' || address.address_street || ' ' || address.address_city || ' ' || address.address_state || ' ' || address.address_zip) @@ to_tsquery('${pattern}')

