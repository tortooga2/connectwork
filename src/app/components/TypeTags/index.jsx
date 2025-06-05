import "./Tag.css";
import getFileType from "@/lib/client/getFileType";

export const Bundle = ({ layout = true }) => {
    return (
        <div className={`tag bundle ${!layout ? "small" : ""}`}>
            <div className="marker" />
            {layout ? <div className="text">Bundle</div> : null}
        </div>
    );
};

export const Document = ({ layout = true }) => {
    return (
        <div className={`tag doc ${!layout ? "small" : ""}`}>
            <div className="marker" />
            {layout ? <div className="text">Document</div> : null}
        </div>
    );
};

export const Recording = ({ layout = true }) => {
    return (
        <div className={`tag rec ${!layout ? "small" : ""}`}>
            <div className="marker" />
            {layout ? <div className="text">Recording</div> : null}
        </div>
    );
};

export const Note = ({ layout = true }) => {
    return (
        <div className={`tag note ${!layout ? "small" : ""}`}>
            <div className="marker" />
            {layout ? <div className="text">Note</div> : null}
        </div>
    );
};

export const Img = ({ layout = true }) => {
    return (
        <div className={`tag img ${!layout ? "small" : ""}`}>
            <div className="marker" />
            {layout ? <div className="text">Image</div> : null}
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
