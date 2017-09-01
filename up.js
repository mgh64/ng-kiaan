use kiaan;
//add

// db.operations.update(
//     {
//         "_id" : ObjectId("586bb84abacea2370ca6edaf")
//     },{
//         $push : {
//             "items" : {
//                 id : 1,
//                 type : 'cheque',
//                 price : 1000000
//             }
//         }
//     }
// );

//update

db.operations.update(
    {
        "_id" : ObjectId("586bb84abacea2370ca6edaf"),
        items : {
            $elemMatch : {
                id : 2
            }
        }
    },{
        $set : {
            "items.$" : {
                id : 1,  
                type: "cheque",
                price : 100000
            }
        }
    }
);

//remove

// db.operations.update(
//     {
//         "_id" : ObjectId("586bb84abacea2370ca6edaf")
//     },{
//         $pull : {
//             "items" : {
//                 id : 1,
//                 type : 'cheque',
//                 price : 1000000
//             }
//         }
//     }
// );

db.operations.find({type: "first_period"}).pretty();