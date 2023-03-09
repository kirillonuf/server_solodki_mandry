const { Router } = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = Router();


router.post('/register',
    [
        check('email', 'Некоректно введено email').isEmail(),
        check('password', 'мінімальна довжина пароля 6 символів').isLength({ min: 6 }),
    ],
    async (req, res) => {

        try {
            console.log(req.body);
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некоректно введені дані при регістрації'
                })
            }
            const { email, password } = req.body;
            const candidate = await User.findOne({ email: email });
            if (candidate) {
                return res.status(400).json({ message: 'Такий користувач вже існує' })
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ email: email, password: hashedPassword });
            await user.save();

            res.status(201).json({ message: 'Користувач створений' })

        } catch (error) {
            res.status(500).json({ message: 'Щось пішло не так! Спробуте ще...' })
        }

    });

router.post('/login',

    [
        check('email', 'Введіть коректно  email').normalizeEmail().isEmail(),
        check('password', 'Введіть пароль').exists(),

    ],
    async (req, res) => {
        console.log(req);

        console.log("CORS");
        try {
           
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некоректно введені дані при вході в систему'
                })
            }

            const { email, password } = req.body;
            const user = await User.findOne({ email: email });

            if (!user) {
                return res.status(400).json({ message: 'Некоректно введені логін або пароль' }).send()
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Некоректно введені логін або пароль' }).send()
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '5h' }

            )
            res.json({ data:{token, userId: user.id }})


        } catch (error) {
            error.message='Щось пішло не так! Спробуте ще...' 
            res.status(500).json({error})
        }

    });

module.exports = router;