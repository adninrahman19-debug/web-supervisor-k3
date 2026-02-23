/* =========================================
   LOGIKA WEB SUPERVISOR K3 UTAMA
   ========================================= */

// 1. Dijalankan otomatis saat halaman web selesai dimuat
document.addEventListener("DOMContentLoaded", function() {
    cekStatusUjian();
    tampilkanRiwayat(); // Fungsi baru: Panggil tabel riwayat saat web dibuka
});

// 2. Fungsi untuk menandai materi selesai dan membuka ujian
function tandaiSelesai(materiId) {
    localStorage.setItem('materi_' + materiId, 'selesai');
    alert("Hebat! Anda telah menyelesaikan materi ini. Akses Ujian telah dibuka.");
    window.location.href = "../index.html";
}

// 3. Fungsi untuk mengecek status gembok di Dashboard
function cekStatusUjian() {
    const daftarMateri = ['smkk', 'risiko', 'peraturan'];
    
    daftarMateri.forEach(function(materiId) {
        const tombolUjian = document.getElementById('btn-ujian-' + materiId);
        if (tombolUjian) {
            const statusMateri = localStorage.getItem('materi_' + materiId);
            if (statusMateri === 'selesai') {
                tombolUjian.disabled = false;
                tombolUjian.classList.remove('btn-disabled');
                tombolUjian.classList.add('btn-primary');
                tombolUjian.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Mulai Ujian';
                tombolUjian.onclick = function() {
                    window.location.href = 'ujian/tes-' + materiId + '.html';
                };
            }
        }
    });
}

/* =========================================
   FITUR RIWAYAT UJIAN (BARU)
   ========================================= */

// 4. Fungsi untuk menampilkan data ke dalam Tabel Riwayat di Dashboard
function tampilkanRiwayat() {
    const tempatRiwayat = document.getElementById("tempatRiwayat");
    const btnHapusSemua = document.getElementById("btn-hapus-semua");
    
    // Pastikan script ini sedang berjalan di halaman index.html (yang punya tabel riwayat)
    if (!tempatRiwayat) return;

    // Ambil data riwayat dari localStorage, jika kosong jadikan array []
    let riwayat = JSON.parse(localStorage.getItem("riwayat_ujian")) || [];

    // Jika array kosong (belum ada yang ujian)
    if (riwayat.length === 0) {
        tempatRiwayat.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem;">Belum ada riwayat ujian.</td></tr>`;
        btnHapusSemua.style.display = "none"; // Sembunyikan tombol hapus semua
        return;
    }

    // Jika ada data, tampilkan tombol Hapus Semua
    btnHapusSemua.style.display = "inline-block";
    let htmlRiwayat = "";

    // Tampilkan data dari yang paling baru (di-reverse / dibalik urutannya)
    riwayat.slice().reverse().forEach((data, indexLooping) => {
        // Karena array dibalik, kita perlu hitung index aslinya agar saat dihapus tidak salah target
        const indexAsli = riwayat.length - 1 - indexLooping;
        
        // Atur label Lulus / Tidak Lulus
        const badgeClass = data.skor >= 70 ? "badge-success" : "badge-danger";
        const teksStatus = data.skor >= 70 ? "Lulus" : "Tidak Lulus";

        htmlRiwayat += `
            <tr>
                <td>${data.tanggal}</td>
                <td><strong>${data.topik}</strong></td>
                <td>${data.nama}</td>
                <td><strong>${data.skor}</strong> / 100</td>
                <td><span class="badge ${badgeClass}">${teksStatus}</span></td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="hapusRiwayat(${indexAsli})" title="Hapus Riwayat Ini">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tempatRiwayat.innerHTML = htmlRiwayat;
}

// 5. Fungsi untuk menghapus 1 baris riwayat
function hapusRiwayat(index) {
    if (confirm("Apakah Anda yakin ingin menghapus riwayat ujian ini?")) {
        let riwayat = JSON.parse(localStorage.getItem("riwayat_ujian")) || [];
        riwayat.splice(index, 1); // Hapus 1 data pada urutan (index) tersebut
        localStorage.setItem("riwayat_ujian", JSON.stringify(riwayat)); // Simpan ulang ke localStorage
        tampilkanRiwayat(); // Refresh tabel otomatis
    }
}

// 6. Fungsi untuk menghapus SEMUA riwayat
function hapusSemuaRiwayat() {
    if (confirm("PERINGATAN! Anda yakin ingin menghapus SEMUA riwayat ujian? Tindakan ini tidak bisa dibatalkan.")) {
        localStorage.removeItem("riwayat_ujian"); // Buang kuncinya dari localStorage
        tampilkanRiwayat(); // Refresh tabel otomatis
    }
}