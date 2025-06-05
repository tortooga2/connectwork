"use client";
import { useEffect } from "react";

const NewPage = ({ children }) => {
    useEffect(() => {
        const root = document.getElementById("root");
        root.style.setProperty("width", "100vw");
        root.style.setProperty("height", "100vh");
        root.style.setProperty("box-sizing", "border-box");
        root.style.setProperty("overflow", "hidden");
    }, []);


    



    return <div style={{ width: "100%", height: "100%" }}>{children}</div>;
};

export default NewPage;
