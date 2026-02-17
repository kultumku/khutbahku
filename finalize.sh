#!/bin/bash

# KhutbahKu: Final Automation Script
# Jalankan script ini untuk mendorong perubahan ke GitHub & memberitahu Vercel

echo "🚀 Memulai proses finalisasi KhutbahKu..."

# 1. Pastikan semua file tersimpan
git add .

# 2. Commit perubahan terakhir
git commit -m "feat: cleanup total phase 11 - production ready"

# 3. Push ke GitHub
# Catatan: Jika ini gagal, pastikan Anda sudah login ke GitHub CLI (gh auth login)
echo "📦 Mendorong kode ke GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Berhasil push ke GitHub! Vercel akan mulai deploy otomatis."
else
    echo "❌ Gagal push ke GitHub. Pastikan Anda punya izin akses (atau jalankan 'gh auth login')."
fi

echo ""
echo "---------------------------------------------------"
echo "🛠️ LANGKAH TERAKHIR (WAJIB):"
echo "1. Buka Supabase SQL Editor: Jalankan file 'supabase/functions/delete_user_data.sql'"
echo "2. Buka Supabase Storage: Buat bucket baru bernama 'payment-proofs' (set Public)."
echo "3. Update Vercel ENV: Masukkan GEMINI_API_KEY yang asli di dashboard Vercel."
echo "---------------------------------------------------"
echo "SIAP MELUNCUR! 🕌💎🚀"
