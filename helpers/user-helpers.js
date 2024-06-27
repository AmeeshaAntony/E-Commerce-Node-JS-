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
    addtocart : (prodId, userId) => {
        let proObj = { // Create the product object with id and quantity
            item: new ObjectId(prodId),
            quantity: 1
        };
    
        return new Promise(async (resolve, reject) => {
            try {
                console.log('addtocart function called with:', { prodId, userId });
                let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: new ObjectId(userId) });
                console.log('User cart:', userCart);
                if (userCart) {
                    if (!Array.isArray(userCart.products)) {
                        console.error('Products is not an array:', userCart.products);
                        return reject(new Error('Invalid cart structure'));
                    }
    
                    const productIndex = userCart.products.findIndex(product => {
                        if (!product.item) {
                            console.error('Product item is missing:', product);
                            return false;
                        }
                        return product.item.toString() === prodId;
                    });
    
                    console.log('Product index:', productIndex);
                    
                    if (productIndex !== -1) {
                        await db.get().collection(collection.CART_COLLECTION).updateOne(
                            { 'user': new ObjectId(userId), 'products.item': new ObjectId(prodId) },
                            { $inc: { 'products.$.quantity': 1 } }
                        );
                        console.log('Product quantity incremented');
                    } else {
                        await db.get().collection(collection.CART_COLLECTION).updateOne(
                            { user: new ObjectId(userId) },
                            { $push: { products: { item: new ObjectId(prodId), quantity: 1 } } }
                        );
                        console.log('Product added to cart');
                    }
                } else {
                    let cartObj = { // Create a new cart object if no cart exists
                        user: new ObjectId(userId),
                        products: [proObj]
                    };
                    await db.get().collection(collection.CART_COLLECTION).insertOne(cartObj);
                    console.log('New cart created and product added');
                }
                resolve();
            } catch (error) {
                console.error('Error in addtocart function:', error);
                reject(error);
            }
        });
    },
    getcartproducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('getcartproducts function called with userId:', userId);
                const pipeline = [
                    {
                        $match: { user: new ObjectId(userId) } // Match the user's cart
                    },
                    {
                        $unwind: '$products' // Deconstruct the products array
                    },
                    {
                        $lookup: {
                            from: collection.PRODUCT_COLLECTION, // Reference to the product collection
                            localField: 'products.item', // Field from cart to match
                            foreignField: '_id', // Field from product collection to match
                            as: 'productDetails' // Alias for the matched product details
                        }
                    },
                    {
                        $unwind: '$productDetails' // Deconstruct the resulting product details array
                    },
                    {
                        $project: { // Shape the output document
                            _id: 0, // Exclude the _id field
                            item: '$products.item', // Include the item id
                            quantity: '$products.quantity', // Include the quantity
                            productDetails: '$productDetails' // Include the product details
                        }
                    }
                ];
    
                let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate(pipeline).toArray();
    
                console.log('Cart Items:', JSON.stringify(cartItems, null, 2));
                resolve(cartItems); // Resolve with the fetched cart items
            } catch (error) {
                console.error('Error fetching cart products:', error);
                reject(error);
            }
        });
    }
    
    
    ,
    getcartcount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let c=0
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userId)})
            if(cart){
                if (Array.isArray(cart.products)) {
                    c = cart.products.length;
                } else {
                    console.warn('Cart products is not an array:', cart.products);
                }
            } else {
                console.warn('Cart not found for user:', userId);
            }

            console.log('Cart count:', c);
            resolve(c);
        }
        )
    }
};
