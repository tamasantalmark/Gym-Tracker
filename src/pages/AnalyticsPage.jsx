import React, { useMemo } from 'react'
import { useApp } from '../context.jsx'

function startOfISOWeek(d){
  const day = d.getDay() || 7
  const r = new Date(d); r.setDate(r.getDate() - (day-1)); r.setHours(0,0,0,0); return r
}

export default function AnalyticsPage(){
  const { state } = useApp()
  const kpis = useMemo(()=>{
    const sessions = state.sessions
    const completed = sessions.filter(s=>s.status==='completed').length
    const planned = sessions.filter(s=>s.status==='planned').length
    const totalSets = state.sets.length
    // weekly count (current week)
    const start = startOfISOWeek(new Date())
    const week = sessions.filter(s => new Date(s.date) >= start).length
    return { completed, planned, totalSets, week }
  }, [state])

  return (
    <div className="grid">
      <div className="kpis">
        <div className="kpi"><div>Completed</div><div className="num">{kpis.completed}</div></div>
        <div className="kpi"><div>Planned</div><div className="num">{kpis.planned}</div></div>
        <div className="kpi"><div>Total sets</div><div className="num">{kpis.totalSets}</div></div>
        <div className="kpi"><div>Sessions this week</div><div className="num">{kpis.week}</div></div>
      </div>
      <div className="card">
        <b>Recent exercises</b>
        <ul>
          {state.sessionExercises.slice(-10).reverse().map(se=>{
            const ex = state.exercises.find(e=>e.id===se.exercise_id)
            const sets = state.sets.filter(st=>st.session_exercise_id===se.id).length
            const date = (state.sessions.find(s=>s.id===se.session_id)||{}).date
            return <li key={se.id}>{ex?.name} · {sets} sets · {date}</li>
          })}
        </ul>
      </div>
    </div>
  )
}
