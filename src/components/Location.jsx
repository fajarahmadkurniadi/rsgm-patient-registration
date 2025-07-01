import React from 'react'
import locationButtonImg from '../assets/Location/Google Maps Location Button.webp'


const Location = () => {
  return (
    <>
    <div id="location">
        <div className="location-container">
            <div className="location-content">
                <h1>
                    Temukan lokasi RSGM USU <br />
                    di Google Maps
                </h1>
                <button><a href="https://www.google.com/maps/place/Rumah+Sakit+Gigi+Dan+Mulut+Universitas+Sumatera+Utara/@3.5633037,98.6550242,17z/data=!4m16!1m9!3m8!1s0x30312fdf012a0aab:0xc5f2c6de501cef97!2sRumah+Sakit+Gigi+Dan+Mulut+Universitas+Sumatera+Utara!8m2!3d3.5633037!4d98.6575991!9m1!1b1!16s%2Fg%2F11b7qw0d19!3m5!1s0x30312fdf012a0aab:0xc5f2c6de501cef97!8m2!3d3.5633037!4d98.6575991!16s%2Fg%2F11b7qw0d19!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDYxNi4wIKXMDSoASAFQAw%3D%3D"><img src={locationButtonImg}/></a></button>
            </div>
        </div>
    </div>
    </>
  )
}

export default Location