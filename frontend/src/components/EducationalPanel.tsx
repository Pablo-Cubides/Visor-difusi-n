'use client'

import React from 'react'

interface EducationalPanelProps {
  text: string;
  className?: string;
}

export default function EducationalPanel({ text, className = '' }: EducationalPanelProps){
  return (
    <div className={`flex-grow bg-gray-50 rounded-md p-4 text-gray-800 overflow-y-auto h-64 lg:h-auto prose ${className}`}>
      <p>{text}</p>
    </div>
  )
}
