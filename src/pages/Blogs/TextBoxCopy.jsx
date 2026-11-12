import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./AddBlog.module.scss";
import "./TextBox.scss";

// Custom fonts
const customFonts = ["serif", "arial", "Helvetica", "Helvetica-Neue", "Intercom"];

// Add custom fonts to Quill
const Font = ReactQuill.Quill.import("formats/font");
Font.whitelist = customFonts;
ReactQuill.Quill.register(Font, true);

const TextBox = ({ id, updateBoxData, removeBox, initialData }) => {
	const [content, setContent] = useState(initialData || "");

	useEffect(() => {
		if (initialData) {
			setContent(initialData);
		}
	}, [initialData]);

	useEffect(() => {
		updateBoxData(id, content);
	}, [content]);

	const modules = {
		toolbar: [
			[{ font: customFonts }],
			[{ header: "1" }, { header: "2" }],
			[{ list: "ordered" }, { list: "bullet" }],
			["bold", "italic", "underline", "strike"],
			[{ color: [] }, { background: [] }],
			["link"],
			["clean"],
		],
	};

	const formats = ["header", "font", "list", "bullet", "bold", "italic", "underline", "strike", "color", "background", "link"];

	return (
		<div className={styles.TextBox}>
			<div className={styles.Remove} onClick={() => removeBox(id)}>
				<RxCross2 size={"2rem"} color="#fff" />
			</div>
            <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} />
            
		</div>
	);
};

export default TextBox;
