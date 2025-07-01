import React from 'react'
import '../styles/pendaftaranpasien.css'
import logoFormPendaftaranPasien from '../assets/Pendaftaran Pasien/Logo Pendaftaran Pasien.webp'

const PendaftaranPasien = () => {
  return (
    <>
      <div id="pendaftaran-pasien">
        <div className="pendaftaran-pasien-header">
          <h5>Kembali</h5>
        </div>
        <div className="pendaftaran-pasien-container">
          <img src={logoFormPendaftaranPasien} alt="Logo Pendaftaran Pasien" />
          <h1>Pendaftaran Pasien</h1>

          {/* Nama Lengkap */}
          <div className="pendaftaran-pasien-col pendaftaran-pasien-nama-lengkap">
            <label htmlFor="namaLengkap">Nama Lengkap</label>
            <input type="text" id="namaLengkap" name="namaLengkap" />
          </div>

          {/* NIK */}
          <div className="pendaftaran-pasien-col pendaftaran-pasien-nik">
            <label htmlFor="nik">Nomor Induk Keluarga</label>
            <input type="number" id="nik" name="nik" />
          </div>

          {/* Jenis Kelamin */}
          <div className="pendaftaran-pasien-col pendaftaran-pasien-jenis-kelamin">
            <label>Jenis Kelamin</label>
            <div className="jenis-kelamin-gender-container">
              <label className="gender-option">
                <input type="radio" name="gender" value="pria" />
                <span className="custom-radio"></span>
                Pria
              </label>
              <label className="gender-option">
                <input type="radio" name="gender" value="wanita" />
                <span className="custom-radio"></span>
                Wanita
              </label>
            </div>
          </div>

          {/* Tanggal Lahir */}
          <div className="pendaftaran-pasien-col pendaftaran-pasien-tanggal-lahir">
            <label htmlFor="tanggalLahir" className="label-tanggal">Tanggal Lahir</label>
            <div className="tanggal-input-wrapper">
              <input type="date" id="tanggalLahir" className="input-tanggal" placeholder="DD/MM/YYYY" />
            </div>
          </div>
          
          {/* Alamat */}
          <div className="pendaftaran-pasien-col pendaftaran-pasien-alamat">
            <label htmlFor="alamat">Alamat</label>
            <textarea id="alamat" name="alamat" rows="4"></textarea>
          </div>

          {/* No. Handphone */}
          <div className="pendaftaran-pasien-col pendaftaran-pasien-no-handphone">
            <label htmlFor="noHandphone">Nomor Handphone</label>
            <input type="tel" id="noHandphone" name="noHandphone" />
          </div>

          {/* Poli Tujuan */}
          <div className="pendaftaran-pasien-col pendaftaran-pasien-poli-tujuan">
            <label htmlFor="poli">Poli Tujuan</label>
            <select id="poli" name="poli" className="select-poli">
                <option value="">Pilih Poli Tujuan</option>
                <option value="umum">Poli Gigi Umum</option>
                <option value="konservasi">Poli Konservasi Gigi</option>
                <option value="bedah-mulut">Poli Bedah Mulut dan Maksilofasial</option>
                <option value="prostodonsia">Poli Prostodonsia</option>
                <option value="ortodonsia">Poli Ortodonsia</option>
                <option value="periodonsia">Poli Periodonsia</option>
                <option value="pediatric">Poli Kedokteran Gigi Anak</option>
                <option value="radiologi">Poli Radiologi Gigi</option>
                <option value="penyakit-mulut">Poli Penyakit Mulut</option>
                <option value="gigi-komunitas">Poli Endodonti</option>
                <option value="gigi-komunitas">Poli Gigi Estetika dan Kosmetik</option>
                <option value="gigi-komunitas">Poli Gigi Geriatri</option>
            </select>
          </div>

          {/* Keluhan */}
          <div className="pendaftaran-pasien-col pendaftaran-pasien-keluhan">
            <label htmlFor="keluhan">Keluhan</label>
            <textarea id="keluhan" name="keluhan" rows="4"></textarea>
          </div>
        </div>
      </div>
    </>
  )
}

export default PendaftaranPasien
