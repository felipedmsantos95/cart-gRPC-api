const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const ProductRepository = require('../Repository/ProductRepository');

const protoObject = protoLoader.loadSync(
    path.resolve(__dirname, 'discount.proto'),
);
const DiscountClient = grpc.loadPackageDefinition(protoObject);

const client = new DiscountClient.discount.Discount(
    process.env.GRPC_SERVER_ADDRESS || '127.0.0.1:50051',
    grpc.credentials.createInsecure(),
);

async function GetServiceDiscount(id) {
    // Verify if is a gift product
    if (ProductRepository.FindById(id).is_gift) {
        return { percentage: 0 };
    }
    return new Promise((resolve, reject) =>
        client.GetDiscount({ productID: id }, function (err, discount) {
            if (err) {
                return reject(err);
            }
            resolve(discount);
        }),
    );
}

module.exports = {
    GetServiceDiscount,
};
