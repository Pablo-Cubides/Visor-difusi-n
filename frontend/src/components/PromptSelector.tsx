'use client'

import React from 'react'

type Prompt = { id: string; prompt: string; description?: string }

export default function PromptSelector({ prompts, selectedId, onSelect }: { prompts: Prompt[]; selectedId?: string; onSelect: (id: string) => void }){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prompts.map(p => (
        <div key={p.id} onClick={() => onSelect(p.id)}
          className={`p-4 border rounded-lg cursor-pointer ${selectedId === p.id ? 'border-primary' : 'border-gray-200'}`}>
          <h3 className="font-bold">{p.prompt}</h3>
          <p className="text-sm text-gray-600">{p.description}</p>
        </div>
      ))}
    </div>
  )
}
