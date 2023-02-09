import React from 'react'

function LayoutReport({ children }) {
  return (
    <div className="px-main pt-55px position-relative h-100">
      {/* <NavBar /> */}
      <div className="container-fluid p-0 h-100">{children}</div>
    </div>
  )
}

export default LayoutReport
