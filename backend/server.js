const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Menaikkan limit untuk menerima file gambar

// Konfigurasi Koneksi Database MySQL
// Pastikan detail ini sesuai dengan pengaturan XAMPP Anda
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Username default XAMPP
  password: '',       // Password default XAMPP biasanya kosong
  database: 'rsgm_db' // Nama database yang sudah Anda buat
});

// Membuat koneksi ke database
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to the MySQL database.');
});

// --- PEMETAAN KODE POLI (SESUAI GAMBAR ANDA) ---
const poliCodeMapping = {
    "Gigi Umum": "GU",
    "Ortodonti": "OR",
    "Gigi Anak": "KA",
    "Endodonti": "EN",
    "Prosthodonsia": "PS",
    "Konservasi Gigi": "KG",
    "Penyakit Mulut": "PM",
    "Gigi Estetika dan Kosmetik": "GK",
    "Periodonsia": "PR",
    "Radiologi Gigi dan Mulut": "RG",
    "Gigi Geriatri": "GT",
    "Bedah Mulut dan Maksilofasial": "BM"
};

// ===================================
// === API ENDPOINTS UNTUK PASIEN & PENDAFTARAN ===
// ===================================

// GET semua data pasien
app.get('/api/pasien', (req, res) => {
  const query = 'SELECT *, DATE_FORMAT(tanggal_lahir, "%d/%m/%Y") as tanggal_lahir_formatted FROM pasien';
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    const formattedResults = results.map(p => ({...p, tanggal_lahir: p.tanggal_lahir_formatted}));
    res.status(200).json(formattedResults);
  });
});

