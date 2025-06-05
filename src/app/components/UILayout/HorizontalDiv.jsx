"use client";
import { useRef, useEffect, useState } from "react";
// import Lenis from "lenis";

const HorizontalDiv = ({
    width = "100%",
    height = "100%",
    color = "rgba(0, 0, 0, 0)",
    padding = "1rem",
    gap = "1rem",
    style = {},
    children,
    playAnimation = 0,
    state = [{}],
}) => {
    const mainStyle = {
        flexShrink: width.includes("px") ? 0 : 1, // Don't shrink fixed-width divs
        width,
        minWidth: width.includes("px") ? width : "auto", // Ensure fixed widths are respected
        height,
        minHeight: height.includes("px") ? width : "auto", // Ensure fixed widths are respected
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: color,
        overflowX: "auto",
        overflowY: "hidden",
        gap: gap,
        // padding: "1rem",
        border: `${padding} solid ${color}`,
        boxSizing: "border-box",
        ...style,
    };
    const [styleState, setStyleState] = useState({
        ...mainStyle,
        ...state[playAnimation],
    });

    const [isTransitioning, setIsTransitioning] = useState(playAnimation);

    useEffect(() => {
        setIsTransitioning(playAnimation);
    }, [playAnimation]);

    const scrollableRef = useRef(null);

    // useEffect(() => {
    //     const lenis = new Lenis({
    //         wrapper: scrollableRef.current, // Target the div
    //         content: scrollableRef.current, // if your children are direct
    //         // you can also point at a nested ref
    //         orientation: "vertical",
    //         gestureOrientation: "vertical",
    //         smooth: true,
    //     });

    //     function raf(time) {
    //         lenis.raf(time);
    //         requestAnimationFrame(raf);
    //     }
    //     requestAnimationFrame(raf);

    //     return () => {
    //         lenis.destroy();
    //     };
    // });

    useEffect(() => {
        setStyleState({
            ...mainStyle,
            ...state[isTransitioning],
        });
    }, [isTransitioning]);

    return (
        <div
            style={{
                ...styleState,
            }}
            ref={scrollableRef}
        >
            {children || null}
        </div>
    );
};

export default HorizontalDiv;
