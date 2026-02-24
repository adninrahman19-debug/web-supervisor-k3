/* =========================================
   LOGIKA WEB SUPERVISOR K3 UTAMA
   (DIPERBARUI DENGAN SWEETALERT2)
   ========================================= */

// 1. Dijalankan otomatis saat halaman web selesai dimuat
document.addEventListener("DOMContentLoaded", function() {
    cekStatusUjian();
    tampilkanRiwayat(); // Panggil tabel riwayat saat web dibuka
});

// 2. Fungsi untuk menandai materi selesai dan membuka ujian
function tandaiSelesai(materiId) {
    // Simpan status ke localStorage
    localStorage.setItem('materi_' + materiId, 'selesai');
    
    // Notifikasi Manis dengan SweetAlert2
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Luar Biasa!',
            html: 'Anda telah menyelesaikan materi ini.<br><b>Gembok Ujian telah terbuka!</b>',
            icon: 'success',
            confirmButtonText: '<i class="fa-solid fa-rocket"></i> Menuju Dashboard',
            confirmButtonColor: '#27AE60',
            allowOutsideClick: false // Mencegah user klik sembarangan di luar kotak
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "../index.html";
            }
        });
    } else {
        // Fallback jika internet mati / SweetAlert gagal dimuat
        alert("Hebat! Anda telah menyelesaikan materi ini. Akses Ujian telah dibuka.");
        window.location.href = "../index.html";
    }
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
                
                // Menyesuaikan warna tombol sesuai topiknya (opsional tapi bagus)
                if(materiId === 'risiko') {
                    tombolUjian.classList.add('btn-orange'); // Dari css khusus risiko
                    // jika class btn-orange tidak ada di style.css dashboard, dia akan pakai warna default
                    // Agar aman, kita set background manual jika btn-orange tidak dikenali
                    tombolUjian.style.backgroundColor = "#E67E22";
                    tombolUjian.style.color = "#fff";
                } else if(materiId === 'peraturan') {
                    tombolUjian.style.backgroundColor = "#27AE60";
                    tombolUjian.style.color = "#fff";
                } else {
                    tombolUjian.classList.add('btn-primary'); // Default (Biru)
                }

                tombolUjian.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Mulai Ujian';
                tombolUjian.onclick = function() {
                    window.location.href = 'ujian/tes-' + materiId + '.html';
                };
            }
        }
    });
}

/* =========================================
   FITUR RIWAYAT UJIAN (DI UPDATE SWEETALERT)
   ========================================= */

// 4. Fungsi untuk menampilkan data ke dalam Tabel Riwayat di Dashboard
function tampilkanRiwayat() {
    const tempatRiwayat = document.getElementById("tempatRiwayat");
    const btnHapusSemua = document.getElementById("btn-hapus-semua");
    
    if (!tempatRiwayat) return;

    let riwayat = JSON.parse(localStorage.getItem("riwayat_ujian")) || [];

    if (riwayat.length === 0) {
        tempatRiwayat.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem;">Belum ada riwayat ujian yang diselesaikan.</td></tr>`;
        btnHapusSemua.style.display = "none"; 
        return;
    }

    btnHapusSemua.style.display = "inline-block";
    let htmlRiwayat = "";

    riwayat.slice().reverse().forEach((data, indexLooping) => {
        const indexAsli = riwayat.length - 1 - indexLooping;
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

// 5. Fungsi untuk menghapus 1 baris riwayat dengan SweetAlert
function hapusRiwayat(index) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Hapus Riwayat?',
            text: "Data ujian ini akan dihapus dari tabel.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                eksekusiHapus(index);
                Swal.fire({ title: 'Terhapus!', text: 'Riwayat berhasil dihapus.', icon: 'success', timer: 1500, showConfirmButton: false });
            }
        });
    } else {
        if (confirm("Apakah Anda yakin ingin menghapus riwayat ujian ini?")) eksekusiHapus(index);
    }
}

// Fungsi internal untuk melakukan proses hapus array
function eksekusiHapus(index) {
    let riwayat = JSON.parse(localStorage.getItem("riwayat_ujian")) || [];
    riwayat.splice(index, 1); 
    localStorage.setItem("riwayat_ujian", JSON.stringify(riwayat)); 
    tampilkanRiwayat(); 
}

// 6. Fungsi untuk menghapus SEMUA riwayat dengan SweetAlert
function hapusSemuaRiwayat() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Hapus SEMUA Riwayat?',
            text: "PERINGATAN! Seluruh data ujian akan hilang dan tidak bisa dikembalikan!",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#888',
            confirmButtonText: 'Hapus Permanen',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("riwayat_ujian"); 
                tampilkanRiwayat(); 
                Swal.fire({ title: 'Kosong!', text: 'Semua riwayat telah dibersihkan.', icon: 'success', timer: 1500, showConfirmButton: false });
            }
        });
    } else {
        if (confirm("PERINGATAN! Anda yakin ingin menghapus SEMUA riwayat ujian? Tindakan ini tidak bisa dibatalkan.")) {
            localStorage.removeItem("riwayat_ujian"); 
            tampilkanRiwayat(); 
        }
    }
}
