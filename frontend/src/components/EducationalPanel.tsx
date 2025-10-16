'use client'

import React from 'react'

interface EducationalPanelProps {
  upperText: string;
  lowerText: string;
  className?: string;
}

export default function EducationalPanel({ upperText, lowerText, className = '' }: EducationalPanelProps){
  return (
    <div className={`flex-grow bg-gray-50 rounded-md p-4 text-gray-800 overflow-y-auto h-64 lg:h-auto prose ${className}`}>
      <div className="h-1/2 overflow-y-auto mb-4">
        <p>{upperText}</p>
      </div>
      <hr className="my-4" />
      <div className="h-1/2 overflow-y-auto">
        <p className="whitespace-pre-line">{lowerText}</p>
      </div>
    </div>
  )
}
