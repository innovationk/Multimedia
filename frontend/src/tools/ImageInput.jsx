import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const ImageInput = forwardRef(function ImageInput({
    // initValue = false,
    placeholder = ""
}, ref) {
    const [image, setimage] = useState("");
    const [previewimage, setpreviewimage] = useState("");

    useImperativeHandle(ref, () => ({
        isEmpty,
        getValue,
        // setValue
    }));
    const isEmpty = () => { return image.length === 0; };
    const getValue = () => { return image; };

    // useEffect(() => {
    //     setValue(initValue);
    // }, [initValue]);

    return (
        <div style={{ width: "100%" }}>
            {placeholder.length > 0 &&
            <div>
                <label>
                    {placeholder}
                </label>
            </div>
            }
            <input
                type="file"
                onChange={(e) => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setimage(reader.result);
                    };
                    reader.readAsDataURL(file);
                    setpreviewimage(URL.createObjectURL(e.target.files[0]));
                }}
                style={{ width: "100%" }}
                accept="image/png, image/jpeg"
            />
            {previewimage.length > 0 &&
                <img src={previewimage} style={{
                    width: "100%",
                    marginTop: "4px",
                    borderRadius: "4px"
                }} />
            }
        </div>
    );
});
export default ImageInput;