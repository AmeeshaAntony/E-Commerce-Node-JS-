module.exports={
     PRODUCT_COLLECTION:'product' ,
     USER_COLLECTION : 'user' ,
     CART_COLLECTION : 'cart',
     ORDER_COLLECTION : 'order',
}
/*
try {
                let status = order['payment-method'] === 'cod' ? 'placed' : 'pending';
                let orderObj = {
                    deliveryDet: {
                        mobile: order.mobile,
                        address: order.address,
                        pincode: order.pincode
                    },
                    userId: new ObjectId(order.userId),
                    paymentMethod: order['payment-method'],
                    products: products,
                    status: status,
                    total: total,
                    date: new Date()
                };

                let response = await db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj);
                resolve({ orderId: response.insertedId });
            } catch (error) {
                console.error('Error placing order:', error);
                reject(error);
            }*/