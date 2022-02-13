const ProductRepository = require('./ProductRepository')
const DiscountService = require('../Services/DiscountClient')


module.exports = {

    TotalCart(products){
        const total = products.reduce((accumulator, product) => {

            if(ProductRepository.FindById(product.id) ){
                
                const productPrice = ProductRepository.FindById(product.id).amount
    
                const productsTotal = product.quantity * productPrice
                
                return accumulator + productsTotal
            }
           
            
        }, 0)

      

        return total
    },

    async GetServiceDiscount(id){

       return new Promise((resolve, reject) => DiscountService.DiscountClient.GetDiscount({ productID: id }, function (err, discount){
            if(err){
                return reject(err)
            }
            resolve(discount)
        }))
       
    },

    DiscountCalc(amount, percent){
        return Math.round((amount * percent), -2)
    },

    //Format Product view on output
    async ProductDetails(product){

        let serviceDiscount = { percentage: 0 };

        //Verify if discount service is avaliable
        try{
            serviceDiscount = await this.GetServiceDiscount(product.id)
        } catch(err) {
            console.log(`[DISCOUNT SERVICE] Não foi possivel aplicar desconto para o produto de ID ${product.id}, serviço indisponível`)
        }
        
        
        const productExists = ProductRepository.FindById(product.id)

        
        if(productExists){
            const { id, amount, is_gift } = productExists
            
            const totalAmount = product.quantity * amount
            
            //Apply discount if service is avaliable
            let productDiscount = 0;
            if(serviceDiscount.percentage)
                productDiscount = this.DiscountCalc(totalAmount, serviceDiscount.percentage)
            
            return {
                id,
                quantity: product.quantity,
                unit_amount: amount,
                total_amount: totalAmount,
                discount: productDiscount,
                is_gift
            }
        }
        else
            return { invalid: product.id }

    },

    //Applying formatted view in all products and verify total discount
    async CartProductsDetails(products) {
        
        let totalDiscount = 0
        const detailsPromisses =  (products.map(async (product) => {
            const productDetails = await this.ProductDetails(product)
            totalDiscount = totalDiscount + productDetails.discount
            return productDetails
        }))

        const details = await Promise.all(detailsPromisses)
        
        const totalAmount = this.TotalCart(products)
        
        const totalAmountDiscont = totalAmount - totalDiscount

        return {
            total_amount: totalAmount,
            total_amount_with_discount: totalAmountDiscont,
            total_discount: totalDiscount,
            products_details: details
        }
    },

    //Verify wich products are not registered in our datase
    PickProductsNotFound(output){
        const productsOutput = output

        const arrayOfInvalids = productsOutput.filter((product) =>{
            if(('invalid' in product)){
                return true
            }
        }).map((productInvalid) => {
            return `O produto de id ${productInvalid.invalid} não está cadastrado em nosso banco de dados`
        })

        
        return arrayOfInvalids

    }




}