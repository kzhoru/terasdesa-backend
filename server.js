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

const assetRoutes = require("./src/routes/assetRoutes");

const cartRoutes = require("./src/routes/cartRoutes");
const checkoutRoutes = require("./src/routes/checkoutRoutes");
const transaksiRoutes = require("./src/routes/transaksiRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/uploads/assets", express.static(path.join(__dirname, "uploads/assets")));

// Daftarkan Rute ke Express
app.use("/api/auth", authRoutes);
app.use("/user", userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.use("/api/assets", assetRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/transaksi", transaksiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`Server Express berjalan di port: ${PORT}`);
    console.log(`Database terhubung dan siap digunakan.`);
    app.listen(5000, '0.0.0.0', () => {
        console.log("SERVER BERHASIL NYALA DI PORT: 5000");
            });
    console.log(`==========================================`);
});