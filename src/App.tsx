import React, {ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState} from 'react'
import Maze from './components/script';
import './App.css'

function App() {
    const mazeElementRef = React.useRef(null);
    const infoElementRef = React.useRef(null);
    const [heightInput, setHeightInput] = useState(100);
    const [widthInput, setWidthInput] = useState(100);
    const [isRunning, setIsRunning] = useState(false)
    const mazeInstanceRef = useRef<Maze>();

    const createNewMazeInstance = () => {
        if (mazeElementRef.current && infoElementRef.current) {
            mazeInstanceRef.current = new Maze(Number(widthInput), Number(heightInput), mazeElementRef.current, infoElementRef.current, () => {
                setIsRunning(false)
            });
        }
    }

    const start = () => {
        if (isRunning) {
            setIsRunning(false);
            mazeInstanceRef.current?.stop();
        } else {
            createNewMazeInstance()
            mazeInstanceRef.current?.start();
            setIsRunning(true);
        }
    };

    const form_submitted = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        start()
    }

    useMemo(() => {
        createNewMazeInstance()
    }, [heightInput, widthInput]);

    return (
        <>
            <h1 className="text-5xl font-bold m-2 font-mono text-blue-500">
                maze_ts
            </h1>
            <div className="flex justify-center mt-5">
                <form className="border border-blue-300 p-4 rounded shadow-lg flex h-fit" onSubmit={form_submitted}>
                    <div className={`${isRunning && 'opacity-50'} transition`}>
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
                                    disabled={isRunning}

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
                                    disabled={isRunning}

                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <input
                            type="submit"
                            className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-1 h-full ml-2 h-[115px]"
                            value={isRunning ? 'Click to stop' : mazeInstanceRef.current ? 'Click to restart' : 'Click to start'}
                        />
                    </div>
                </form>
            </div>

            <div className='flex justify-center m-12'>
                <div className='grid-rows-1 gap-4 bg-blue-200 rounded p-5 border border-blue-500'>
                    <div className='flex justify-center'>
                        <div ref={infoElementRef} className='text-left font-mono'>Waiting :)</div>
                    </div>
                    <div className='flex justify-center mt-8'>
                        <canvas ref={mazeElementRef} className='border border-black' width={widthInput}
                                height={heightInput}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
