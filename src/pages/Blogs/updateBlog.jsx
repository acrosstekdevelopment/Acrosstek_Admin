import React, { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { VscOpenPreview } from "react-icons/vsc";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../components/Hooks/axios";
import Loading from "../../components/Hooks/Loading";
import styles from "./AddBlog.module.scss";
import "./AddBlogs.scss";
import ImageBox from "./ImageBox";
import PreviewBlog from "./PreviewBlog";
import TagSelector from "./TagSelector";
import TextBox from "./TextBox";

const UpdateBlog = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [bg, setBg] = useState("#ff621f");
	const [color, setColor] = useState("#ffffff");
	const [imageFile, setImageFile] = useState(null);
	const inputRef = useRef();
	const [title, setTitle] = useState("");
	const [blogData, setBlogData] = useState([]);
	const [smallText, setSmallText] = useState("");
	const [previewImageFile, setPreviewImageFile] = useState(null);
	const [contentText, setContentText] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const { language } = useSelector((state) => state.auth);
	const [selected, setSelected] = useState([]);
	const [blogId, setBlogId] = useState(null);

	const generateId = () => "_" + Math.random().toString(36).substr(2, 9); // Generate unique IDs

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

	useEffect(() => {
		axios
			.get(`/blog/${id}`)
			.then(({ data }) => {
				const blog = data.data;
				setBlogId(blog._id);
				setTitle(blog.title || "");
				setBg(blog.bgColor || "#ffffff");
				setColor(blog.textColor || "#000000");
				setSmallText(blog.smallText || "");
				setSelected(Array.isArray(blog.tags) ? blog.tags : JSON.parse(blog.tags) || []);
				setPreviewImageFile(blog.image);
				setTitleIds(blog.titleIds);

				// Process blog content into TextBox or ImageBox components
				const contentParts = blog.content.split("\r\n").map((item, index) => {
					const trimmedItem = item.trim();
					const isText = trimmedItem.startsWith("<p>");

					const isImage = trimmedItem.startsWith("<img");

					let randomId = generateId();
					return {
						id: randomId,
						comp: isText ? (
							<TextBox
								key={index}
								id={randomId}
								initialData={trimmedItem}
								updateBoxData={updateBoxData}
								removeBox={removeTextBox}
								type={"update"}
								handleUpdateTitleIdFromUpdate={handleUpdateTitleIdFromUpdate}
							/>
						) : isImage ? (
							<ImageBox
								key={index}
								id={randomId}
								initialData={trimmedItem}
								updateBoxData={updateBoxData}
								removeBox={removeImageBox}
							/>
						) : (
							<TextBox
								key={index}
								id={randomId}
								initialData={trimmedItem}
								updateBoxData={updateBoxData}
								removeBox={removeTextBox}
								type={"update"}
								handleUpdateTitleIdFromUpdate={handleUpdateTitleIdFromUpdate}
							/>
						),
					};
				});

				setContentText(contentParts);
				setBlogData(contentParts.map((item) => ({ id: item.id, data: item.comp.props.initialData })));
			})
			.catch((error) => {
				console.error("Error fetching blog data:", error);
			});
	}, []);

	// Function to update the box data
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

	// Function to remove a TextBox
	const removeTextBox = (id) => {
		setContentText((prevContentText) => prevContentText.filter((item) => item.id !== id));
		setBlogData((prevBlogData) => prevBlogData.filter((item) => item.id !== id));
	};

	const removeImageBox = (id) => {
		setContentText((prevContentText) => prevContentText.filter((item) => item.id !== id));
		setBlogData((prevBlogData) => prevBlogData.filter((item) => item.id !== id));
	};

	// Add TextBox component
	const handleAddTextBox = () => {
		const id = generateId();
		const newTextBox = {
			id,
			comp: (
				<TextBox
					key={id}
					id={id}
					updateBoxData={updateBoxData}
					removeBox={removeTextBox}
					type={"update"}
					handleUpdateTitleIdFromUpdate={handleUpdateTitleIdFromUpdate}
				/>
			),
		};
		setContentText((prev) => [...prev, newTextBox]);
		// setBlogData((prev) => [...prev, { id, data: "" }]);
	};

	// Add ImageBox component
	const handleAddImageBox = () => {
		const id = generateId();
		const newImageBox = {
			id,
			comp: <ImageBox key={id} id={id} updateBoxData={updateBoxData} removeBox={removeImageBox} />,
		};
		setContentText((prev) => [...prev, newImageBox]);
		// setBlogData((prev) => [...prev, { id, data: "" }]);
	};

	// Submit updated blog
	const handleSubmit = () => {
		if (!title || !smallText || !blogData.length) return toast.error("Please fill all required fields!");

		const sanitizedTitle = title.replace(/(\r\n|\n|\r)/gm, " ").trim();

		setIsLoading(true);
		const formData = new FormData();
		formData.append("title", sanitizedTitle);
		formData.append("bgColor", bg);
		formData.append("textColor", color);
		formData.append("smallText", smallText);
		formData.append("content", blogData.map((item) => item.data).join("\n"));
		formData.append("tags", JSON.stringify(selected));
		formData.append("language", language);
		formData.append("id", blogId);
		formData.append("titleIds", JSON.stringify(titleIds));
		if (imageFile) formData.append("image", imageFile);

		axios
			.put(`/blog/update`, formData)
			.then(({ data }) => {
				toast.success("Blog updated successfully!");
				navigate("/blogs");
			})
			.catch((error) => {
				console.error("Error updating blog:", error);
				toast.error("Error updating the blog");
			})
			.finally(() => setIsLoading(false));
	};

	//tag change
	const handleTagsChange = (tags) => {
		setSelected(tags);
	};

	//for title and ids to manage scrolling to particular section
	const [titleIds, setTitleIds] = useState([]);

	// Function to update titleIds array
	const handleUpdateTitleIdFromUpdate = (newTitle, newId) => {
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
			{openPreview && (
				<PreviewBlog {...{ setOpenPreview, title, smallText, selected, blogData, color, bg, imageFile, previewImageFile }} />
			)}
			<div className={styles.AddBlog}>
				<div className={styles.Top}>
					<h1>Update Blog</h1>
					<p onClick={handlePreview}>
						Preview <VscOpenPreview />
					</p>
				</div>

				<div className={styles.WrapperContainer} onClick={(e) => e.stopPropagation()}>
					<div className={styles.ImageWrapper} style={{ background: bg }}>
						<div className={`${styles.Left}`}>
							<textarea
								className={styles.MainTitle}
								placeholder="Add your title"
								style={{ color: color }}
								value={title}
								defaultValue={title}
								onChange={(e) => setTitle(e.target.value)}
							/>

							<textarea
								placeholder="Add small text"
								style={{ color: color }}
								value={smallText}
								className={styles.smallText}
								onChange={(e) => setSmallText(e.target.value)}
							/>

							<div className={styles.Section}>
								<div>
									<label>Background Color:</label>
									<input type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
								</div>
								<div>
									<label>Text Color:</label>
									<input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
								</div>
							</div>
						</div>

						<div className={styles.Right}>
							<img src={imageFile ? URL.createObjectURL(imageFile) : previewImageFile} alt="Blog" />
							<input type="file" ref={inputRef} onChange={(e) => setImageFile(e.target.files[0])} style={{ display: "none" }} />
							<button onClick={() => inputRef.current.click()}>
								<FaCamera />
							</button>
						</div>
					</div>
					<div className={styles.TagAuthor}>
						<div className={styles.TagWrapper} style={{ paddingLeft: "2rem" }}>
							<TagSelector existingTags={selected} onTagsChange={handleTagsChange} />
						</div>
					</div>
					<div className={styles.ContentWrapper}>
						<div className={styles.HeaderSection}>
							<div className={styles.Buttons}>
								<button onClick={handleAddTextBox}>Add Text Box</button>
								<button onClick={handleAddImageBox}>Add Image Box</button>
							</div>
							<h2>Fonts For DropDown : serif , ariel , Helvetica , Helvetica-Neue , Intercom </h2>
						</div>

						<div className={styles.BodySection}>
							<div className={styles.LeftBoxes}>
								{contentText.map((data, index) => (
									<div key={index}>{data.comp}</div>
								))}
							</div>

							<div className={styles.RightIdCon}>
								<h3>Scroll title and id's</h3>
								<div className={styles.TitleIds}>
									{titleIds?.map((data, index) => (
										<div className={styles.TitleIdCard}>
											<p>{data?.title}</p>
											<p>{data?.addedId}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
					<div className={styles.ButtonWrapper}>
						<button onClick={handleSubmit}>{isLoading ? <Loading color="#fff" /> : "Update Blog"}</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default UpdateBlog;
