const db = require('../config/connection');
const collection = require('../config/collections');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { response } = require('express');

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                userData.password = await bcrypt.hash(userData.password, 10); // Ensure password field is used
                const data = await db.get().collection(collection.USER_COLLECTION).insertOne(userData);
                userData._id = data.insertedId;
                resolve(userData);
            } catch (err) {
                reject(err);
            }
        });
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email });
                if (user) {
                    console.log('User found:', user);
                    console.log('Comparing passwords:', userData.password, user.password); // Ensure password field is used
                    const match = await bcrypt.compare(userData.password, user.password);
                    if (match) {
                        console.log('Password match');
                        resolve({ status: true, user });
                    } else {
                        console.log('Password does not match');
                        resolve({ status: false });
                    }
                } else {
                    console.log('User not found');
                    resolve({ status: false });
                }
            } catch (err) {
                console.error('Error comparing passwords:', err);
                reject(new Error('Internal error'));
            }
        });
    },
    addtocart:(prodId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let usercart=await db.get().collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userId)})//checks whether cart exist for that user or not
            if(usercart){
                db.get().collection(collection.CART_COLLECTION).updateOne({user:new ObjectId(userId)},{
                
                    $push:{products:new ObjectId(prodId)}
                
             } ).then((response)=>{
                resolve()
             })
            }
            else{
                let cartObj={//this obj is stored in database
                    user: new ObjectId(userId),
                    products:[new ObjectId(prodId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
    getcartproducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartitems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:new ObjectId(userId)}//checks whether user in databse matches with user in cart
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,//go to collection products
                        let:{prolist:'$products'},//assign var
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$prolist"]//fetches matched pro det
                                    }
                                }
                            }
                        ],
                        as:'cartitems'
                    }
                }
            ]).toArray()
            resolve(cartitems[0].cartitems)//gets only the details of that obj
        })
    }
};