// Endpoint untuk pendaftaran pasien baru (dengan logika nomor antrian)
app.post('/api/pendaftaran', (req, res) => {
  const { nik, namaLengkap, jenisKelamin, tanggalLahir, alamat, noHandphone, poli, hariTujuan, jamTujuan, keluhan } = req.body;
  
  const hariPemeriksaan = new Date(hariTujuan + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long' });

  // 1. Cari dokter yang tersedia sesuai poli dan hari
  const queryCariDokter = "SELECT * FROM dokter WHERE spesialis = ? AND jadwal LIKE ? AND status = 'Aktif' LIMIT 1";
  db.query(queryCariDokter, [poli, `%${hariPemeriksaan}%`], (err, dokterResults) => {
    if (err) return res.status(500).json({ message: 'Database error saat mencari dokter', error: err });
    
    if (dokterResults.length === 0) {
      return res.status(404).json({ message: `Tidak ada dokter yang tersedia untuk poli ${poli} pada hari ${hariPemeriksaan}.` });
    }
    const assignedDoctor = dokterResults[0];

    // 2. Cek NIK Pasien
    db.query('SELECT * FROM pasien WHERE nik = ?', [nik], (err, pasienResults) => {
      if (err) return res.status(500).json({ message: 'Database error saat cek NIK', error: err });

      const proceedToRegister = (pasienId, noRekamMedis, statusPasien) => {
          // 3. Buat Nomor Antrian
          const poliCode = poliCodeMapping[poli] || 'XX';
          const queryAntrian = 'SELECT COUNT(*) as count FROM pendaftaran WHERE poli_tujuan = ? AND tanggal_pendaftaran = ?';
          
          db.query(queryAntrian, [poli, hariTujuan], (err, antrianResult) => {
              if (err) return res.status(500).json({ message: 'Gagal menghitung antrian.', error: err });
              
              const nextNumber = antrianResult[0].count + 1;
              const nomorAntrian = `${poliCode}-${nextNumber.toString().padStart(3, '0')}`;
              
              const pendaftaranData = {
                  pasien_id: pasienId,
                  dokter_id: assignedDoctor.id, // Simpan ID dokter yang ditugaskan
                  tanggal_pendaftaran: hariTujuan,
                  jam_pemeriksaan: jamTujuan,
                  poli_tujuan: poli,
                  keluhan,
                  status_pasien: statusPasien,
                  nomor_antrian: nomorAntrian,
              };

              // 4. Simpan Pendaftaran ke Database
              db.query('INSERT INTO pendaftaran SET ?', pendaftaranData, (err, result) => {
                  if (err) return res.status(500).json({ message: 'Gagal menyimpan data pendaftaran.', error: err });
                  
                  console.log(`Pendaftaran baru berhasil untuk pasien ID: ${pasienId}, No. Antrian: ${nomorAntrian}`);
                  res.status(200).json({ 
                      message: 'Pendaftaran berhasil!',
                      data: { ...req.body, noRekamMedis, nomorAntrian, statusPasien, namaDokter: assignedDoctor.nama }
                  });
              });
          });
      };

      if (pasienResults.length > 0) {
        proceedToRegister(pasienResults[0].id, pasienResults[0].no_rm, 'Pasien Terdaftar');
      } else {
        const noRekamMedis = `RM${Math.floor(100000 + Math.random() * 900000)}`;
        const pasienBaru = { nik, no_rm: noRekamMedis, nama_lengkap: namaLengkap, jenis_kelamin: jenisKelamin, tanggal_lahir: tanggalLahir, alamat, no_handphone: noHandphone };
        db.query('INSERT INTO pasien SET ?', pasienBaru, (err, result) => {
          if (err) return res.status(500).json({ message: 'Gagal menyimpan data pasien baru.', error: err });
          proceedToRegister(result.insertId, noRekamMedis, 'Pasien Baru');
        });
      }
    });
  });
});

// GET semua riwayat pendaftaran
app.get('/api/riwayat', (req, res) => {
    const query = `
        SELECT 
            p.id_pendaftaran as id,
            DATE_FORMAT(p.tanggal_pendaftaran, "%d/%m/%Y") as tanggal,
            p.nomor_antrian,
            ps.nama_lengkap as nama,
            ps.nik,
            p.poli_tujuan as poli,
            p.jam_pemeriksaan as jam_daftar,
            p.status_pasien as status
        FROM 
            pendaftaran p
        JOIN 
            pasien ps ON p.pasien_id = ps.id
        ORDER BY
            p.tanggal_pendaftaran DESC, p.jam_pemeriksaan DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.status(200).json(results);
    });
});


// ===================================
// === API ENDPOINTS UNTUK DOKTER ===
// ===================================

// GET semua data dokter
app.get('/api/dokter', (req, res) => {
    db.query('SELECT * FROM dokter', (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.status(200).json(results);
    });
});

// POST untuk menambah dokter baru
app.post('/api/dokter', (req, res) => {
    const { nama, nip, spesialis, jadwal, tanggal_lahir, no_str, no_hp, alamat, status, foto } = req.body;
    const newDoctor = { nama, nip, spesialis, jadwal, tanggal_lahir, no_str, no_hp, alamat, status, foto };
    db.query('INSERT INTO dokter SET ?', newDoctor, (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal menambah dokter', error: err });
        res.status(201).json({ message: 'Dokter berhasil ditambahkan', id: result.insertId });
    });
});

// PUT untuk mengupdate data dokter
app.put('/api/dokter/:id', (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    db.query('UPDATE dokter SET ? WHERE id = ?', [updatedData, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal mengupdate dokter', error: err });
        res.status(200).json({ message: 'Data dokter berhasil diperbarui' });
    });
});

// DELETE untuk menghapus dokter
app.delete('/api/dokter/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM dokter WHERE id = ?', id, (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal menghapus dokter', error: err });
        res.status(200).json({ message: 'Dokter berhasil dihapus' });
    });
});


// ===================================
// === API ENDPOINTS UNTUK PESAN ===
// ===================================

// GET semua pesan dari database
app.get('/api/pesan', (req, res) => {
    const query = 'SELECT * FROM pesan ORDER BY id DESC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.status(200).json(results);
    });
});

// POST untuk menyimpan pesan baru ke database
app.post('/api/pesan', (req, res) => {
    const { nama, email, pesan } = req.body;
    const tanggal = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const jam = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const newMessage = { tanggal, jam, nama, email, pesan };
    db.query('INSERT INTO pesan SET ?', newMessage, (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal menyimpan pesan ke database.' });
        res.status(201).json({ message: 'Pesan berhasil disimpan.' });
    });
});


// ===================================
// === API ENDPOINTS UNTUK DASHBOARD ===
// ===================================

// Endpoint untuk mendapatkan semua statistik kartu
app.get('/api/dashboard/stats', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const todayDayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()];

  const queries = {
    pendaftaranHariIni: 'SELECT COUNT(*) as count FROM pendaftaran WHERE tanggal_pendaftaran = ?',
    pasienBulanIni: 'SELECT COUNT(*) as count FROM pendaftaran WHERE MONTH(tanggal_pendaftaran) = ? AND YEAR(tanggal_pendaftaran) = ?',
    dokterAktif: "SELECT COUNT(*) as count FROM dokter WHERE status = 'Aktif'",
    jadwalHariIni: "SELECT COUNT(*) as count FROM dokter WHERE jadwal LIKE ?"
  };

  db.query(queries.pendaftaranHariIni, [today], (err1, res1) => {
    db.query(queries.pasienBulanIni, [currentMonth, currentYear], (err2, res2) => {
      db.query(queries.dokterAktif, (err3, res3) => {
        db.query(queries.jadwalHariIni, [`%${todayDayName}%`], (err4, res4) => {
          if (err1 || err2 || err3 || err4) {
            return res.status(500).json({ message: "Database query error" });
          }
          res.json({
            pendaftaranHariIni: res1[0].count,
            pasienBulanIni: res2[0].count,
            dokterAktif: res3[0].count,
            jadwalHariIni: res4[0].count
          });
        });
      });
    });
  });
});

// Endpoint untuk daftar pasien hari ini
app.get('/api/dashboard/pasien-hari-ini', (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const query = `
        SELECT ps.nama_lengkap as nama, p.jam_pemeriksaan as jamDaftar, p.poli_tujuan as poli 
        FROM pendaftaran p
        JOIN pasien ps ON p.pasien_id = ps.id
        WHERE p.tanggal_pendaftaran = ?
        ORDER BY p.jam_pemeriksaan ASC
        LIMIT 5
    `;
    db.query(query, [today], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(results);
    });
});

// Endpoint untuk data grafik kunjungan mingguan
app.get('/api/dashboard/kunjungan-mingguan', (req, res) => {
    const query = `
        SELECT DAYOFWEEK(tanggal_pendaftaran) as day, COUNT(*) as count 
        FROM pendaftaran 
        WHERE WEEK(tanggal_pendaftaran, 1) = WEEK(CURDATE(), 1) AND YEAR(tanggal_pendaftaran) = YEAR(CURDATE())
        GROUP BY DAYOFWEEK(tanggal_pendaftaran)
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        const chartData = [0, 0, 0, 0, 0, 0, 0];
        results.forEach(row => {
            chartData[row.day - 1] = row.count;
        });
        res.json(chartData);
    });
});


// ===================================
// === API UNTUK LOGIN ADMIN ===
// ===================================
const adminAccounts = [
  { email: 'fajarahmadkurniadi@gmail.com', password: 'adminrsgm123' },
  { email: 'fakhriskroep@gmail.com', password: 'adminrsgm123' },
  { email: 'admin123@gmail.com', password: 'adminrsgm123' },
];
app.post('/loginadmin', (req, res) => {
  const { email, password } = req.body;
  const admin = adminAccounts.find(
    (acc) => acc.email === email && acc.password === password
  );
  if (admin) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});