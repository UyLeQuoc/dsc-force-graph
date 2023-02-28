import MainFooter from "../components/common/MainFooter"
import MainHeader from "../components/common/MainHeader"
import LoginPage from "../components/LoginPage"
import { useScrollPosition } from "../hook/useScrollPosition"
import {useState, useMemo} from "react"

function Login() : JSX.Element {
  const [hideOnScroll, setHideOnScroll] = useState(true)

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y
      if (isShow !== hideOnScroll) setHideOnScroll(isShow)
    },
    [hideOnScroll],
    false,
    false,
    300
  )

  return useMemo(() => (
    <>
      <MainHeader show={hideOnScroll}/>
      <LoginPage />
      <MainFooter />
    </>
  ), [hideOnScroll])
}

export default Login