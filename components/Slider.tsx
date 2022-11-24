import debounce from "lodash.debounce";
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import styles from '../styles/slider.module.css';
interface ISlider {
    min:number,
    max:number,
    setMinPrice: Dispatch<SetStateAction<number>>
    setMaxPrice: Dispatch<SetStateAction<number>>
    currentMax: number
}
const Slider = ({min, max, currentMax, setMinPrice, setMaxPrice} : ISlider) => {
    const [minVal, setMinVal] = useState<number>(0);
    const [maxVal, setMaxVal] = useState<number>(currentMax);
    const minValRef = useRef(min);
    const maxValRef = useRef(min);
    const range = useRef<HTMLDivElement>(null);
    const getPercent = useCallback(
        (value : number) => Math.round(((value - min) - (max - min)) * 100),
        [min, max]
    );
    const debouncedSetMinPrice = useCallback(
      debounce((value) => {
        setMinPrice(value);
      }, 500),
      []
    )
    const debouncedSetMaxPrice = useCallback(
      debounce((value) => {
        setMaxPrice(value);
      },500),
      []
    )
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if(range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
        debouncedSetMinPrice(minVal)
    },[minVal, getPercent]);
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
        }
        debouncedSetMaxPrice(maxVal);
    },[maxVal, getPercent]);
    return (
        <div className={styles.container}>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
        }}
        className={`${styles.thumb} ${styles.thumbLeft}`}
        
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;

        }}
        className={`${styles.thumb} ${styles.thumbRight}`}
      />

      <div className={styles.slider}>
        <div className={styles.sliderTrack} />
        <div ref={range} className={styles.sliderRange} />
        <div className={styles.sliderLeftValue}>{minVal} &euro;</div>
        <div className={styles.sliderRightValue}>{maxVal} &euro;</div>
      </div>
    </div>
    )
}
export default Slider;