import React, { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { VscOpenPreview } from "react-icons/vsc";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FooterBG from "../../assets/images/FooterBG.webp";
import Loading from "../../components/Hooks/Loading";
import axios from "../../components/Hooks/axios";
import styles from "../Blogs/AddBlog.module.scss";
import ImageBox from "../Blogs/ImageBox";
import PreviewBlog from "../Blogs/PreviewBlog";
import TagSelector from "../Blogs/TagSelector";
import TextBox from "../Blogs/TextBox";

const BlogForm = () => {
  const navigate = useNavigate();
  const { slug } = useParams(); // if slug exists → update mode
  const inputRef = useRef();

  const [title, setTitle] = useState("");
  const [smallText, setSmallText] = useState("");
  const [bg, setBg] = useState("#ff621f");
  const [color, setColor] = useState("#ffffff");
  const [imageFile, setImageFile] = useState(null);
  const [selected, setSelected] = useState([]);
  const [activeAuthId, setActiveAuthId] = useState("");
  const [authData, setAuthData] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [contentText, setContentText] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState("");
  
  const [time, setTime] = useState("");

  const { language } = useSelector((state) => state.auth);

  // Fetch authors for select
  useEffect(() => {
    axios
      .get("/blog/allAuth")
      .then(({ data }) => setAuthData(data.data))
      .catch(console.error);
  }, []);

  // If slug exists, fetch blog to update
  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blog2/${slug}`);
        const data = res.data;
        setTitle(data.title);
        setSmallText(data.smallText);
        setBg(data.bgColor || "#ff621f");
        setColor(data.textColor || "#ffffff");
        setSelected(data.tags || []);
        setActiveAuthId(data.authorId?._id || "");
        setBlogData(data.content ? data.content.map((c, i) => ({ id: i, data: c })) : []);
        setContentText(
          data.content
            ? data.content.map((c, i) => ({
                id: i,
                comp: <TextBox key={i} id={i} updateBoxData={updateBoxData} removeBox={removeBox} />,
              }))
            : []
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch blog data");
      }
    };
    fetchBlog();
  }, [slug]);

  const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

  const updateBoxData = (id, data) => {
    setBlogData((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((d) => d.id === id);
      if (index > -1) updated[index].data = data;
      else updated.push({ id, data });
      return updated;
    });
  };

  const removeBox = (id) => {
    setContentText((prev) => prev.filter((item) => item.id !== id));
    setBlogData((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePreview = () => {
    if (!title || !smallText || blogData.length === 0)
      return toast.error("Fill all required fields");
    setOpenPreview(true);
  };

  const addTextBox = () => {
    const id = generateId();
    setContentText((prev) => [
      ...prev,
      { id, comp: <TextBox key={id} id={id} updateBoxData={updateBoxData} removeBox={removeBox} /> },
    ]);
  };

  const addImageBox = () => {
    const id = generateId();
    setContentText((prev) => [
      ...prev,
      { id, comp: <ImageBox key={id} id={id} updateBoxData={updateBoxData} removeBox={removeBox} /> },
    ]);
  };

  const handleSubmit = async () => {
    if (!title || !smallText || !activeAuthId) return toast.error("Fill required fields");

    const sanitizedTitle = title.replace(/(\r\n|\n|\r)/gm, " ").trim();
    const contentCombined = blogData.map((item) => item.data).join("\n\n");

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", sanitizedTitle);
      formData.append("smallText", smallText);
      formData.append("bgColor", bg);
      formData.append("textColor", color);
      formData.append("tags", JSON.stringify(selected.length ? selected : ["General"]));
      formData.append("language", language || "English");
      formData.append("authorId", activeAuthId);
      formData.append("content", contentCombined);
      if (imageFile) formData.append("image", imageFile);
      if (date && time) formData.append("scheduleTime", new Date(`${date}T${time}`).toISOString());

      if (slug) {
        // update
        await axios.put(`/blog2/update/${slug}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Blog updated successfully!");
      } else {
        // create
        await axios.post(`/blog2/create`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Blog created successfully!");
      }
      navigate("/blogs");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.msg || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {openPreview && (
        <PreviewBlog
          {...{ setOpenPreview, title, smallText, selected, blogData, color, bg, imageFile }}
        />
      )}

      <div className={styles.AddBlog}>
        <div className={styles.Top}>
          <h1>{slug ? "Update Blog" : "Add Blog"}</h1>
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
                style={{ color }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Add Small text"
                style={{ color }}
                className={styles.smallText}
                value={smallText}
                onChange={(e) => setSmallText(e.target.value)}
              />
            </div>

            <div className={styles.Right}>
              <img src={imageFile ? URL.createObjectURL(imageFile) : FooterBG} alt="" />
              <input type="file" ref={inputRef} onChange={(e) => setImageFile(e.target.files[0])} />
              <button onClick={() => inputRef.current.click()}><FaCamera /></button>
            </div>
          </div>

          <div className={styles.TagAuthor}>
            <div className={styles.TagWrapper}>
              <TagSelector onTagsChange={setSelected} existingTags={selected} />
            </div>

            <div className={styles.AuthSectionRight}>
              <h3>Select Author</h3>
              <select value={activeAuthId} onChange={(e) => setActiveAuthId(e.target.value)}>
                <option value="" disabled>Select one author</option>
                {authData.map((data) => (
                  <option value={data._id} key={data._id}>{data.authorName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.DateTime}>
            <h3>Schedule Blog (Optional)</h3>
            <div>
              <label htmlFor="date">Select Date:</label>
              <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <label htmlFor="time">Select Time:</label>
              <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className={styles.ContentWrapper}>
            <div className={styles.HeaderSection}>
              <div className={styles.Buttons}>
                <button onClick={addTextBox}>Add Text Box</button>
                <button onClick={addImageBox}>Add Image Box</button>
              </div>
            </div>

            <div className={styles.BodySection}>
              <div className={styles.LeftBoxes}>{contentText.map((data) => data.comp)}</div>
            </div>
          </div>

          <div className={styles.Submit}>
            <button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <Loading color="#fff" /> : slug ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogForm;
