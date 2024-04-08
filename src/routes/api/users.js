const router = require('express').Router();
const bcrypt = require('bcryptjs')

const User = require('../../models/users.model');
const { validate, checkToken } = require('../../helpers/middlewares')
const registerSchema = require('../../schemas/register.schema');
const { createToken } = require('../../helpers/util');
const jwt = require('jsonwebtoken')


router.get('/profile', checkToken, (req, res) => {

    res.json(req.user)

});

router.get('/:userId', async (req, res) => {
    const usuario = await User.findById(req.params.userId).populate('cart')
    res.json(usuario)
});

router.post('/register', validate(registerSchema), async (req, res) => {
    // body: name, email, password
    req.body.password = bcrypt.hashSync(req.body.password, 10)
    try {
        const newUser = await User.create(req.body)
        res.json(newUser)
    } catch (error) {
        res.json(error.errors)
    }
});

router.post('/login', async (req, res) => {
    // body: email, password
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(403).json({ fatal: 'Error email y/o contraseña' })
    }

    //Comprovar las password
    const iguales = bcrypt.compareSync(password, user.password)
    if (!iguales) {
        return res.status(403).json({ fatal: 'Error email y/o contraseña' })
    }

    res.json({
        message: 'Login correcto',
        token: createToken(user)
    })

});



module.exports = router;