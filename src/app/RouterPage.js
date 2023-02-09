import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import LayoutReport from 'src/layout/LayoutReport'
import RPContact from 'src/features/Reports/pages/RP-Contact'
import ContactList from 'src/features/Reports/pages/RP-Contact/pages/ContactList'

function RouterPage(props) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LayoutReport>
            <RPContact />
          </LayoutReport>
        }
      >
        <Route index element={<ContactList />} />
      </Route>
      {!window?.isDesktop && (
        <Route
          path="/Rcontact/index.html"
          element={<Navigate to="/" replace />}
        />
      )}
    </Routes>
  )
}

export default RouterPage
