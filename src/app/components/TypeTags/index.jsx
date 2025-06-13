import "./Tag.css";
import { getFileType } from "@/lib/client/getFileType";

export const Bundle = ({ layout = true }) => {
    return (
        <div className={`tag bundle ${!layout ? "small" : ""}`}>
            <div className="marker" />
            <div className={`text ${layout ? "" : "small"}`}>Bundle</div>
        </div>
    );
};

export const Document = ({ layout = true }) => {
    return (
        <div className={`tag doc ${!layout ? "small" : ""}`}>
            <div className="marker" />
            <div className={`text ${layout ? "" : "small"}`}>Document</div>
        </div>
    );
};

export const Recording = ({ layout = true }) => {
    return (
        <div className={`tag rec ${!layout ? "small" : ""}`}>
            <div className="marker" />
            <div className={`text ${layout ? "" : "small"}`}>Recording</div>
        </div>
    );
};

export const Note = ({ layout = true }) => {
    return (
        <div className={`tag note ${!layout ? "small" : ""}`}>
            <div className="marker" />
            <div className={`text ${layout ? "" : "small"}`}>Note</div>
        </div>
    );
};

export const Img = ({ layout = true }) => {
    return (
        <div className={`tag img ${!layout ? "small" : ""}`}>
            <div className="marker" />
            <div className={`text ${layout ? "" : "small"}`}>Image</div>
        </div>
    );
};

export const FileType = (filename, layout) => {
    const fileType = getFileType(filename);
    switch (fileType) {
        case "Bundle":
            return <Bundle layout={layout} />;
        case "Document":
            return <Document layout={layout} />;
        case "Image":
            return <Img layout={layout} />;
        case "Note":
            return <Note layout={layout} />;
        case "Recording":
            return <Recording layout={layout} />;
        default:
            return <p>Type ?</p>;
    }
};
