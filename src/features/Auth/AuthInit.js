import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { LayoutSplashScreen } from 'src/layout/_core/SplashScreen'

function AuthInit(props) {
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  const { Token } = useSelector(({ auth }) => ({
    Token: auth.Token
  }))

  useEffect(() => {
    async function requestUser() {
      // checkInfo(() => {
      //   dispatch(
      //     setProfile({
      //       Info: window.Info,
      //       Token: window.top.Token
      //     })
      //   )
      //   setShowSplashScreen(false)
      // })
      setShowSplashScreen(false)
    }

    if (!Token) {
      requestUser()
    } else {
      setShowSplashScreen(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{props.children}</>
}

export default AuthInit
