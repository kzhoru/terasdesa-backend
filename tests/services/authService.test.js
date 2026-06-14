const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
jest.mock("../../src/config/db", () => {
  return {}; // Me-return object kosong agar koneksi DB tidak dijalankan
});
const userRepo = require("../../src/repositories/userRepository");
const authService = require("../../src/services/authService"); // Sesuaikan path file auth service Anda

// Mock semua modul eksternal dan repository
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../src/repositories/userRepository");

describe("Auth Service Unit Tests", () => {
  // Membersihkan mock sebelum setiap test dijalankan agar tidak ada data yang bocor antar test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Register", () => {
    const validRegisterData = {
      name: "Budi Santoso",
      email: "budi@example.com",
      password: "password123",
      tanggal_lahir: "1995-05-20",
      no_hp: "081234567890",
    };

    it("harus berhasil mendaftarkan user baru dan mengembalikan token", async () => {
      // Setup mock returns
      userRepo.findByEmail.mockResolvedValue(null); // Email belum terdaftar
      bcrypt.hash.mockResolvedValue("hashedPassword123");
      userRepo.create.mockResolvedValue({ insertId: 1 });
      jwt.sign.mockReturnValue("mock_jwt_token");

      const result = await authService.register(validRegisterData);

      // Verifikasi pemanggilan fungsi
      expect(userRepo.findByEmail).toHaveBeenCalledWith(validRegisterData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(validRegisterData.password, 10);
      expect(userRepo.create).toHaveBeenCalledWith({
        ...validRegisterData,
        password: "hashedPassword123",
        role: "user",
      });
      expect(jwt.sign).toHaveBeenCalled();

      // Verifikasi hasil return
      expect(result).toEqual({
        id: 1,
        name: validRegisterData.name,
        email: validRegisterData.email,
        token: "mock_jwt_token",
      });
    });

    it("harus throw error jika ada field yang kosong", async () => {
      const invalidData = { name: "Budi", email: "budi@example.com" }; // field lain hilang

      await expect(authService.register(invalidData)).rejects.toThrow("Semua field wajib diisi");
    });

    it("harus throw error jika password kurang dari 6 karakter", async () => {
      const invalidData = { ...validRegisterData, password: "123" };

      await expect(authService.register(invalidData)).rejects.toThrow("Password minimal 6 karakter");
    });

    it("harus throw error jika email sudah terdaftar", async () => {
      userRepo.findByEmail.mockResolvedValue({ id: 2, email: validRegisterData.email });

      await expect(authService.register(validRegisterData)).rejects.toThrow("Email sudah terdaftar");
    });
  });

  describe("Login", () => {
    const loginData = {
      email: "budi@example.com",
      password: "password123",
    };

    const mockDbUser = {
      id: 1,
      name: "Budi Santoso",
      email: "budi@example.com",
      password: "hashedPassword123",
      role: "user",
      tanggal_lahir: "1995-05-20",
      no_hp: "081234567890",
      photo: "default.png",
    };

    it("harus berhasil login dan mengembalikan data user beserta token", async () => {
      userRepo.findByEmail.mockResolvedValue(mockDbUser);
      bcrypt.compare.mockResolvedValue(true); // Password cocok
      jwt.sign.mockReturnValue("mock_jwt_token");

      const result = await authService.login(loginData);

      expect(userRepo.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockDbUser.password);
      expect(result).toEqual({
        id: mockDbUser.id,
        name: mockDbUser.name,
        email: mockDbUser.email,
        role: mockDbUser.role,
        tanggal_lahir: mockDbUser.tanggal_lahir,
        no_hp: mockDbUser.no_hp,
        photo: mockDbUser.photo,
        token: "mock_jwt_token",
      });
    });

    it("harus throw error jika email atau password kosong", async () => {
      await expect(authService.login({ email: "budi@example.com" })).rejects.toThrow("Email dan password wajib diisi");
    });

    it("harus throw error jika email tidak ditemukan di database", async () => {
      userRepo.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow("Email tidak ditemukan");
    });

    it("harus throw error jika password salah", async () => {
      userRepo.findByEmail.mockResolvedValue(mockDbUser);
      bcrypt.compare.mockResolvedValue(false); // Password tidak cocok

      await expect(authService.login(loginData)).rejects.toThrow("Password salah");
    });
  });
});