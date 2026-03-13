import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import RouteLoader from './components/layout/RouteLoader'
import ScrollToTop from './components/layout/ScrollToTop'
import SiteLayout from './components/layout/SiteLayout'

const AboutPage = lazy(() => import('./pages/AboutPage'))
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const MethodologyPage = lazy(() => import('./pages/MethodologyPage'))
const SimulatorPage = lazy(() => import('./pages/SimulatorPage'))

function LazyPage(props) {
  const Component = props.component

  return (
    <Suspense fallback={<RouteLoader />}>
      <Component />
    </Suspense>
  )
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<LazyPage component={HomePage} />} />
          <Route
            path="/simulator"
            element={<LazyPage component={SimulatorPage} />}
          />
          <Route
            path="/methodology"
            element={<LazyPage component={MethodologyPage} />}
          />
          <Route
            path="/documentation"
            element={<LazyPage component={DocumentationPage} />}
          />
          <Route path="/about" element={<LazyPage component={AboutPage} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
