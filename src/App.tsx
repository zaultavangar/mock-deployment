import { useState } from 'react'
import './App.css'
import { CommandLine } from './commandLine/CommandLine'
import { Output } from './output/Output'
import { ModeIndicator } from './modeIndicator/ModeIndicator'

function App() {
  const [loadedFile, setLoadedFile] = useState<LoadedFileMap | null>(null); // an object representing the loaded file and its important properties
  const [mode, setMode] = useState<ModeString>('brief'); // the mode: brief or verbose
  const [history, setHistory] = useState<OutputMap[]>([]); // the history that holds each of the user's commands and its associated output

  return (
    <>
      <ModeIndicator
        mode={mode}
      />
      <CommandLine
        setMode={setMode}
        loadedFile={loadedFile}
        setLoadedFile={setLoadedFile}
        setHistory={setHistory}
        />
      <div className='output-container'>
        <Output
          history={history}
          mode={mode}
        />
      </div>
    </>

  )
}

export default App
