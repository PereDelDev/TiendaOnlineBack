const yup = require('yup')

const productSchema = yup.object({
    name: yup.string()
        .required(),
    description: yup.string()
        .min(10),
    price: yup.number()
        .required()
})


module.exports = productSchema