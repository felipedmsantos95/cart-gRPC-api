const ProductRepository = require('./ProductRepository')

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

    //Format Product view on output
    ProductDetails(product){

        const productExists = ProductRepository.FindById(product.id)

        if(productExists){
            const { id, amount, is_gift } = productExists
    
            const totalAmount = product.quantity * amount
    
            return {
                id,
                quantity: product.quantity,
                unit_amount: amount,
                total_amount: totalAmount,
                discount: 1,
                is_gift
            }
        }
        else
            return { invalid: product.id }
            
       

    },

    //Applying formatted view in all products and verify total discount
    CartProductsDetails(products) {
        
        let totalDiscount = 0
        const details = products.map((product) => {
            const productDetails = this.ProductDetails(product)
            totalDiscount = totalDiscount + productDetails.discount
            return productDetails
        })
        
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