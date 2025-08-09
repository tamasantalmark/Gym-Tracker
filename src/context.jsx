import React, { createContext, useContext, useMemo, useState } from 'react'
import * as api from './lib/api'

const Ctx = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState(api.bootstrap())

  const actions = useMemo(() => ({
    createSession: (payload) => {
      const id = api.createSession(payload)
      setState(api.bootstrap())
      return id
    },
    updateSession: (id, patch) => {
      api.updateSession(id, patch); setState(api.bootstrap())
    },
    deleteSession: (id) => { api.deleteSession(id); setState(api.bootstrap()) },
    addExerciseToSession: (sessionId, exerciseId) => {
      api.addExerciseToSession(sessionId, exerciseId); setState(api.bootstrap())
    },
    reorderExercises: (sessionId, newOrder) => {
      api.reorderExercises(sessionId, newOrder); setState(api.bootstrap())
    },
    addSet: (sessionExerciseId, setData) => {
      api.addSet(sessionExerciseId, setData); setState(api.bootstrap())
    },
    updateSet: (setId, patch) => { api.updateSet(setId, patch); setState(api.bootstrap()) },
    deleteSet: (setId) => { api.deleteSet(setId); setState(api.bootstrap()) },
    createTemplateFromSession: (sessionId, name) => {
      api.createTemplateFromSession(sessionId, name); setState(api.bootstrap())
    },
    applyTemplate: (templateId, date) => {
      const id = api.applyTemplate(templateId, date); setState(api.bootstrap()); return id
    },
    createExercise: (payload) => { const id = api.createExercise(payload); setState(api.bootstrap()); return id },
    deleteTemplate: (id) => { api.deleteTemplate(id); setState(api.bootstrap()) },
    setSettings: (patch) => { api.setSettings(patch); setState(api.bootstrap()) },
    resetAll: () => { api.resetAll(); setState(api.bootstrap()) }
  }), [])

  return <Ctx.Provider value={{ state, ...actions }}>{children}</Ctx.Provider>
}

export function useApp() {
  return useContext(Ctx)
}
