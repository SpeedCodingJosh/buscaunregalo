const { response } = require('express');

const reserveGift = (req, res = response) => {
    try {
        const { ownerID, giftID } = req.body;

        req.getConnection((err, conn) => {
            
            if(err) {
                console.log("Error on get conn");
                console.log(err);
                return res.json({code: 500, err});
            }

            const getReservation = `SELECT * FROM gifts WHERE id = ${giftID} AND visible = 1`;
            conn.query(getReservation, (error, rows) => {

                if(error) {
                    console.log(error);
                    return res.json({code: 500, error: error});
                }

                if(rows.length > 0 && rows[0].reserved === 0) {
                    const reserveQuery = `UPDATE gifts SET reserved = ${ownerID} WHERE id = ${rows[0].id}`;
                    conn.query(reserveQuery, (error, results) => {
                        
                        if(error) {
                            console.log(error);
                            return res.json({code: 500, error: error});
                        }

                        return res.json({code: 200});                
                    });
                }
                else if(rows.length > 0 && rows[0].reserved !== 0) {
                    return res.json({code: 202});                
                }
                else {
                    return res.json({code: 404});                
                }

            });
        });
    } 
    catch (error) {
        console.log(error);
        return res.json({code: 500, error});
    }
};

const unreserveGift = (req, res = response) => {
    try {
        const { giftID } = req.body;

        req.getConnection((err, conn) => {
            
            if(err) {
                console.log("Error on get conn");
                console.log(err);
                return res.json({code: 500, err});
            }

            const unreserveQuery = `UPDATE gifts SET reserved = 0 WHERE id = ${giftID} AND visible = 1`;
            conn.query(unreserveQuery, (error, results) => {
                
                if(error) {
                    console.log(error);
                    return res.json({code: 500, error: error});
                }

                return res.json({code: 200});                
            });
        });
    } 
    catch (error) {
        console.log(error);
        return res.json({code: 500, error});
    }
};

module.exports = {
    reserveGift,
    unreserveGift
};