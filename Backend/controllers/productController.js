const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Product = require('../models/productModel');
const Apifeatures = require('../utils/apiFeatures');
const Errorhandler = require('../utils/errorHandler');
const cloudinary = require('cloudinary')


//create a product (Admin)
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    let images = []
    if (typeof req.body.images === "string") {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    const imagesLink = []

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products"
        })

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    req.body.images = imagesLink
    req.body.user = req.user.id
    const product = await Product.create(req.body);
    res.status(201).json({
        sucess: true,
        product
    })
})

//get all products
exports.getAllproducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments()
    const ApiFeature = new Apifeatures(Product.find(), req.query).search().filter()

    let products = await ApiFeature.query
    let filteredProductsCount = products.length;
    ApiFeature.Pagination(resultPerPage)
    products = await ApiFeature.query.clone();
    res.status(200).json({
        sucess: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    })

})

//get all products (Admin)
exports.getAdminproducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find()

    res.status(200).json({
        sucess: true,
        products

    })
})

//get a product

exports.getProductdetails = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new Errorhandler("this product not found", 401))
    } else {
        res.status(200).json({
            sucess: true,
            product
        })
    }
})

//Update product--admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new Errorhandler("there are no product available on this id", 401))
    }

    let images = []

    if (typeof req.body.images === "string") {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {
        //delete images from cloudinary
        for (let i = 0; i < product.images.length; i++) {

            await cloudinary.v2.uploader.destroy(product.images[i].public_id)

        }


        const imagesLink = []

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products"
            })

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.images=imagesLink
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false

    })

    res.status(200).json({
        sucess: true,
        product
    })
})

//delete product--admin

exports.delteProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id)
    if (!product) {

        return next(new Errorhandler("there are no product available on this id", 401))
    }

    //delete images from cloudinary
    for (let i = 0; i < product.images.length; i++) {

        await cloudinary.v2.uploader.destroy(product.images[i].public_id)

    }

    await product.remove();
    res.status(200).json({
        sucess: true,
        message: "this product deleted succefully"
    })
})

//add review in a product
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId)

    if (!product) {
        return next(new Errorhandler("product on this id does not found", 401))
    }

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString())
                rev.rating = rating,
                    rev.comment = comment
        })
    } else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }

    let avg = 0
    product.reviews.forEach((rev) => {
        avg += rev.rating

    })
    product.ratings = avg / product.reviews.length

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        sucess: true,
        message: "your review added"

    })

})

//Get All reviews of a product
exports.getallReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.id)

    if (!product) {
        return next(new Errorhandler("product on this id does not found", 401))
    }

    res.status(200).json({
        sucess: true,
        reviews: product.reviews,
    })

})

//Delete review of a product
exports.DeleteReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId)

    if (!product) {
        return next(new Errorhandler("product on this id does not found", 401))
    }
    if (product.reviews.length === 0) {
        return next(new Errorhandler("No reviews available on this product id", 401))
    }
    const isreviewId = product.reviews.find((rev) => rev._id.toString() === req.query.id.toString())

    if (!isreviewId) {
        return next(new Errorhandler("no review found on this review id", 401))
    }
    const reviews = product.reviews.filter((rev) => rev._id.toString() != req.query.id.toString())
    let avg = 0
    reviews.forEach((rev) => {
        avg += rev.rating
    })

    let ratings;
    if (reviews.length === 0) {
        ratings = 0
    } else {
        ratings = avg / reviews.length
    }
    
    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    }
    )
    res.status(200).json({
        sucess: true,
        messege: `deleted review of ${req.query.id}`
    })

})

