function CloseTopRightButton({
    width = 46,
    height = 46,
    classNames = "",
    onClickCallback = (() => { })
}) {

    return (
        <button className={`closeTopRightButton ${classNames}`}
            style={{
                position: "relative",
                float: "right",
                borderRadius: `50%`,
                top: `-${height / 2}px`,
                right: `-${width / 2}px`,
                color: "red",
                transform: "rotate(45deg)",
                width: "50px",
                height: "50px",
                textAlign: "center",
                fontSize: "30px",
                paddingBottom: "5px",
            }}
            onClick={(e) => { e.preventDefault(); onClickCallback(); }}
        >
            &#x271A;
        </button>
    );
}
export default CloseTopRightButton;