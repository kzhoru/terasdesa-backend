// File: tests/productService.test.js

const db = require('../config/db'); 
const productService = require('../services/productService');

// Memalsukan (mock) database agar tidak mengubah data asli MySQL saat testing
jest.mock('../config/db');

describe('White Box Testing - productService.js', () => {
    
    // --- TAMBAHAN UNTUK MENGHILANGKAN ERROR CONSOLE DB INIT ---
    let consoleSpy;
    
    beforeAll(() => {
        // Matikan sementara console.error agar terminal tetap bersih saat direkam
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        // Kembalikan fungsi console.error ke kondisi normal setelah test selesai
        consoleSpy.mockRestore();
    });
    // ---------------------------------------------------------

    // Bersihkan semua mock setiap kali satu pengujian selesai
    afterEach(() => {
        jest.clearAllMocks();
    });

    // ==========================================
    // 1. Pengujian fungsi getAllProducts
    // ==========================================
    describe('Fungsi getAllProducts', () => {
        it('Harus mengembalikan semua baris data produk', async () => {
            const mockRows = [
                { id: 1, name: 'Produk A', price: 10000, seller_name: 'Budi' },
                { id: 2, name: 'Produk B', price: 20000, seller_name: 'Siti' }
            ];
            // Simulasi query database mengembalikan mockRows
            db.query.mockResolvedValueOnce([mockRows]);

            const result = await productService.getAllProducts();

            expect(result).toEqual(mockRows);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    // ==========================================
    // 2. Pengujian fungsi getProductById
    // ==========================================
    describe('Fungsi getProductById', () => {
        it('Harus mengembalikan 1 data produk sesuai ID', async () => {
            const mockRow = [{ id: 1, name: 'Produk A', price: 10000, seller_name: 'Budi' }];
            db.query.mockResolvedValueOnce([mockRow]);

            const result = await productService.getProductById(1);

            expect(result).toEqual(mockRow[0]);
        });

        it('Harus mengembalikan undefined jika produk tidak ditemukan', async () => {
            db.query.mockResolvedValueOnce([[]]); // Simulasi DB kosong

            const result = await productService.getProductById(99);

            expect(result).toBeUndefined();
        });
    });

    // ==========================================
    // 3. Pengujian fungsi createProduct
    // ==========================================
    describe('Fungsi createProduct', () => {
        const mockData = {
            userId: 5,
            name: 'Kopi Desa',
            description: 'Kopi asli',
            price: 50000,
            stock: 10
        };

        it('Harus berhasil membuat produk DENGAN file gambar', async () => {
            const mockFile = { filename: 'kopi.jpg' };
            db.query.mockResolvedValueOnce([{ insertId: 10 }]); // Simulasi insert sukses

            const result = await productService.createProduct(mockData, mockFile);

            expect(result).toEqual({
                id: 10,
                userId: 5,
                name: 'Kopi Desa',
                price: 50000,
                imageUrl: '/uploads/products/kopi.jpg' // URL terisi
            });
        });

        it('Harus berhasil membuat produk TANPA file gambar', async () => {
            db.query.mockResolvedValueOnce([{ insertId: 11 }]);

            const result = await productService.createProduct(mockData, null); // Tanpa file

            expect(result.imageUrl).toBeNull(); // URL harus null
        });
    });

    // ==========================================
    // 4. Pengujian fungsi deleteProduct
    // ==========================================
    describe('Fungsi deleteProduct', () => {
        it('Path 1: Error jika produk tidak ada di database', async () => {
            db.query.mockResolvedValueOnce([[]]); // Select kosong

            await expect(productService.deleteProduct(99, 1, 'user'))
                .rejects
                .toThrow('Produk tidak ditemukan');
        });

        it('Path 2: Error Unauthorized jika user bukan pemilik & bukan admin', async () => {
            db.query.mockResolvedValueOnce([[{ id: 1, user_id: 5 }]]); // Produk milik user 5

            // User 2 mencoba menghapus, role 'user'
            await expect(productService.deleteProduct(1, 2, 'user'))
                .rejects
                .toThrow('Unauthorized');
        });

        it('Path 3: Sukses jika request dilakukan oleh PEMILIK asli', async () => {
            db.query.mockResolvedValueOnce([[{ id: 1, user_id: 10 }]]); // Produk milik user 10
            db.query.mockResolvedValueOnce([[]]); // Delete sukses

            // User 10 mencoba menghapus
            const result = await productService.deleteProduct(1, 10, 'user');
            
            expect(result).toBe(true);
            expect(db.query).toHaveBeenCalledTimes(2); // 1x Select, 1x Delete
        });

        it('Path 4: Sukses jika request dilakukan oleh ADMIN (walau bukan pemilik)', async () => {
            db.query.mockResolvedValueOnce([[{ id: 1, user_id: 5 }]]); // Produk milik user 5
            db.query.mockResolvedValueOnce([[]]); // Delete sukses

            // User 99 (bukan pemilik) tapi role admin
            const result = await productService.deleteProduct(1, 99, 'admin');
            
            expect(result).toBe(true);
        });
    });
});