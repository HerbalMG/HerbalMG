import React from 'react'

import Breadcrumb from '../components/Breadcrumb'
import Brands from '../components/Brands'
import Category from '../components/Category'
import BannerCarousel from '../components/BannerCarousel'
const Home = () => {
  return (
    <>
    <BannerCarousel/>
    <Breadcrumb/>
    <Category/>
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Brands />
    </div>
    </>
  )
}

export default Home