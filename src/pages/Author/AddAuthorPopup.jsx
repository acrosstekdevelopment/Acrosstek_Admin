import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import user from "../../assets/images/user.png";
import axios from "../../components/Hooks/axios";
import Loading from "../../components/Hooks/Loading";
import styles from "./AddAuthorPopup.module.scss";

const AddAuthorPopup = ({ setAddPopup, setReload }) => {
	const authRef = useRef(null);
	const [authFile, setAuthFile] = useState(null);
	const [uploading, setUploading] = useState(false);

	const [authorName, setAuthorName] = useState("");
	const [authorDesignation, setAuthorDesignation] = useState("");

	const handleAddAuthor = () => {
		// console.log(authFile, authorDesignation, authorName);

		const formData = new FormData();

		formData.append("authorName", authorName);
		formData.append("authorDesignation", authorDesignation);
		formData.append("authorImage", authFile);

		setUploading(true);

		axios
			.post("/author/create", formData)
			.then(({ data }) => {
				setAddPopup(false);
				setReload(Math.random());
			})
			.catch((err) => {
				console.log(err);

				toast.error(err?.response?.data?.msg || "Something went wrong...");
			})
			.finally(() => setUploading(false));
	};

	return (
		<div className={styles.AddAuthorPopup} onClick={() => setAddPopup(false)}>
			<div className={styles.Wrapper} onClick={(e) => e.stopPropagation()}>
				<div className={styles.AuthSectionLeft}>
					<img src={authFile ? URL.createObjectURL(authFile) : user} alt="" onClick={() => authRef.current.click()} />

					<input
						type="file"
						ref={authRef}
						onChange={(e) => {
							setAuthFile(e.target.files[0]);
							e.target.value = null;
						}}
						style={{ display: "none" }}
					/>
					<input type="text" placeholder="Author Name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
					<input
						type="text"
						placeholder="Author Designation"
						value={authorDesignation}
						onChange={(e) => setAuthorDesignation(e.target.value)}
					/>

					<button onClick={handleAddAuthor}>{uploading ? <Loading /> : "Add"}</button>
				</div>
			</div>
		</div>
	);
};

export default AddAuthorPopup;
