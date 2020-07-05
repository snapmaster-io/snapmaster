import React, { Suspense } from 'react'
//import MonacoEditor from 'react-monaco-editor'
import Loading from '../components/Loading'
const MonacoEditor = React.lazy(() => import('react-monaco-editor'))

const SnapCodeEditor = ({definition, setDefinition}) =>
  <Suspense fallback={<Loading/>}>
    <MonacoEditor
      language="yaml"
      width="80vw"
      height="calc(100vh - 160px)"
      value={definition}
      onChange={ (newValue) => setDefinition(newValue) }
      options={{
        theme: 'vs-dark',
      }}
    />
  </Suspense>

export default SnapCodeEditor