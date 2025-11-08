import { useEffect, useState, useRef } from "react";
import APITools from "./APITools";
import Placeholder from "../assets/images/placeholder.png";

function APIImage({
    path = '',
    query = {},
    alt="alt",
    cssClasses = "",
    cssStyle = {},
    timestamp = "" // refresh purpose
}) {
    const componentRef = useRef(null);
    const [imageData, setImageData] = useState("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchImage();
                    observer.disconnect();
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            }
        );

        if (componentRef.current) {
            observer.observe(componentRef.current);
        }

        return () => {
            if (componentRef.current) {
                observer.unobserve(componentRef.current);
            }
        };
    }, [path, timestamp]);

    const fetchImage = async () => {
        if (path.length > 0) {
            const response = await APITools.fetchMedia({ path: path, query: query });
            setImageData(response.mediaURL);
        }
    };


    return (
        <div ref={componentRef}>
            {imageData === "" ?
                <img src={Placeholder} 
                    className={cssClasses} 
                    style={cssStyle} 
                    alt={alt}
                />
                :
                <img src={imageData} 
                    className={cssClasses} 
                    style={cssStyle} 
                    alt={alt}
                />
            }
        </div>
    );
}
export default APIImage;