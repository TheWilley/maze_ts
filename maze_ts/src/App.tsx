import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import Maze from './components/script';
import './App.css'
import React from 'react';

function App() {
  const mazeRef = React.useRef(null);
  const infoRef = React.useRef(null);
  const [heightInput, setHeightInput] = useState(100);
  const [widthInput, setWidthInput] = useState(100);
  const [running, setRunning] = useState(false)
  const [runnedFirstTime, setRunnedFirstTime] = useState(false)
  const mazeInstanceRef = useRef<Maze>();

  useEffect(() => {
    mazeInstanceRef.current = new Maze(Number(widthInput), Number(heightInput), mazeRef.current, infoRef.current, () => {
      setRunning(false);
    });
  }, [heightInput, widthInput]);

  const start = () => {
    // Create new instance
    const mazeInstance = mazeInstanceRef.current;

    // Return if no instance is found
    if (!mazeInstance) return

    // Check if we should start ot stop maze
    if (running) {
      setRunning(false);
      mazeInstance.stop();
      setRunnedFirstTime(true)
    } else {
      mazeInstance.start();
      setRunning(true);
    }
  };

  const form_submitted = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    start()
  }

  const checkWidthAndHeight = () => {
    if (widthInput > 1000) {
      setWidthInput(1000)
    }

    if (heightInput > 1000) {
      setHeightInput(1000)
    }
  }

  return (
    <>
      <h1 className="text-5xl font-bold m-2 font-mono text-blue-500">
        maze_ts
      </h1>
      <div className="flex justify-center mt-5">
        <form className="border border-blue-300 p-4 rounded shadow-lg flex h-fit" onSubmit={form_submitted}>
          <div className={`${running && 'opacity-50'} transition`}>
            <div className="flex flex-col justify-center border border-stone-100 shadow-md p-3 m-2 rounded">
              <label htmlFor="heightInput" className="text-blue-gray-700 font-medium mb-1">Height</label>
              <div className="relative">
                <input
                  required
                  type="number"
                  id="heightInput"
                  className="border border-blue-200 rounded bg-transparent w-14 text-center"
                  placeholder=" "
                  min="100"
                  max="1000"
                  value={heightInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setHeightInput(Number(e.target.value))}
                  disabled={running}
                  onKeyDown={checkWidthAndHeight}

                />
              </div>
            </div>
            <div className="flex flex-col justify-center border border-stone-100 shadow-md p-3 m-2 rounded">
              <label htmlFor="widthInput" className="text-blue-gray-700 font-medium mb-1">Width</label>
              <div className="relative">
                <input
                  required
                  type="number"
                  id="widthInput"
                  className="border border-blue-200 rounded bg-transparent w-14 text-center"
                  placeholder=" "
                  min="100"
                  max="1000"
                  value={widthInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setWidthInput(Number(e.target.value))}
                  disabled={running}
                  onKeyDown={checkWidthAndHeight}

                />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <input
              type="submit"
              className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-1 h-full ml-2 h-[115px]"
              value={running ? 'Click to stop' : runnedFirstTime ? 'Click to restart' : 'Click to start'}
            />
          </div>
        </form>
      </div>

      <div className='flex justify-center m-12'>
        <div className='grid-rows-1 gap-4 bg-blue-200 rounded p-5 border border-blue-500'>
          <div className='flex justify-center'>
            <div ref={infoRef} className='text-left font-mono'>Waiting :)</div>
          </div>
          <div className='flex justify-center mt-8'>
            <canvas ref={mazeRef} className='border border-black' width={widthInput} height={heightInput} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
