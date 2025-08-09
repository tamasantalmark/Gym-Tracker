import React from 'react'

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="modal" onClick={onClose}>
      <div className="panel" onClick={e=>e.stopPropagation()}>
        <div className="flex" style={{justifyContent:'space-between'}}>
          <h3>{title}</h3>
          <button className="ghost" onClick={onClose}>Close</button>
        </div>
        <div style={{marginTop:12}}>{children}</div>
        {footer ? <div style={{marginTop:12}}>{footer}</div> : null}
      </div>
    </div>
  )
}
