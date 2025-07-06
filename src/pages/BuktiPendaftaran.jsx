import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import "../styles/buktipendaftaran.css";
import checkIcon from "../assets/Icon/Check.webp";
import unduhIcon from "../assets/Icon/Unduh.webp";

// Fungsi untuk memformat ulang tanggal YYYY-MM-DD ke format yang lebih lengkap
const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Data Tidak Ditemukan';
    // Tambahkan T00:00:00 untuk menghindari masalah timezone saat parsing
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const BuktiPendaftaran = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Ambil data pendaftaran dari state navigasi
    const formData = location.state?.registrationData;

    // Ref untuk menunjuk ke elemen yang akan di-screenshot
    const downloadAreaRef = useRef(null);
    
    // Data yang akan ditampilkan, mengambil dari formData atau fallback ke data dummy
    const registrationData = {
        namaPasien: formData?.namaLengkap || 'Data Tidak Ditemukan',
        nik: formData?.nik || 'Data Tidak Ditemukan',
        noRekamMedis: '100076', // Contoh No. RM
        nomorAntrian: 'OR-001', // Contoh No. Antrian
        hariTanggalDaftar: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        jamDaftar: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        poliTujuan: formData?.poli || 'Data Tidak Ditemukan',
        namaDokter: 'drg. Siti Nazifah, Sp. Ort., Subsp. OD (K)', // Contoh Nama Dokter
        tanggalPemeriksaan: formatDisplayDate(formData?.hariTujuan),
        jamPemeriksaan: formData?.jamTujuan || 'Data Tidak Ditemukan',
        keluhan: formData?.keluhan || 'Data Tidak Ditemukan'
    };

    // Fungsi untuk membuat dan mengunduh PDF
    const generatePdf = () => {
        const input = downloadAreaRef.current;
        html2canvas(input, { 
            scale: 2, // Skala 2 untuk kualitas gambar yang lebih baik
            useCORS: true 
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`bukti-pendaftaran-${registrationData.namaPasien}.pdf`);
        });
    };

    // Auto-download saat komponen pertama kali dimuat
    useEffect(() => {
        // Cek jika ada data form, baru jalankan download
        if (formData) {
            generatePdf();
        }
    }, [formData]); // Array dependensi untuk memastikan useEffect berjalan jika formData ada

    return (
        <>
            <div id="bukti-pendaftaran">
                <div className="bukti-pendaftaran-download" ref={downloadAreaRef}>
                    <div className="bukti-pendaftaran-content">
                        <img src={checkIcon} alt="Checkmark" className="check-icon" />
                        <h1>Berhasil Mendaftar</h1>
                        <table className="registration-details">
                            <tbody>
                                <tr><td>Nama Pasien</td><td>: {registrationData.namaPasien}</td></tr>
                                <tr><td>Nomor Induk Keluarga</td><td>: {registrationData.nik}</td></tr>
                                <tr><td>No. Rekam Medis</td><td>: {registrationData.noRekamMedis}</td></tr>
                                <tr><td>Nomor Antrian</td><td>: {registrationData.nomorAntrian}</td></tr>
                                <tr><td>Hari & Tanggal Daftar</td><td>: {registrationData.hariTanggalDaftar}</td></tr>
                                <tr><td>Jam Daftar</td><td>: {registrationData.jamDaftar}</td></tr>
                                <tr><td>Poli Tujuan</td><td>: {registrationData.poliTujuan}</td></tr>
                                <tr><td>Nama Dokter</td><td>: {registrationData.namaDokter}</td></tr>
                                <tr><td>Tanggal Pemeriksaan</td><td>: {registrationData.tanggalPemeriksaan}</td></tr>
                                <tr><td>Jam Pemeriksaan</td><td>: {registrationData.jamPemeriksaan}</td></tr>
                                <tr><td>Keluhan</td><td>: {registrationData.keluhan}</td></tr>
                            </tbody>
                        </table>
                        <div className="notes-section">
                            <ul>
                                <li>Bukti tanda pendaftaran sudah otomatis terunduh dalam perangkat kamu dalam bentuk PDF.</li>
                                <li>Tunjukkan bukti pendaftaran kepada petugas rumah sakit.</li>
                                <li>Harap datang ke rumah sakit paling lambat 15 menit sebelum jam pemeriksaan.</li>
                                <li className="warning">Mohon simpan file bukti pendaftaran dengan baik dan aman agar tidak hilang, terhapus, atau sulit ditemukan saat diperlukan, karena setelah halaman ini ditutup, Anda tidak akan dapat mengakses kembali file tersebut melalui sistem.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="bukti-pendaftaran-button-content">
                    <button onClick={generatePdf}>
                        Unduh Ulang PDF <img src={unduhIcon} alt="Unduh"/>
                    </button>
                    <p onClick={() => navigate('/')}>Kembali ke beranda</p>
                </div>
            </div>
        </>
    )
}

export default BuktiPendaftaran;