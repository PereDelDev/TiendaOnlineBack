const yup = require('yup')

const registerSchema = yup.object({
    name: yup.string()
        .min(3, 'El campo nombre debe tener mínimo 3 caracteres')
        .required('El campo nombre es requerido'),
    email: yup.string()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .email('El Email es incorrecto')
        .required('El email es requeria'),
    password: yup.string().required('Contraseña requerida')
})

module.exports = registerSchema