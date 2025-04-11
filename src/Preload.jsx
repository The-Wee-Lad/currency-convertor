import { useEffect, useState } from 'react';
import App from './App.jsx';
import { lightArray, darkArray } from './assets/index.js';

const allImages = [...lightArray, ...darkArray];

function Preload() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const loadImages = async () => {
            await Promise.all(
                allImages.map(
                    (src) =>
                        new Promise((resolve) => {
                            const img = new Image();
                            img.src = src;
                            img.onload = () => resolve();
                            img.onerror = () => resolve();
                        })
                )
            );
            setReady(true);
        };
        loadImages();
    }, []);

    if (!ready) {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-black text-white">
                Preloading Assets...
            </div>
        );
    }

    return <App />;
}

export default Preload;
