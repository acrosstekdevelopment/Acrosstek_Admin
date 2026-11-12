import React, { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../components/Hooks/axios";
import Loading from "../../components/Hooks/Loading";

import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useDeleteAlert } from "../../components/Hooks/useDeleteAlert";
import { fetchTagsFromLocal } from "../../redux/slice/tagSlice";
import { setRefreshTag } from "../../redux/slice/tempSlice";
import styles from "./Tag.module.scss";

const Tag = () => {
	const { allTags, tagLoading } = useSelector((state) => state.tag);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchTagsFromLocal());
	}, []);

	const handleAddTag = async () => {
		const { value: tagName } = await Swal.fire({
			title: "Enter tag name",
			input: "text",
			inputPlaceholder: "Enter tag name",
			inputAttributes: {
				autocapitalize: "off",
			},
			showCancelButton: true,
			confirmButtonText: "Add",
			cancelButtonText: "Cancel",
			confirmButtonColor: "#ff621f",
			cancelButtonColor: "#d33",
			showLoaderOnConfirm: true,
			preConfirm: async (name) => {
				try {
					const response = await axios.post("/tags", { name });

					if (response.status !== 201) {
						return Swal.showValidationMessage(`Error: ${response.data.msg || "Failed to add tag"}`);
					}

					// Return the response if successful
					return response.data;
				} catch (error) {
					Swal.showValidationMessage(`Request failed: ${error.response?.data?.msg || error.message}`);
				}
			},
			allowOutsideClick: () => !Swal.isLoading(),
		});

		// After the tag is successfully added
		if (tagName) {
			dispatch(setRefreshTag());
			Swal.fire({
				icon: "success",
				title: "Tag added successfully",
				text: `The tag "${tagName?.data?.name}" has been added!`,
			});
		} else {
			Swal.fire({
				icon: "error",
				title: "Cancelled",
				text: "Tag addition was cancelled!",
			});
		}
	};

	return (
		<div className={styles.Tag}>
			<div className={styles.Heading}>
				<button className={styles.refresh} onClick={() => dispatch(setRefreshTag())}>
					Refresh
				</button>

				<button className={styles.AddDeveloper} onClick={() => handleAddTag()}>
					Add New Tag
				</button>
			</div>

			<h2>Note :By Edit and Delete Tag it may effect the blog it is used...</h2>
			<div className={styles.TagContainer}>
				{tagLoading ? <Loading /> : allTags?.map((tag) => <TagItem tag={tag} key={tag._id} />)}
			</div>
		</div>
	);
};

export default Tag;

const TagItem = ({ tag }) => {
	const dispatch = useDispatch();
	const [editable, setEditable] = useState(false);
	const [tagName, setTagName] = useState(tag?.name);
	const handleDelete = async (id) => {
		const confirmed = await useDeleteAlert();
		if (!confirmed) return;

		axios
			.delete(`/tags/${id}`)
			.then(({ data }) => {
				toast.success("Successfully Deleted !");
				dispatch(setRefreshTag());
			})
			.catch((e) => console.log(e));
	};

	const handleEdit = (id) => {
		axios
			.put(`/tags/${id}`, { name: tagName })
			.then(({ data }) => {
				toast.success("Successfully updated !");
				dispatch(setRefreshTag());
			})
			.catch((e) => console.log(e));
	};
	return (
		<div className={styles.TagItem}>
			{editable ? <input type="text" value={tagName} onChange={(e) => setTagName(e.target.value)} /> : <p>{tag?.name}</p>}

			<div className={styles.Actions}>
				{editable ? (
					<p onClick={() => handleEdit(tag._id)}>
						<FaSave />
					</p>
				) : (
					<p onClick={() => setEditable(true)}>
						<FaEdit />
					</p>
				)}

				<p onClick={() => handleDelete(tag._id)}>
					<FaTrashAlt />
				</p>
			</div>
		</div>
	);
};
