const Loader = () => {
    return (
    <div className="w-20 h-20 overflow-auto flex justify-center items-center">
        <svg className="w-5/6 h-5/6" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <g transform="rotate(0 50 50)">
            <rect x="40" y="28" rx="0" ry="0" width="20" height="2" fill="#115e59">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8s" repeatCount="indefinite"></animate>
            </rect>
            </g>
            <g transform="rotate(72 50 50)">
            <rect x="40" y="28" rx="0" ry="0" width="20" height="2" fill="#115e59">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6s" repeatCount="indefinite"></animate>
            </rect>
            </g>
            <g transform="rotate(144 50 50)">
            <rect x="40" y="28" rx="0" ry="0" width="20" height="2" fill="#115e59">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4s" repeatCount="indefinite"></animate>
            </rect>
            </g>
            <g transform="rotate(216 50 50)">
            <rect x="40" y="28" rx="0" ry="0" width="20" height="2" fill="#115e59">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.2s" repeatCount="indefinite"></animate>
            </rect>
            </g>
            <g transform="rotate(288 50 50)">
            <rect x="40" y="28" rx="0" ry="0" width="20" height="2" fill="#115e59">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
            </rect>
            </g>
        </svg>
    </div>
    )
}
export default Loader;