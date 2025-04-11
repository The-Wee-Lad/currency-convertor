import { useEffect, useState } from 'react';
import App from './App.jsx';

const allImages = [
    ...['2.jpg', '3.jpg', '4.jpg', '5.jpg', '1.jpg'],
    ...['7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '6.jpg']
];

function Preload() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const loadImages = async () => {
            await Promise.all(
                allImages.map(
                    (src) =>
                        new Promise((resolve) => {
                            const img = new Image();
                            img.src = `/${src}`;
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
                Pre Loading Assets...
            </div>
        );
    }

    return <App />;
}

export default Preload;
