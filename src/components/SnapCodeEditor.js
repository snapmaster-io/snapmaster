import React from 'react'
import MonacoEditor from 'react-monaco-editor'

const SnapCodeEditor = ({definition, setDefinition}) =>
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

export default SnapCodeEditor