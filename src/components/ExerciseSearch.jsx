import React, { useMemo, useState } from 'react'
import { useApp } from '../context.jsx'
import * as api from '../lib/api'

export default function ExerciseSearch({ onPick }) {
  const [q, setQ] = useState('')
  const results = useMemo(()=> api.searchExercises(q), [q])
  const [name, setName] = useState('')

  return (
    <div className="grid">
      <input placeholder="Search exercises..." value={q} onChange={e=>setQ(e.target.value)} />
      <div className="grid" style={{gridTemplateColumns:'1fr 120px'}}>
        <input placeholder="Quick add custom exercise..." value={name} onChange={e=>setName(e.target.value)} />
        <button disabled={!name.trim()} onClick={()=>{ onPick({ type:'create', name: name.trim() }); setName('') }}>Add</button>
      </div>
      <div className="card" style={{maxHeight:240, overflow:'auto'}}>
        {results.map(ex => (
          <div key={ex.id} className="flex" style={{justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border)'}}>
            <div>{ex.name} <span className="badge">{ex.category}</span></div>
            <button className="ghost" onClick={()=>onPick({ type:'pick', id: ex.id })}>Select</button>
          </div>
        ))}
      </div>
    </div>
  )
}
