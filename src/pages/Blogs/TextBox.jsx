import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import styles from "./AddBlog.module.scss";

// Custom fonts
const customFonts = ["serif", "arial", "Helvetica", "Helvetica-Neue", "Intercom"];

// Add custom fonts to Quill
const Font = ReactQuill.Quill.import("formats/font");
Font.whitelist = customFonts;
ReactQuill.Quill.register(Font, true);

// Define the custom 'custom_span' format that supports 'id' attribute
const Quill = ReactQuill.Quill;
const Inline = Quill.import("blots/inline");

class CustomSpanBlot extends Inline {
	static create(value) {
		let node = super.create();
		node.setAttribute("id", value); // Add id attribute
		node.classList.add("custom-tag"); // Add custom class for styling
		return node;
	}

	static formats(node) {
		return node.getAttribute("id"); // Get the id attribute
	}

	format(name, value) {
		if (name === "id" && value) {
			this.domNode.setAttribute("id", value); // Set id attribute
			this.domNode.classList.add("custom-tag");
		} else {
			super.format(name, value);
		}
	}
}

CustomSpanBlot.blotName = "custom_span"; // Use a unique blot name
CustomSpanBlot.tagName = "span";
Quill.register(CustomSpanBlot); // Register the custom format

const TextBox = ({ id, updateBoxData, removeBox, initialData, handleUpdateTitleId, type, handleUpdateTitleIdFromUpdate }) => {
	const [content, setContent] = useState(initialData || "");
	const quillRef = useRef(null);

	useEffect(() => {
		if (initialData) {
			setContent(initialData);
		}
	}, [initialData]);

	useEffect(() => {
		updateBoxData(id, content);
	}, [content]);

	useEffect(() => {
		const quill = quillRef.current?.getEditor();
		if (quill) {
			// Ensure all custom span elements with ids are styled properly
			const spanElements = quill.root.querySelectorAll("span[id]");
			spanElements.forEach((span) => {
				span.classList.add("custom-tag");
			});
		}
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

	const formats = [
		"header",
		"font",
		"list",
		"bullet",
		"bold",
		"italic",
		"underline",
		"strike",
		"color",
		"background",
		"link",
		"custom_span", // Add the custom format
	];

	// Function to insert tag and update title-ids
	const insertTag = () => {
		const quill = quillRef.current.getEditor();
		quill.focus();
		const range = quill.getSelection();

		if (range && range.length > 0) {
			const tagId = prompt("Enter Tag ID (e.g., tag1, tag2):");

			const selectedText = quill.getText(range.index, range.length); // Get the selected text
			if (tagId && selectedText) {
				// Apply the custom 'custom_span' format with the given id
				quill.formatText(range.index, range.length, "custom_span", tagId);

				// Ensure the formatting is applied before updating title-ids
				if (type === "add") {
					setTimeout(() => {
						// Pass the selected title and id to the parent component
						handleUpdateTitleId(selectedText, tagId);
					}, 0);
				} else {
					setTimeout(() => {
						// Pass the selected title and id to the parent component
						handleUpdateTitleIdFromUpdate(selectedText, tagId);
					}, 0);
				}
			}
		} else {
			toast.warn("Please select some text to tag.");
		}
	};

	return (
		<div className={styles.TextBox}>
			<div className={styles.Remove} onClick={() => removeBox(id)}>
				<RxCross2 size={"2rem"} color="#fff" />
			</div>
			<div className={styles.AddTag} onClick={insertTag}>
				Add Id
			</div>
			<ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} />
		</div>
	);
};

export default TextBox;
