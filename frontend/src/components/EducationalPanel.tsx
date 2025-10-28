'use client'

import React from 'react'

interface EducationalPanelProps {
  upperText: string;
  lowerText: string;
  className?: string;
}

export default function EducationalPanel({ upperText, lowerText, className = '' }: EducationalPanelProps){
  return (
    <div className={`glass flex-grow p-4 overflow-y-auto h-64 lg:h-auto ${className}`}>
      <div className="h-1/2 overflow-y-auto mb-4">
        <p className="text-[#E8F0FF] leading-relaxed">{upperText}</p>
      </div>
      <hr className="border-[#00D4FF] my-4" />
      <div className="h-1/2 overflow-y-auto">
        <p className="whitespace-pre-line text-[#B0C4FF] text-sm leading-relaxed">{lowerText}</p>
      </div>
    </div>
  )
}
