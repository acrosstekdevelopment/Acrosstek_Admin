import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TagsInput } from "react-tag-input-component";
import { toast } from "react-toastify";
import Loading from "../../components/Hooks/Loading";
import axios from "../../components/Hooks/axios";
import styles from "./Jobs.module.scss";

const AddJobPopup = ({ setAddPopup, setReload }) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [skills, setSkills] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const { language } = useSelector((state) => state.auth);

	const handelSubmit = () => {
		if (!title || !description || !skills) return toast.error("Please fill all data !!");
		setIsLoading(true);

		axios
			.post(`/jobPost/create`, { title, description, skills, language })
			.then(({ data }) => {
				toast.success(data.msg);
				setIsLoading(false);
				setAddPopup(false);
				setReload(Math.random());
			})
			.catch(({ response }) => {
				console.log("Error => ", response);
			});
	};

	return (
		<div className={styles.AddJobPopup} onClick={() => setAddPopup(false)}>
			<div className={styles.WrapperContainer} onClick={(e) => e.stopPropagation()}>
				<h2>Add Job</h2>

				<div className={styles.InputWrapper}>
					<label>Title</label>
					<input type="text" placeholder="Add Name" value={title} onChange={(e) => setTitle(e.target.value)} />
				</div>

				<div className={styles.InputWrapper}>
					<label>Skills</label>
					<TagsInput value={skills} onChange={setSkills} name="skills" placeHolder="Add Skills" />
					<em>press enter or comma to add new skills</em>
				</div>

				<div className={styles.InputWrapper}>
					<label>Description</label>
					<textarea placeholder="Add Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
				</div>

				<button className={styles.Submit} onClick={handelSubmit}>
					{isLoading ? <Loading color="#fff" /> : "Submit"}
				</button>
			</div>
		</div>
	);
};

export default AddJobPopup;
