"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import Lenis from "lenis"

export const NewPage = ({ children }) => {
    useEffect(() => {
        const root = document.getElementById("root");
        root?.style.setProperty("width", "100vw");
        root?.style.setProperty("height", "100vh");
        root?.style.setProperty("box-sizing", "border-box");
        root?.style.setProperty("overflow", "hidden");
    }, []);

    return <div style={{ width: "100%", height: "100%" }}>{children}</div>;
};


export type DivProperties = {
    width? : string,
    height? : string,
    color? : string,
    padding? : string,
    gap? : string,
    style? : React.CSSProperties,
    children? : React.ReactNode,
    state? : number,
    layouts? : React.CSSProperties[]
}

export const VerticalDiv = ({
    width = "100%",
    height = "100%",
    color = "rgba(0, 0, 0, 0)",
    padding = "1rem",
    gap = "1rem",
    style = {},
    children,
    state= 0,
    layouts = [],
} : DivProperties ) => {
    const mainStyle = useMemo(() : React.CSSProperties => ({
        flexShrink: width.includes("px") || width.includes("vw") ? 0 : 1, // Don't shrink fixed-width divs
        width : width,
        minWidth: width.includes("px") ? width : "auto", // Ensure fixed widths are respected
        height,
        minHeight: height.includes("px") || height.includes("vw") ? width : "auto", // Ensure fixed widths are respected
        display: "flex",
        flexDirection: "column",
        backgroundColor: color,
        overflowY: "auto",
        scrollbarWidth: "none", // padding: "1rem",
        boxSizing: "border-box",
        gap: gap,
        border: `${padding} solid ${color}`,
        ...style,
    }), [width, height, color, gap, padding, style]);

    const [styleState, setStyleState] = useState({
        ...mainStyle,
        ...layouts[state],
    });

    const [isTransitioning, setIsTransitioning] = useState(state);

    useEffect(() => {
        setIsTransitioning(state);
    }, [state]);

    useEffect(() => {
        setStyleState({
            ...mainStyle,
            ...layouts[state],
        });

    }, [isTransitioning]);

    const scrollableRef = useRef(null);

    useEffect(() => {
        if(!scrollableRef?.current){
            return;
        }

        const lenis = new Lenis({
            wrapper: scrollableRef.current, // Target the div
            content: scrollableRef.current, // if your children are direct
            // you can also point at a nested ref
            orientation: "vertical",
            gestureOrientation: "vertical",
            autoRaf : true
        });

        // function raf(time) {
        //     lenis.raf(time);
        //     requestAnimationFrame(raf);
        // }
        // requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    });

    return (
        <div
            ref={scrollableRef}
            style={{
                ...styleState,
            }}
        >
            {children || null}
        </div>
    );
};


export const HorizontalDiv = ({
    width = "100%",
    height = "100%",
    color = "rgba(0, 0, 0, 0)",
    padding = "1rem",
    gap = "1rem",
    style = {},
    children,
    state = 0,
    layouts = [],
} : DivProperties) => {


    const mainStyle = useMemo(() : React.CSSProperties => ({
        flexShrink: width.includes("px") ? 0 : 1, // Don't shrink fixed-width divs
        width : width,
        minWidth: width.includes("px") ? width : "auto", // Ensure fixed widths are respected
        height,
        minHeight: height.includes("px") ? width : "auto", // Ensure fixed widths are respected
        display: "flex",
        flexDirection: "row",
        backgroundColor: color,
        overflowY: "auto",
        scrollbarWidth: "none", // padding: "1rem",
        boxSizing: "border-box",
        gap: gap,
        border: `${padding} solid ${color}`,
        ...style,
    }), [width, height, color, gap, padding, style]);


    const [styleState, setStyleState] = useState({
        ...mainStyle,
        ...layouts[state],
    });

    const [isTransitioning, setIsTransitioning] = useState(state);

    useEffect(() => {
        setIsTransitioning(state);
    }, [state]);

    const scrollableRef = useRef(null);

    useEffect(() => {
        if(!scrollableRef?.current){
            return;
        }

        const lenis = new Lenis({
            wrapper: scrollableRef.current, // Target the div
            content: scrollableRef.current, // if your children are direct
            // you can also point at a nested ref
            orientation: "vertical",
            gestureOrientation: "vertical",
            autoRaf: true
        });

        

        return () => {
            lenis.destroy();
        };
    });

    useEffect(() => {
        setStyleState({
            ...mainStyle,
            ...layouts[isTransitioning],
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

