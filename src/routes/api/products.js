const router = require('express').Router();

const User = require('../../models/users.model')
const { validate, checkProduct } = require('../../helpers/middlewares');
const Product = require('../../models/product.model');
const productSchema = require('../../schemas/product.schema');
const jwt = require('jsonwebtoken')


router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (error) {
        res.json({ fatal: error.message })
    }
})

router.get('/activos', async (req, res) => {
    const productos = await Product.find({
        available: true, stock: { $gte: 50 }
    })

    res.json(productos)

});

router.get('/price/:minPrice/max/:maxPrice', async (req, res) => {
    const { minPrice, maxPrice } = req.params

    const products = await Product.find({
        price: { $gt: minPrice, $lt: maxPrice }
    })
    res.json(products)
});

router.get('/:departamento', async (req, res) => {
    try {
        const { departamento } = req.params
        const respuesta = await Product.find({ department: departamento })
        res.json(respuesta)
    } catch (error) {
        res.json({ fatal: error.message })
    }
});

router.post('/', validate(productSchema), async (req, res) => {
    const newProduct = await Product.create(req.body)
    res.json(newProduct)
});

router.put('/add_cart', checkProduct, async (req, res) => {
    //opcion 1
    try {
        const user = await User.findByIdAndUpdate(req.user.id, {
            $push: { cart: req.body.product_id }
        }, { new: true }).populate('cart')
        res.json(user)
    } catch (error) {
        res.json(error.message)
    }

    //opcion2 
    // req.user.cart.push(req.body.product_id)
    // await req.user.save()

    // res.json(req.user)
});

router.put('/:productId', async (req, res) => {
    const productId = req.params['productId']
    const productEdited = await Product.findByIdAndUpdate(productId, req.body, { new: true })
    res.json(productEdited)
});

router.delete('/:productId', async (req, res) => {
    const { productId } = req.params
    const respuesta = await Product.findByIdAndDelete(productId)
    res.json(respuesta)
});



module.exports = router;