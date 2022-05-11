const { Router } = require('express');
const { default: _default } = require('concurrently');
const Product = require('../models/Product');

const router = Router();
// imageUrl:'https://img-global.cpcdn.com/recipes/b352da77586b9b04/400x400cq70/photo.jpg',
// nameProduct:'Снікерс',
// description:"Замечательный вкусный торт, который действительно по вкусу напоминает батончик Сникерс и готовится довольно просто",
// country:"США",
// codeFlag:"US",
// created

router.post('/create',async (req, res) => {
    
        try {
            const isProduct = await Product.findOne({ ...req.body });

            if (isProduct) {
                return res.status(400).json({ message: 'This product has already been added' })
            }
            const product = new Product(req.body);
            await product.save();
            res.status(201).json({ message: 'Product added' });

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong! Try again...' })
        }
    });

router.get('/', async (req, res) => {
        try {

            if (Object.keys(req.body).length <= 0 || (req.body.skip < 0 || req.body.limit <= 0)) {
                return res.status(400).json({ message: 'Bad Request,the server does not understand the request due to incorrect syntax.' })
            }
            const { skip, limit } = req.body;
            const products = await Product.find({});
            let countProd = skip + limit;

            if (!products) {
                return res.status(204).json({ message: 'No Content,No content to respond to.' })

            }
            if (products.length <= limit) {
                return res.json({ products: products });
            }
            res.json({ products: products.slice(skip, countProd), total: products.length });

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong! Try again...' })
        }
    });
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Not found.The server cannot find the requested resource.' });
        }
        res.json({ product });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong! Try again...' })
    }
});

router.put('/:id', async (req, res) => {
        try {
            const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });
           
            if (!product) {
                return res.status(400).json({ message: 'Bad Request,the server does not understand the request due to incorrect syntax.' });
            }
            res.status(201).json({ product, message: 'Product updated' });

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong! Try again...' })
        }
    });

router.delete('/:id', async (req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id)
  
            if (!product) {
                return res.status(400).json({ message: 'Bad Request,the server does not understand the request due to incorrect syntax.' });
            }
            res.status(201).json({ product, message: `Product-"${product.nameProduct}",deleted.`});

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong! Try again...' })
        }
    });

module.exports = router;