import React, { useMemo, useState } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context.jsx'
import Modal from '../components/Modal.jsx'

function monthGrid(current){
  const start = startOfWeek(startOfMonth(current), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(current), { weekStartsOn: 1 })
  const days = []
  let d = start
  while(d<=end){ days.push(d); d = addDays(d,1) }
  return days
}

export default function CalendarPage(){
  const { state, createSession } = useApp()
  const [current, setCurrent] = useState(new Date())
  const days = useMemo(()=>monthGrid(current), [current])
  const nav = useNavigate()

  const [quickAdd, setQuickAdd] = useState({ open:false, date:'' })
  const sessionsByDate = useMemo(() => {
    const map = {}
    state.sessions.forEach(s => { (map[s.date] ||= []).push(s) })
    return map
  }, [state.sessions])

  function openQuickAdd(dateISO){
    setQuickAdd({ open:true, date: dateISO })
  }

  function create(dateISO){
    const id = createSession({ date: dateISO, title: '' })
    setQuickAdd({ open:false, date:'' })
    nav(`/session/${id}`)
  }

  return (
    <div className="calendar">
      <div className="header">
        <div className="flex">
          <button className="ghost" onClick={()=>setCurrent(new Date(current.getFullYear(), current.getMonth()-1, 1))}>Prev</button>
          <div style={{minWidth:160, textAlign:'center', fontWeight:700}}>{format(current, 'MMMM yyyy')}</div>
          <button className="ghost" onClick={()=>setCurrent(new Date(current.getFullYear(), current.getMonth()+1, 1))}>Next</button>
        </div>
        <div className="flex">
          <button className="ghost" onClick={()=>setCurrent(new Date())}>Today</button>
        </div>
      </div>
      <div className="weekdays">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=> <div key={d}>{d}</div>)}
      </div>
      <div className="days">
        {days.map((d,i)=>{
          const iso = d.toISOString().slice(0,10)
          const arr = sessionsByDate[iso] || []
          return (
            <div key={i} className={"day "+(isToday(d)?'today':'')} style={{opacity:isSameMonth(d,current)?1:.5}}>
              <div className="date">{format(d,'d')}</div>
              <button className="ghost add" onClick={()=>openQuickAdd(iso)}>＋</button>
              <div>
                {arr.map(s=> (
                  <div key={s.id} className="session-dot" onClick={()=>nav('/session/'+s.id)}>
                    {s.title || 'Gym'} · {s.status==='completed'?'✓':s.status==='planned'?'•':'…'}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={quickAdd.open} onClose={()=>setQuickAdd({open:false,date:''})} title={"New session · "+quickAdd.date}>
        <div className="grid">
          <button onClick={()=>create(quickAdd.date)}>Create & open</button>
        </div>
      </Modal>
    </div>
  )
}
