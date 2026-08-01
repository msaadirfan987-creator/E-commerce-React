const Product = require("../models/Product");

/**
 * @desc    Create a new product listing
 * @route   POST /api/products
 * @access  Private (Sellers only)
 */
const createProduct = async (req, res) => {
  try {
    const { title, description, category, brand, price, discountPrice, stock, images, featured, status } = req.body;

    // Field validation
    if (!title || !description || !category || !brand || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: title, description, category, brand, price, and stock.",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be a negative value.",
      });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock cannot be a negative value.",
      });
    }

    // Create the product in the database. Automatically link the seller ID from JWT token.
    const product = await Product.create({
      title,
      description,
      category,
      brand,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: Number(stock),
      images: Array.isArray(images) ? images : (images ? [images] : []),
      seller: req.user.id, // Linked automatically from authMiddleware protect
      featured: !!featured,
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during product creation: " + error.message,
    });
  }
};

/**
 * @desc    Get all products or query by specific parameters (e.g. seller ID, category)
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const query = {};

    // Filter out hidden products for public storefront lists
    if (!req.query.seller) {
      query.visibility = { $ne: "Hidden" };
    }

    // Filter by seller ID if provided (e.g. on My Products seller dashboard page)
    if (req.query.seller) {
      query.seller = req.query.seller;
    }

    // Filter by category if provided
    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }

    const products = await Product.find(query)
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error retrieving products: " + error.message,
    });
  }
};

/**
 * @desc    Get a single product listing by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "fullName email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product listing not found.",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error retrieving product: " + error.message,
    });
  }
};

/**
 * @desc    Update a product listing by ID
 * @route   PUT /api/products/:id
 * @access  Private (Sellers only, owns product check)
 */
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product listing not found.",
      });
    }

    // Check if the current user is the owner of the product listing
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized. You can only modify your own product listings.",
      });
    }

    const { title, description, category, brand, price, discountPrice, stock, images, featured, status } = req.body;

    // Field validation
    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be a negative value.",
      });
    }

    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock cannot be a negative value.",
      });
    }

    // Perform the update
    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title: title || product.title,
        description: description || product.description,
        category: category || product.category,
        brand: brand || product.brand,
        price: price !== undefined ? Number(price) : product.price,
        discountPrice: discountPrice !== undefined ? Number(discountPrice) : product.discountPrice,
        stock: stock !== undefined ? Number(stock) : product.stock,
        images: Array.isArray(images) ? images : (images ? [images] : product.images),
        featured: featured !== undefined ? !!featured : product.featured,
        status: status || product.status,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating product: " + error.message,
    });
  }
};

/**
 * @desc    Delete a product listing by ID
 * @route   DELETE /api/products/:id
 * @access  Private (Sellers only, owns product check)
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product listing not found.",
      });
    }

    // Check if the current user is the owner of the product listing
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized. You can only delete your own product listings.",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error deleting product: " + error.message,
    });
  }
};

/**
 * @desc    Search products with filters, sorting and pagination
 * @route   GET /api/products/search
 * @access  Public
 */
const searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, brand, rating, availability, sortBy, page = 1, limit = 12 } = req.query;

    const matchQuery = { visibility: { $ne: "Hidden" } };

    // 1. Keyword search (case-insensitive, partial matches)
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      
      const User = require("../models/User");
      const matchingSellers = await User.find({ fullName: regex, role: "seller" }).select("_id");
      const sellerIds = matchingSellers.map(s => s._id);

      matchQuery.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
        { brand: regex },
        { seller: { $in: sellerIds } }
      ];
    }

    // Category filter
    if (category && category !== "All") {
      matchQuery.category = category;
    }

    // Price filter
    if (minPrice || maxPrice) {
      matchQuery.price = {};
      if (minPrice) matchQuery.price.$gte = Number(minPrice);
      if (maxPrice) matchQuery.price.$lte = Number(maxPrice);
    }

    // Brand filter
    if (brand && brand !== "All") {
      matchQuery.brand = brand;
    }

    // Availability filter
    if (availability === "in-stock") {
      matchQuery.stock = { $gt: 0 };
    } else if (availability === "out-of-stock") {
      matchQuery.stock = 0;
    }

    // Setup aggregation to fetch average rating
    const pipeline = [
      { $match: matchQuery },
      // Lookup reviews
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "product",
          as: "reviews"
        }
      },
      // Calculate avgRating and reviewCount
      {
        $addFields: {
          avgRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.rating" },
              else: 5.0 // Default rating
            }
          },
          reviewCount: { $size: "$reviews" }
        }
      }
    ];

    // Filter by avgRating if rating is provided
    if (rating) {
      pipeline.push({
        $match: { avgRating: { $gte: Number(rating) } }
      });
    }

    // Sort stages
    let sortStage = {};
    if (sortBy === "price-asc") {
      sortStage = { price: 1 };
    } else if (sortBy === "price-desc") {
      sortStage = { price: -1 };
    } else if (sortBy === "newest") {
      sortStage = { createdAt: -1 };
    } else if (sortBy === "rating") {
      sortStage = { avgRating: -1 };
    } else {
      // Relevance / Default
      sortStage = { createdAt: -1 };
    }
    pipeline.push({ $sort: sortStage });

    // Populate seller details after filters/sorting (Lookup seller)
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "seller",
          foreignField: "_id",
          as: "sellerDetails"
        }
      },
      {
        $unwind: {
          path: "$sellerDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          seller: {
            _id: "$sellerDetails._id",
            fullName: "$sellerDetails.fullName",
            email: "$sellerDetails.email"
          }
        }
      },
      {
        $project: {
          sellerDetails: 0,
          reviews: 0
        }
      }
    );

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // To get total count, we can do a separate count or facet
    const allMatching = await Product.aggregate(pipeline);
    const total = allMatching.length;

    // Apply skip and limit
    pipeline.push({ $skip: skip }, { $limit: Number(limit) });
    const products = await Product.aggregate(pipeline);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error searching products: " + error.message
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
};
