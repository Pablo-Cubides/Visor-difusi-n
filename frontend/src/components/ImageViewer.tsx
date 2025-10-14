'use client'

import React from 'react'

export default function ImageViewer({ image, overlay, overlayOpacity=0.5 }: any){
  return (
    <div className="relative w-full h-0" style={{ paddingBottom: '100%' }}>
      {image && <img src={image} alt="main" className="absolute inset-0 w-full h-full object-contain" />}
      {overlay && <img src={overlay} alt="overlay" className="absolute inset-0 w-full h-full object-contain pointer-events-none" style={{ opacity: overlayOpacity }} />}
    </div>
  )
}
