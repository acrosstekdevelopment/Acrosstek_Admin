import React, { useEffect, useRef, useState } from "react";
import { BiUpload } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import FooterBG from "../../assets/images/FooterBG.webp";
import axios from "../../components/Hooks/axios";
import Loading from "../../components/Hooks/Loading";
import styles from "./AddBlog.module.scss";

function extractImageSrc(imgTag) {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = imgTag;
  const imgElement = tempElement.querySelector("img");
  return imgElement ? imgElement.getAttribute("src") : null;
}

const ImageBox = ({ id, initialData, updateBoxData, removeBox }) => {
  const inputRef = useRef();
  const [altText, setAltText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (file) => {
    if (file) {
      console.log("📁 File selected:", {
        name: file.name,
        size: file.size,
        type: file.type
      });
      setImageFile(file);
      setImageUrl(null);
      updateBoxData(id, null);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image first");
      return;
    }

    console.log("🚀 Starting upload...");
    console.log("Image file:", imageFile);

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("name", `${Date.now()}_${id}_content_image`);

    console.log("📦 FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0], ":", pair[1]);
    }

    setUploading(true);
    try {
      console.log("📤 Sending request to: /blog/uploadContentImage");
      
      const response = await axios.post(`/blog/uploadContentImage`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      console.log("✅ Upload response:", response);
      console.log("Response data:", response.data);
      
      if (response.data && response.data.url) {
        setImageUrl(response.data.url);
        setImageFile(null);

        const imageData = `<img src="${response.data.url}" alt="${altText || 'Blog content image'}" />`;
        updateBoxData(id, imageData);
        toast.success("Image uploaded successfully");
      } else {
        console.error("❌ No URL in response:", response.data);
        toast.error("Upload failed - no URL returned");
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error message:", err.message);
      
      const errorMsg = err.response?.data?.msg || err.message || "Image upload failed";
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      const extractedUrl = extractImageSrc(initialData);
      setImageUrl(extractedUrl);
      updateBoxData(id, initialData);
    }
  }, []);

  useEffect(() => {
    if (imageUrl) {
      const imageData = `<img src="${imageUrl}" alt="${altText || 'Blog content image'}" />`;
      updateBoxData(id, imageData);
    }
  }, [altText]);

  return (
    <div className={styles.ImageBox}>
      <div className={styles.Remove} onClick={() => removeBox(id)}>
        <RxCross2 size={"2rem"} color="#fff" />
      </div>

      {imageFile && !imageUrl && (
        <button className={styles.UploadImage} onClick={handleUpload} disabled={uploading}>
          {uploading ? <Loading /> : <BiUpload size={"2rem"} />}
        </button>
      )}

      <div className={styles.Image}>
        <img 
          src={imageUrl || (imageFile ? URL.createObjectURL(imageFile) : FooterBG)} 
          alt={altText || "Preview"} 
        />
        <input
          type="file"
          ref={inputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files[0])}
        />
        <button onClick={() => inputRef?.current?.click()}>
          {imageUrl ? "Change Image" : "Select Image"}
        </button>
      </div>

      <div className={styles.ImageText}>
        <label>Alt Text:</label>
        <input 
          type="text" 
          placeholder="Describe the image" 
          value={altText} 
          onChange={(e) => setAltText(e.target.value)} 
        />
      </div>

      {!imageUrl && imageFile && (
        <p style={{ color: "orange", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          ⚠️ Click upload button to save this image
        </p>
      )}
    </div>
  );
};

export default ImageBox;