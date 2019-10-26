const express = require('express');
const path = require('path');
const ProductService = require('../services/products');

const {
    productIdSchema,
    createProductSchema,
    updateProductSchema
} = require('../utils/schemas/products');

const validationHandler = require('../utils/middleware/validationHandler');

const cacheResponse = require('../utils/cacheResponse');
const {
    FIVE_MINUTES_IN_SECONDS,
    SIXTY_MINUTES_IN_SECONDS
} = require('../utils/time');

const receipt = '../assets/receipt.pdf';

const platziStore = app => {
    const router = express.Router();
    app.use('/api/', router);

    const productService = new ProductService();

    router.get('/', (req, res) => {
        res.send('API v2');
    });

    router.get('/receipts', (req, res, next) => {
        const file = path.join(__dirname, receipt);
        res.sendFile(file);
    });

    router.get('/products', async (req, res, next) => {
        cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
        const { tags } = req.query;

        try {
            const storeProducts = await productService.getProducts({ tags });

            res.status(200).json({
                data: storeProducts,
                message: 'products listed'
            });
        } catch (err) {
            next(err);
        }
    });

    router.get(
        '/:productId',
        validationHandler({ productId: productIdSchema }, 'params'),
        async function (req, res, next) {
            cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
            const { productId } = req.params;

            try {
                const products = await productService.getProduct({ productId });

                res.status(200).json({
                    data: products,
                    message: 'product retrieved'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.post('/', validationHandler(createProductSchema), async function (
        req,
        res,
        next
    ) {
        const { body: product } = req;
        try {
            const createdProductId = await productService.createProduct({
                product
            });

            res.status(201).json({
                data: createdProductId,
                message: 'product created'
            });
        } catch (err) {
            next(err);
        }
    });

    router.put(
        '/:productId',
        validationHandler({ productId: productIdSchema }, 'params'),
        validationHandler(updateProductSchema),
        async function (req, res, next) {
            const { productId } = req.params;
            const { body: product } = req;

            try {
                const updatedProductId = await productService.updateProduct({
                    productId,
                    product
                });

                res.status(200).json({
                    data: updatedProductId,
                    message: 'product updated'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.delete(
        '/:productId',
        validationHandler({ productId: productIdSchema }, 'params'),
        async function (req, res, next) {
            const { productId } = req.params;

            try {
                const deletedProductId = await productService.deleteProduct({
                    productId
                });

                res.status(200).json({
                    data: deletedProductId,
                    message: 'product deleted'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.get('*', (req, res) => {
        res.status(404).send('Error 404');
    });
};

module.exports = platziStore;
