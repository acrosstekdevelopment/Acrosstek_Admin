import React, { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { VscOpenPreview } from "react-icons/vsc";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FooterBG from "../../assets/images/FooterBG.webp";
import Loading from "../../components/Hooks/Loading";
import axios from "../../components/Hooks/axios";
import styles from "./AddBlog.module.scss";
import "./AddBlogs.scss";
import ImageBox from "./ImageBox";
import PreviewBlog from "./PreviewBlog";
import TagSelector from "./TagSelector";
import TextBox from "./TextBox";

const AddBlog = () => {
	const navigate = useNavigate();
	const [bg, setBg] = useState("#ff621f");
	const [color, setColor] = useState("#ffffff");
	const [imageFile, setImageFile] = useState(null);
	const inputRef = useRef();
	const authRef = useRef();
	const [title, setTitle] = useState("");
	const [blogData, setBlogData] = useState([]);
	const [smallText, setSmallText] = useState("");
	const [authData, setAuthData] = useState([]);
	const [activeAuthId, setActiveAuthId] = useState("");
	const [contentText, setContentText] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const { language } = useSelector((state) => state.auth);
	const [selected, setSelected] = useState([]);
	const [openPreview, setOpenPreview] = useState(false);

	const handlePreview = () => {
		if (!title) return toast.error("Plz add Title and necessary Fields To show Preview...");
		if (!smallText) return toast.error("Plz add Small Text and necessary Fields To show Preview... !!");

		let notUpdated = false;

		if (blogData.length === 0) {
			toast.warn("Please add at least One textBox or Image Box");
			return;
		}
		blogData.forEach((item) => {
			if (item.data === null || item.data === "") {
				toast.warn("Please Remove Unfilled Text Boxes or Check All image box images Are uploaded ...");

				notUpdated(true);
			}
		});
		if (notUpdated) {
			return;
		}

		setOpenPreview(true);
	};

	// Helper function to generate a unique ID
	const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

	useEffect(() => {
		axios
			.get(`/blog/allAuth`)
			.then(({ data }) => {
				setAuthData(data.data);
			})
			.catch(({ response }) => {
				console.log("Error => ", response);
			});
	}, []);

	const updateBoxData = (id, data) => {
		setBlogData((prevData) => {
			const newData = [...prevData];
			const index = newData.findIndex((item) => item.id === id);
			if (index > -1) {
				newData[index].data = data;
			} else {
				newData.push({ id, data });
			}
			return newData;
		});
	};

	const removeTextBox = (id) => {
		setContentText((prevContentText) => prevContentText.filter((item) => item.id !== id));
		setBlogData((prevBlogData) => prevBlogData.filter((item) => item.id !== id));
	};

	const removeImageBox = (id) => {
		setContentText((prevContentText) => prevContentText.filter((item) => item.id !== id));
		setBlogData((prevBlogData) => prevBlogData.filter((item) => item.id !== id));
	};

	const handelAddTextBox = () => {
		const id = generateId();
		setContentText((prevContentText) => [
			...prevContentText,
			{
				id,
				comp: (
					<TextBox
						key={id}
						id={id}
						updateBoxData={updateBoxData}
						removeBox={removeTextBox}
						type={"add"}
						handleUpdateTitleId={handleUpdateTitleId}
					/>
				),
			},
		]);
	};

	const handelAddImageBox = () => {
		const id = generateId();
		setContentText((prevContentText) => [
			...prevContentText,
			{ id, comp: <ImageBox key={id} id={id} updateBoxData={updateBoxData} removeBox={removeImageBox} /> },
		]);
	};

	const handelSubmit = () => {
		console.log(titleIds);
		if (!title) return toast.error("Title is required...");
		if (!smallText) return toast.error("Small Text is required !!");
		if (!imageFile) return toast.error("Blog Image required !!");

		const sanitizedTitle = title.replace(/(\r\n|\n|\r)/gm, " ").trim();


		if (activeAuthId === "") return toast.error("Please select author");
		console.log(blogData);

		if (blogData.length === 0) {
			toast.warn("Please add at least One textBox or Image Box");
			return;
		}

		blogData.forEach((item) => {
			if (item.data === null || item.data === "") {
				return toast.warn("Please Remove Unfilled Text Boxes or Check All image box images Are uploaded ...");
			}
		});

		// console.log(blogData);
		setIsLoading(true);
		const formData = new FormData();
		formData.append("title", sanitizedTitle);
		formData.append("image", imageFile);
		formData.append("bgColor", bg);
		formData.append("textColor", color);
		formData.append("smallText", smallText);
		formData.append("content", blogData.map((item) => item.data).join("\n"));
		formData.append("tags", JSON.stringify(selected));
		formData.append("language", language);
		formData.append("titleIds", JSON.stringify(titleIds));

		if (date && time) {
			const dateTime = `${date}T${time}`;
			const scheduledDateTime = new Date(dateTime);
			const currentDateTime = new Date();

			// Check if the scheduled dateTime is in the past
			if (scheduledDateTime < currentDateTime) {
				toast.error("The scheduled time cannot be in the past!");
				return;
			}
			formData.append("scheduleTime", dateTime);
		}

		if (activeAuthId) formData.append("authorId", activeAuthId);

		axios
			.post(`/blog/create`, formData)
			.then(({ data }) => {
				toast.success("Blog uploaded successfully !!");
				setBg("#ff621f");
				setColor("#fff");
				setImageFile(null);
				setTitle("");
				setBlogData([]);
				setSmallText("");
				// setAuthData([]);
				setActiveAuthId("");
				setContentText([]);
				setSelected([]);
				navigate("/blogs");
			})
			.catch(({ response }) => {
				console.log("Error => ", response);
			})
			.finally(() => setIsLoading(false));
	};

	useEffect(() => {
		console.log(contentText);
		console.log(blogData);
	}, [contentText, blogData]);

	// for tags

	// This function will receive the updated tags from the TagSelector component
	const handleTagsChange = (tags) => {
		setSelected(tags);
	};

	//for date and time  blog scheduling
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");

	//for title and ids to manage scrolling to particular section
	const [titleIds, setTitleIds] = useState([]);

	// Function to update titleIds array
	const handleUpdateTitleId = (newTitle, newId) => {
		// Check if the id already exists in the array, update or add accordingly
		setTitleIds((prevTitleIds) => {
			const existingIndex = prevTitleIds.findIndex((item) => item.addedId === newId);

			// If the ID exists, update the title, otherwise add a new entry
			if (existingIndex !== -1) {
				const updatedTitleIds = [...prevTitleIds];
				updatedTitleIds[existingIndex].title = newTitle;
				return updatedTitleIds;
			} else {
				return [...prevTitleIds, { title: newTitle, addedId: newId }];
			}
		});
	};

	return (
		<>
			{openPreview && <PreviewBlog {...{ setOpenPreview, title, smallText, selected, blogData, color, bg, imageFile }} />}
			<div className={styles.AddBlog}>
				<div className={styles.Top}>
					<h1>Add Blog</h1>
					<p onClick={handlePreview}>
						Preview <VscOpenPreview />
					</p>
				</div>

				<div className={styles.WrapperContainer} onClick={(e) => e.stopPropagation()}>
					<div className={styles.ImageWrapper} style={{ background: bg }}>
						<div className={styles.Left}>
							<textarea
								className={styles.MainTitle}
								placeholder="Add your title"
								style={{ color: color }}
								defaultValue={title}
								value={title}
								onChange={(e) => setTitle(e.target.value)}></textarea>

							<textarea
								placeholder="Add Small text"
								style={{ color: color }}
								value={smallText}
								className={styles.smallText}
								onChange={(e) => setSmallText(e.target.value)}></textarea>

							<div className={styles.Section}>
								<div>
									<label htmlFor="Background-Color">Background Color : </label>
									<input type="color" name="Background-Color" value={bg} onChange={(e) => setBg(e.target.value)} />
								</div>

								<div>
									<label htmlFor="Background-Color">Text Color : </label>
									<input type="color" name="Background-Color" value={color} onChange={(e) => setColor(e.target.value)} />
								</div>
							</div>
						</div>

						<div className={styles.Right}>
							<img src={imageFile ? URL.createObjectURL(imageFile) : FooterBG} alt="" />
							<input type="file" ref={inputRef} onChange={(e) => setImageFile(e.target.files[0])} />
							<button onClick={() => inputRef.current.click()}>
								<FaCamera />
							</button>
						</div>
					</div>

					<div className={styles.TagAuthor}>
						<div className={styles.TagWrapper}>
							<TagSelector onTagsChange={handleTagsChange} existingTags={selected} />
						</div>

						<div className={styles.AuthSectionRight}>
							<h3>Select Author</h3>

							<select value={activeAuthId} onChange={(e) => setActiveAuthId(e.target.value)}>
								<option value="" disabled>
									Select one author
								</option>

								{authData?.map((data, index) => (
									<option value={data._id} key={index}>
										{data?.authorName}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className={styles.DateTime}>
						<h3>Schedule Blog (choose date & time if want to schedule else leave as it is..)</h3>

						<div>
							<label htmlFor="date">Select Date:</label>
							<input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />

							<label htmlFor="time" className={styles.Label1}>
								Select Time:
							</label>
							<input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} required />
						</div>
					</div>

					<div className={styles.ContentWrapper}>
						<div className={styles.HeaderSection}>
							<div className={styles.Buttons}>
								<button onClick={handelAddTextBox}>Add Text Box</button>
								<button onClick={handelAddImageBox}>Add Image Box</button>
							</div>
							<h2>Fonts For DropDown : serif , ariel , Helvetica , Helvetica-Neue , Intercom </h2>
						</div>

						<div className={styles.BodySection}>
							<div className={styles.LeftBoxes}>{contentText.map((data, index) => data.comp)}</div>
							<div className={styles.RightIdCon}>
								<h3>Scroll title and id's</h3>
								<div className={styles.TitleIds}>
									{titleIds?.map((data, index) => (
										<div className={styles.TitleIdCard} key={index}>
											<p>Title : {data?.title}</p>
											<p>ID: {data?.addedId}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className={styles.Submit}>
						<button onClick={handelSubmit} disabled={isLoading}>
							{isLoading ? <Loading color="#fff" /> : "Submit"}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default AddBlog;
