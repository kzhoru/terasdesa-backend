const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
require("./src/config/db");

// Import Rute
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const wishlistRoutes = require("./src/routes/wishlistRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Daftarkan Rute ke Express
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`Server Express berjalan di port: ${PORT}`);
    console.log(`Database terhubung dan siap digunakan.`);
    console.log(`==========================================`);
});