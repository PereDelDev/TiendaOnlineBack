const User = require("../models/users.model")
const jwt = require('jsonwebtoken')
const Product = require('../models/product.model')

const validate = (validationSchema) => {
    return async (req, res, next) => {
        try {
            await validationSchema.validate(req.body, { abortEarly: false })
            next()
        } catch (error) {
            res.json(error.errors)
        }
    }
}

const checkToken = async (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(401).json({ fatal: 'Debes incluis el token de autenticación' })
    }

    const token = req.headers.authorization

    let obj
    try {
        obj = jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
        return res.status(401).json({ fatal: 'El token es incorrecto' })

    }

    const usuario = await User.findById(obj.id)
    req.user = usuario
    next()

}

const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user.role === role) {
            return next()
        }
        res.json({ fatal: 'No puedes pasar con ese rol' })
    }
}

const checkProduct = async (req, res, next) => {

    try {

        const product = await Product.findById(req.body.product_id)

        if (!product) {
            return res.status(400).json({ fatal: 'El id del producto no existe' })
        }
        next()
    } catch (error) {
        res.status(400).json({ fatal: 'El id del producto no existe' })
    }


}
module.exports = { validate, checkRole, checkToken, checkProduct }