import { load, save } from './storage'

function uid() { return 'id-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36) }
function todayISO(d=new Date()){return d.toISOString().slice(0,10)}

const seedExercises = [
  { id: uid(), name: 'Bench Press', category: 'push', equipment: 'barbell', is_global: true, aliases: ['BP'] },
  { id: uid(), name: 'Squat', category: 'legs', equipment: 'barbell', is_global: true, aliases: [] },
  { id: uid(), name: 'Deadlift', category: 'pull', equipment: 'barbell', is_global: true, aliases: [] },
  { id: uid(), name: 'Overhead Press', category: 'push', equipment: 'barbell', is_global: true, aliases: ['OHP'] },
  { id: uid(), name: 'Lat Pulldown', category: 'pull', equipment: 'machine', is_global: true, aliases: [] },
]

const defaultState = () => ({
  user: { id: uid(), name: 'You', email: 'you@example.com', settings: { units: 'kg', theme: 'dark', notifications_enabled: false, weight_enabled: true }, created_at: Date.now(), updated_at: Date.now() },
  exercises: seedExercises,
  sessions: [],
  sessionExercises: [],
  sets: [],
  templates: [],
  templateExercises: [],
})

let db = load() || defaultState()

export function bootstrap(){ return db }

function persist(){ save(db) }

export function setSettings(patch){ db.user.settings = {...db.user.settings, ...patch}; db.user.updated_at = Date.now(); persist() }

export function createExercise(payload){
  const ex = { id: uid(), is_global: false, created_by: db.user.id, aliases: [], ...payload }
  db.exercises.push(ex); persist(); return ex.id
}

export function searchExercises(q){
  const s = q.trim().toLowerCase()
  if(!s) return db.exercises
  return db.exercises.filter(e => e.name.toLowerCase().includes(s) || (e.aliases||[]).some(a => a.toLowerCase().includes(s)))
}

export function createSession({ title='', date=todayISO(), start_time='', end_time='', status='planned', notes='' }){
  const s = { id: uid(), user_id: db.user.id, title, date, start_time, end_time, status, notes, created_at: Date.now(), updated_at: Date.now() }
  db.sessions.push(s); persist(); return s.id
}

export function updateSession(id, patch){
  const s = db.sessions.find(x => x.id === id); if(!s) return
  Object.assign(s, patch, { updated_at: Date.now() }); persist()
}
export function deleteSession(id){
  db.sessionExercises.filter(se=>se.session_id===id).forEach(se=>{
    db.sets = db.sets.filter(st=>st.session_exercise_id!==se.id)
  })
  db.sessionExercises = db.sessionExercises.filter(se=>se.session_id!==id)
  db.sessions = db.sessions.filter(x=>x.id!==id); persist()
}

export function addExerciseToSession(sessionId, exerciseId){
  const order = db.sessionExercises.filter(x=>x.session_id===sessionId).length
  const se = { id: uid(), session_id: sessionId, exercise_id: exerciseId, order_index: order, notes: '' }
  db.sessionExercises.push(se); persist(); return se.id
}

export function reorderExercises(sessionId, newOrder){
  newOrder.forEach((id, idx) => {
    const se = db.sessionExercises.find(x=>x.id===id && x.session_id===sessionId)
    if(se) se.order_index = idx
  })
  persist()
}

export function addSet(sessionExerciseId, setData){
  const order = db.sets.filter(s=>s.session_exercise_id===sessionExerciseId).length
  const st = { id: uid(), session_exercise_id: sessionExerciseId, set_index: order, reps: 0, weight: null, completed: false, rest_seconds: 0, ...setData }
  db.sets.push(st); persist(); return st.id
}

export function updateSet(id, patch){
  const st = db.sets.find(s=>s.id===id); if(!st) return
  Object.assign(st, patch); persist()
}

export function deleteSet(id){
  db.sets = db.sets.filter(s=>s.id!==id); persist()
}

export function createTemplateFromSession(sessionId, name){
  const t = { id: uid(), user_id: db.user.id, name, description: '', created_at: Date.now(), updated_at: Date.now() }
  db.templates.push(t)
  const ses = db.sessionExercises
    .filter(se=>se.session_id===sessionId)
    .sort((a,b)=>a.order_index-b.order_index)
  ses.forEach((se, idx)=>{
    const sets = db.sets
      .filter(st=>st.session_exercise_id===se.id)
      .sort((a,b)=>a.set_index-b.set_index)
    const te = {
      id: uid(),
      template_id: t.id,
      exercise_id: se.exercise_id,
      default_sets: sets.length || 1,
      default_reps: sets[0]?.reps || 10,
      default_weight: sets[0]?.weight ?? null,
      order_index: idx
    }
    db.templateExercises.push(te)
  })
  persist(); return t.id
}

export function applyTemplate(templateId, dateISO){
  const id = createSession({ date: dateISO, title: 'Session from template', status:'planned' })
  const exs = db.templateExercises.filter(te=>te.template_id===templateId).sort((a,b)=>a.order_index-b.order_index)
  exs.forEach(te=>{
    const seId = addExerciseToSession(id, te.exercise_id)
    for(let i=0;i<te.default_sets;i++){
      addSet(seId, { reps: te.default_reps, weight: te.default_weight })
    }
  })
  return id
}

export function deleteTemplate(id){
  db.templateExercises = db.templateExercises.filter(te=>te.template_id!==id)
  db.templates = db.templates.filter(t=>t.id!==id); persist()
}

export function resetAll(){ db = defaultState(); persist() }
