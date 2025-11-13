import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function APIDownloadButton({
    downloadUrl="",
    title="lorem",
    extension="png",
    classNames="",
}) {
    const { t, i18n } = useTranslation();

    const [progress, setProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
    setIsDownloading(true);
    setProgress(0);

        try {
            const response = await fetch(downloadUrl, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            const reader = response.body.getReader();
            const contentLength = +response.headers.get('Content-Length');
            let receivedLength = 0;
            const chunks = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                receivedLength += value.length;
                setProgress((receivedLength / contentLength) * 100);
            }

            const blob = new Blob(chunks);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title}.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
        } catch (err) {
            console.error('Download error:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    return(
    <div>
        <button onClick={handleDownload} disabled={isDownloading} className={`${classNames}`}>
            {isDownloading ? 'Downloading...' : <>
                <svg fill="#000000" xmlns="http://www.w3.org/2000/svg" 
                    width="25px" height="25px" viewBox="0 0 52 52">
                <g>
                    <path d="M48.5,31h-3c-0.8,0-1.5,0.7-1.5,1.5v10c0,0.8-0.7,1.5-1.5,1.5h-33C8.7,44,8,43.3,8,42.5v-10
                        C8,31.7,7.3,31,6.5,31h-3C2.7,31,2,31.7,2,32.5V46c0,2.2,1.8,4,4,4h40c2.2,0,4-1.8,4-4V32.5C50,31.7,49.3,31,48.5,31z"/>
                    <path d="M25,37.6c0.6,0.6,1.5,0.6,2.1,0l13.5-13.5c0.6-0.6,0.6-1.5,0-2.1l-2.1-2.1c-0.6-0.6-1.5-0.6-2.1,0l-5.6,5.6
                        c-0.6,0.6-1.7,0.2-1.7-0.7V3.5C29,2.7,28.2,2,27.5,2h-3C23.7,2,23,2.7,23,3.5v21.2c0,0.9-1.1,1.3-1.7,0.7l-5.6-5.6
                        c-0.6-0.6-1.5-0.6-2.1,0L11.5,22c-0.6,0.6-0.6,1.5,0,2.1L25,37.6z"/>
                </g>
                </svg>
            </>}
        </button>
        {isDownloading && (
            <div>
                <progress value={progress} max="100" />
                <span>{Math.round(progress)}%</span>
            </div>
        )}
    </div>
    );
}
export default APIDownloadButton;