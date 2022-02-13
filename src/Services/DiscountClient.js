const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')

const protoObject = protoLoader.loadSync(path.resolve(__dirname, 'discount.proto'))
const DiscountClient = grpc.loadPackageDefinition(protoObject)


const client = new DiscountClient.discount.Discount('localhost:50051', grpc.credentials.createInsecure())


module.exports = {
    DiscountClient: client
}