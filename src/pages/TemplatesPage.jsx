import React from 'react'
import { useApp } from '../context.jsx'
import { useNavigate } from 'react-router-dom'

export default function TemplatesPage(){
  const { state, deleteTemplate, applyTemplate } = useApp()
  const nav = useNavigate()

  return (
    <div className="grid">
      <div className="card">
        <h3>Templates</h3>
        <table className="table">
          <thead><tr><th>Name</th><th>Exercises</th><th>Actions</th></tr></thead>
          <tbody>
            {state.templates.map(t=>{
              const count = state.templateExercises.filter(te=>te.template_id===t.id).length
              return (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{count}</td>
                  <td className="flex">
                    <button className="ghost" onClick={()=>{
                      const dateISO = prompt('Apply to date (YYYY-MM-DD)?', new Date().toISOString().slice(0,10))
                      if(!dateISO) return
                      const id = applyTemplate(t.id, dateISO)
                      nav('/session/'+id)
                    }}>Apply</button>
                    <button className="ghost" onClick={()=>deleteTemplate(t.id)}>Delete</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
