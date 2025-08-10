import productModel from "../models/productModel.js";
import fs from 'fs/promises';
import path from 'path';

// add product
const addProduct = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Product image is required." });
    }
    if (!req.body.name || !req.body.description || !req.body.price || !req.body.category) {
        return res.status(400).json({ success: false, message: "Missing required product fields." });
    }

    const image_filename = `${req.file.filename}`;
    const product = new productModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await product.save();
        res.status(201).json({ success: true, message: "Product Added Successfully" });
    } catch (error) {
        console.error("Error adding product:", error);
        // Clean up uploaded file if database save fails
        try {
            await fs.unlink(path.join('uploads', image_filename));
        } catch (unlinkError) {
            console.error("Error cleaning up uploaded file:", unlinkError);
        }
        res.status(500).json({ success: false, message: "Failed to add product due to a server error." });
    }
};

// all products list
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error listing products:", error);
        res.status(500).json({ success: false, message: "An unexpected error occurred while fetching products." });
    }
};

// remove product
const removeProduct = async (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({ success: false, message: "Product ID is required." });
    }

    try {
        const product = await productModel.findById(req.body.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        const imagePath = path.join('uploads', product.image);
        
        // Use fs.promises.unlink for async file deletion
        await fs.unlink(imagePath);
        
        await productModel.findByIdAndDelete(req.body.id);
        
        res.status(200).json({ success: true, message: "Product Removed Successfully" });
    } catch (error) {
        console.error("Error removing product:", error);
        if (error.code === 'ENOENT') { // File not found error
             await productModel.findByIdAndDelete(req.body.id);
             return res.status(200).json({ success: true, message: "Product Removed, but image file was not found." });
        }
        res.status(500).json({ success: false, message: "An unexpected error occurred while removing the product." });
    }
};

export { addProduct, listProduct, removeProduct };
