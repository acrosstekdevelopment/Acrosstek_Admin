import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import FooterBG from "../../assets/images/FooterBG.webp";
import styles from "./AddBlog.module.scss";

const ImageBox = ({ id, initialData, updateBoxData, removeBox }) => {
	const inputRef = useRef();
	const [altText, setAltText] = useState("");
	const [imageFile, setImageFile] = useState(null);
	const [base64Image, setBase64Image] = useState("");

	// Update base64Image and altText if initialData contains image info
	useEffect(() => {
		if (initialData) {
			const parser = new DOMParser();
			const doc = parser.parseFromString(initialData, "text/html");
			const img = doc.querySelector("img");

			if (img) {
				setBase64Image(img.src);
				setAltText(img.alt || "");
			}
		}
	}, [initialData]);

	useEffect(() => {
		const imageData = `<img src="${base64Image}" alt="${altText}" />`;
		updateBoxData(id, imageData);
	}, [base64Image, altText, id, updateBoxData]);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64String = reader.result;
				setBase64Image(base64String);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className={styles.ImageBox}>
			<div className={styles.Remove} onClick={() => removeBox(id)}>
				<RxCross2 size={"2rem"} color="#fff" />
			</div>
			<div className={styles.Image}>
				<img src={base64Image || (imageFile ? URL.createObjectURL(imageFile) : FooterBG)} alt={altText} />
				<input type="file" ref={inputRef} style={{ display: "none" }} onChange={handleFileChange} />
				<button onClick={() => inputRef?.current?.click()}>Add Or Change Image</button>
			</div>

			<div className={styles.ImageText}>
				<label>Alt Text:</label>
				<input type="text" placeholder="ALT Text" value={altText} onChange={(e) => setAltText(e.target.value)} />
			</div>
		</div>
	);
};

export default ImageBox;

// import React, { useEffect, useRef, useState } from "react";
// import { RxCross2 } from "react-icons/rx";
// import FooterBG from "../../assets/images/FooterBG.webp";
// import styles from "./AddBlog.module.scss";

// const ImageBox = ({ id, updateBoxData, removeBox }) => {
// 	const inputRef = useRef();
// 	const [altText, setAltText] = useState("");
// 	const [imageFile, setImageFile] = useState(null);
// 	const [base64Image, setBase64Image] = useState("");

// 	useEffect(() => {
// 		const imageData = `<img src="${base64Image}" alt="${altText}" />`;
// 		updateBoxData(id, imageData);
// 	}, [base64Image, altText, id, updateBoxData]);

// 	const handleFileChange = (e) => {
// 		const file = e.target.files[0];
// 		if (file) {
// 			setImageFile(file);
// 			const reader = new FileReader();
// 			reader.onloadend = () => {
// 				const base64String = reader.result;
// 				setBase64Image(base64String);
// 			};
// 			reader.readAsDataURL(file);
// 		}
// 	};

// 	return (
// 		<div className={styles.ImageBox}>
// 			<div className={styles.Remove} onClick={() => removeBox(id)}>
// 				<RxCross2 size={"2rem"} color="#fff" />
// 			</div>
// 			<div className={styles.Image}>
// 				<img src={imageFile ? URL.createObjectURL(imageFile) : FooterBG} alt={altText} />
// 				<input type="file" ref={inputRef} style={{ display: "none" }} onChange={handleFileChange} />
// 				<button onClick={() => inputRef?.current?.click()}>Add Or change Image</button>
// 			</div>

// 			<div className={styles.ImageText}>
// 				<label>Alt Text:</label>
// 				<input type="text" placeholder="ALT Text" value={altText} onChange={(e) => setAltText(e.target.value)} />
// 			</div>
// 		</div>
// 	);
// };

// export default ImageBox;
