const ProductRepository = require('./ProductRepository')
const DiscountService = require('../Services/DiscountClient')
const blackFriday = process.env.BLACK_FRIDAY_DAY


module.exports = {

    TotalCart(products){
        const total = products.reduce((accumulator, product) => {

            if(ProductRepository.FindById(product.id) ){
                const currentProduct = ProductRepository.FindById(product.id)
                
                let productPrice = currentProduct.amount

                //In blackfriday, is_gift flaged products must be added in cart by free
                if(currentProduct.is_gift)
                    productPrice = 0
    
                const productsTotal = product.quantity * productPrice
                
                return accumulator + productsTotal
            }
           
            
        }, 0)

      

        return total
    },

    async GetServiceDiscount(id){
        //Verify if is a gift product
        if(ProductRepository.FindById(id).is_gift){
            return { percentage: 0 }
        } else {
            
            return new Promise((resolve, reject) => DiscountService.DiscountClient.GetDiscount({ productID: id }, function (err, discount){
                if(err){
                    return reject(err)
                }
                resolve(discount)
            }))
        }
    },

    DiscountCalc(amount, percent){
        return Math.round(amount * percent)
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
            let { id, amount, is_gift } = productExists

            //It must be only one gift product input
            if(is_gift){
                amount = 0
                product.quantity = 1
                console.log(`[HASH CART] O produto ${id} é brinde e só pode ser adicionado em 1 unidade.`)
            }
            
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

        
        return { status: 404,  msg: arrayOfInvalids}

    },

    isBlackFriday() {
        const dayBlackFriday = new Date(blackFriday).getDate()
        const today = new Date().getDate()
        
        return (today == dayBlackFriday)
    },
    
    //Verify gift products
    async BlackFridayCheck(products){

        const CartChekout = await this.CartProductsDetails(products)


        if(this.isBlackFriday()){
            const productsOutput = CartChekout.products_details

            const arrayOfGifts = productsOutput.filter((product) => {
                if(product.is_gift){
                    return true
                }
            })
            if(arrayOfGifts.length > 1)
                return { status: 400,  msg: ['Só pode haver uma entrada para produtos brinde na blackfriday.']}
            else
                return {status: 200, msg: CartChekout}


        } else {
            const productsOutput = CartChekout.products_details

            
            const arrayOfInvalids = productsOutput.filter((product) => {
                if(product.is_gift){
                    return true
                }
            }).map((productInvalid) => {
                return `O produto de id ${productInvalid.id} é um brinde de black friday e não pode ser adicionado ao carrinho por enquanto...`
            })
            if(arrayOfInvalids.length == 0)
                return {status: 200, msg: CartChekout}
            else
                return { status: 400,  msg: arrayOfInvalids}
        }


    }




}