import React from 'react'
import '../styles/homepage.css'
import Hero from '../components/Hero'
import Jadwal from '../components/Jadwal'
import Location from '../components/Location'
import Tetsimoni from '../components/Tetsimoni'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

const Homepage = () => {
  return (
    <>
    <Hero/>
    <Jadwal/>
    <Location/>
    <Tetsimoni/>
    <Contact/>
    <Footer/>
    </>
  )
}

export default Homepage