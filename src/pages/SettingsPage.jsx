import React from 'react'
import { useApp } from '../context.jsx'

export default function SettingsPage(){
  const { state, setSettings, resetAll } = useApp()
  const s = state.user.settings
  return (
    <div className="grid" style={{maxWidth:680}}>
      <div className="card grid">
        <div className="row">
          <div>
            <label>Units</label>
            <select value={s.units} onChange={e=>setSettings({units:e.target.value})}>
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
          <div>
            <label>Enable weight per set</label>
            <select value={s.weight_enabled?'1':'0'} onChange={e=>setSettings({weight_enabled:e.target.value==='1'})}>
              <option value="1">Enabled</option>
              <option value="0">Disabled</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div>
            <label>Theme</label>
            <select value={s.theme} onChange={e=>setSettings({theme:e.target.value})}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          <div>
            <label>Notifications</label>
            <select value={s.notifications_enabled?'1':'0'} onChange={e=>setSettings({notifications_enabled:e.target.value==='1'})}>
              <option value="1">Enabled</option>
              <option value="0">Disabled</option>
            </select>
          </div>
        </div>
        <div className="flex" style={{justifyContent:'space-between'}}>
          <div className="badge">Local-only storage (offline-first)</div>
          <button className="ghost" onClick={()=>{ if(confirm('Reset all data?')) resetAll() }}>Reset all</button>
        </div>
      </div>
      <div className="card">
        <b>How to run</b>
        <ol>
          <li>npm install</li>
          <li>npm run dev</li>
        </ol>
      </div>
    </div>
  )
}
