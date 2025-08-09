import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context.jsx'
import ExerciseSearch from '../components/ExerciseSearch.jsx'

export default function SessionPage(){
  const nav = useNavigate()
  const { id } = useParams()
  const { state, updateSession, deleteSession, addExerciseToSession, createExercise, addSet, updateSet, deleteSet, createTemplateFromSession } = useApp()
  const session = state.sessions.find(s=>String(s.id)===String(id))
  const [edit, setEdit] = useState({title: session?.title||'', notes: session?.notes||'', status: session?.status || 'planned'})
  const [searchOpen, setSearchOpen] = useState(false)

  if(!session) return <div className="card">Not found. <button className="ghost" onClick={()=>nav('/')}>Back</button></div>

  const exercises = state.sessionExercises
    .filter(se=>String(se.session_id)===String(id))
    .sort((a,b)=>a.order_index - b.order_index)
    .map(se=> ({
      ...se,
      exercise: state.exercises.find(e=>String(e.id)===String(se.exercise_id)),
      sets: state.sets.filter(st=>String(st.session_exercise_id)===String(se.id)).sort((a,b)=>a.set_index-b.set_index)
    }))

  function saveHeader(){
    updateSession(id, edit)
  }

  function onPick(p){
    console.log("onPick called with", p)
    if(p.type==='create'){
      const exId = createExercise({ name: p.name, category: 'other', equipment: 'other' })
      console.log("Created new exercise id:", exId)
      addExerciseToSession(id, exId)
    } else {
      console.log("Picked existing exercise id:", p.id)
      addExerciseToSession(id, p.id)
    }
    setSearchOpen(false) // bezárja a keresőt
  }

  function dupSet(st){
    addSet(st.session_exercise_id, { reps: st.reps, weight: st.weight, completed: false })
  }

  function makeTemplate(){
    const name = prompt('Template name?') || 'My Template'
    createTemplateFromSession(id, name)
    alert('Saved as template. Open Templates to apply.')
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card grid">
        <div className="row">
          <div>
            <label>Title</label>
            <input value={edit.title} onChange={e=>setEdit({...edit, title:e.target.value})}/>
          </div>
          <div>
            <label>Status</label>
            <select value={edit.status} onChange={e=>setEdit({...edit, status:e.target.value})}>
              {['planned','in_progress','completed','missed'].map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label>Notes</label>
          <textarea rows={3} value={edit.notes} onChange={e=>setEdit({...edit, notes:e.target.value})}></textarea>
        </div>
        <div className="flex" style={{justifyContent:'space-between'}}>
          <div className="flex">
            <button onClick={saveHeader}>Save</button>
            <button className="ghost" onClick={()=>{updateSession(id,{status:'completed'})}}>Mark completed</button>
            <button className="ghost" onClick={makeTemplate}>Save as template</button>
          </div>
          <button className="ghost" onClick={()=>{ if(confirm('Delete session?')) { deleteSession(id); nav('/') }}}>Delete</button>
        </div>
      </div>

      <div className="card">
        <h3>Add exercise</h3>
        <button onClick={()=>setSearchOpen(true)}>Open search</button>
      </div>

      {searchOpen && (
        <div className="card">
          <ExerciseSearch onPick={onPick} />
        </div>
      )}

      {exercises.map(se => (
        <div key={se.id} className="card grid">
          <div className="flex" style={{justifyContent:'space-between'}}>
            <div style={{fontWeight:700}}>{se.exercise?.name || 'Exercise'}</div>
          </div>
          <table className="table">
            <thead><tr><th>#</th><th>Reps</th><th>Weight</th><th>Done</th><th>Actions</th></tr></thead>
            <tbody>
              {se.sets.map(st => (
                <tr key={st.id}>
                  <td>{st.set_index+1}</td>
                  <td><input type="number" value={st.reps} onChange={e=>updateSet(st.id,{reps:Number(e.target.value)})} /></td>
                  <td><input type="number" value={st.weight??''} onChange={e=>updateSet(st.id,{weight:e.target.value===''?null:Number(e.target.value)})} /></td>
                  <td><input type="checkbox" checked={!!st.completed} onChange={e=>updateSet(st.id,{completed:e.target.checked})}/></td>
                  <td className="flex">
                    <button className="ghost" onClick={()=>dupSet(st)}>Duplicate</button>
                    <button className="ghost" onClick={()=>deleteSet(st.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button className="ghost" onClick={()=>addSet(se.id,{reps:10, weight: null})}>+ Add set</button>
          </div>
        </div>
      ))}
    </div>
  )
}
