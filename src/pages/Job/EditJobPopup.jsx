import React, { useState } from "react";
import { TagsInput } from "react-tag-input-component";
import { toast } from "react-toastify";
import Loading from "../../components/Hooks/Loading";
import axios from "../../components/Hooks/axios";
import styles from "./Jobs.module.scss";

const EditJobPopup = ({ activeData, setActiveData, setReload }) => {
	const [title, setTitle] = useState(activeData.title || "");
	const [description, setDescription] = useState(activeData.description || "");
	const [skills, setSkills] = useState(activeData.skills || []);
	const [isLoading, setIsLoading] = useState(false);

	const handelSubmit = () => {
		if (!title || !description || !skills) return toast.error("Please all data !!");
		setIsLoading(true);

		axios
			.put(`/jobPost/update`, { id: activeData?._id, title, description, skills })
			.then(({ data }) => {
				toast.success(data.msg);
				setIsLoading(false);
				setReload(Math.random());
				setActiveData(null);
			})
			.catch(({ response }) => {
				console.log("Error => ", response);
			});
	};

	return (
		<div className={styles.AddJobPopup} onClick={() => setActiveData(null)}>
			<div className={styles.WrapperContainer} onClick={(e) => e.stopPropagation()}>
				<h2>Edit Job</h2>

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
					{isLoading ? <Loading color="#fff" /> : "Update"}
				</button>
			</div>
		</div>
	);
};

export default EditJobPopup;
