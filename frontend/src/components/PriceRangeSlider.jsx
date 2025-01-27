import { useCallback, useEffect, useState, useRef } from "react";

const cssValues = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    gap: "2px",
    paddingTop: "10px",
};
const PriceRangeSlider = ({ min, max, trackColor = "#cecece", onChange, rangeColor = "#ff0303", valueStyle = cssValues, width = "200px", currencyText = "$" }) => {

    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValueRef = useRef(min);
    const maxValueRef = useRef(max);
    const regeRef = useRef(null);

    const getPercent = useCallback((value) => Math.round(((value - min) / (max - min)) * 100), [min, max]);


    // set width of the renge to decrease/increase from the left side
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValueRef.current);
        if (regeRef.current) {
            regeRef.current.style.left = `${minPercent}%`;
            regeRef.current.style.width = `${maxPercent - minPercent}%`;
        } else {
            console.warn("Range ref is null");
        }
    }, [minVal, getPercent]);


    // set width of the renge to decrease/increase from the right side
    useEffect(() => {
        const minPercent = getPercent(minValueRef.current);
        const maxPercent = getPercent(maxVal);
        if (regeRef.current) {
            regeRef.current.style.left = `${minPercent}%`;
            regeRef.current.style.width = `${maxPercent - minPercent}%`;

        }
    }, [maxVal, getPercent]);

    // get min and max values when their state changes
    useEffect(() => {
        if (minVal != minValueRef.current || maxVal != maxValueRef.current) {
            onChange({ min: minVal, max: maxVal });
            minValueRef.current = minVal;
            maxValueRef.current = maxVal;
        }
    }, [minVal, maxVal, onChange]);


    return (
        <>
            <div className="w-full flex items-center justify-center flex-col space-y-14">
                {/* Display the min and max values */}
                <div className="w-[200px] flex items-center justify-between gap-x-5">
                    <p className="text-xl text-neutral-100 font-semibold" style={valueStyle}>
                        {currencyText} {minVal}
                    </p>

                    <div className="flex-1 border-deshed rounded border-gray-800 border-border-neutral-500 mt-2 bg-blue-gray-500 w-full h-2"></div>

                    <p className="text-xl text-neutral-100 font-semibold" style={valueStyle}>
                        {currencyText} {maxVal}
                    </p>
                </div>

                {/* style the custom price renge slider */}
                <div className="price_renge_slider" style={{ width }}>
                    <input type="range"
                        min={min}
                        max={max}
                        value={minVal}
                        onChange={(e) => {
                            const value = Math.min(Number(e.target.value), maxVal - 1);

                            setMinVal(value);
                        }}
                        className="thumb thumb-left"
                        style={{
                            width,
                            zIndex: minVal > max - 100 || minVal === maxVal ? 5 : undefined
                        }}
                    />
                    <input type="range"
                        min={min}
                        max={max}
                        value={maxVal}
                        onChange={(e) => {
                            const value = Math.max(Number(e.target.value), minVal + 1);

                            setMaxVal(value);
                        }}
                        className="thumb thumb-right"
                        style={{
                            width,
                            zIndex: minVal > max - 100 || minVal === maxVal ? 4 : undefined
                        }}
                    />

                    <div className="slider">
                        <div className="track-slider" style={{ backgroundColor: trackColor }} />
                        <div ref={regeRef} className="range-slider" style={{ backgroundColor: rangeColor }}
                        />

                    </div>
                </div>
            </div>
        </>
    )
}

export default PriceRangeSlider
