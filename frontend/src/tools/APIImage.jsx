// import { useEffect, useRef, useState } from 'react';
// import APITools from './APITools';
// import PlaceholderImg from '../../../assets/images/placeholder.png';

// export default function APIImage({}) {
//     const [image, setImage] = useState(PlaceholderImg);

//     useEffect(() => {
//         fetchImage();
//     });

//     const fetchImage = async () => {
//         const fetched = await APITools.fetchImage({
//             uriPath: `/api/videos/mux/${muxPlaybackId}/thumbnail`,
//         });

//     };

//     return (
//         <img
//             src={image}
//             alt="Video thumbnail"
//             className={``}
//         />
//     )
// }