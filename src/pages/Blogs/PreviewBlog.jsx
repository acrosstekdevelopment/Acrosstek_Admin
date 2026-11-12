import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { formatDate } from "../../components/Functions/Date";
import styles from "./PreviewBlog.module.scss";

const PreviewBlog = ({ setOpenPreview, title, smallText, selected, blogData, color, bg, imageFile, previewImageFile }) => {

	return (
		<div className={styles.PreviewBlog} onClick={() => setOpenPreview(false)}>
			<div className={styles.Wrapper} onClick={(e) => e.stopPropagation()}>
				<div className={styles.Row1} style={{ background: bg }}>
					<div className={styles.Left}>
						<div className={styles.Details}>
							<h1 style={{ color: color }}>{title}</h1>
							<p style={{ color: color }}>{smallText}</p>
						</div>
						<div className={styles.Tags}>
							{selected?.map((tag, i) => (
								<div key={i} className={styles.Tag}>
									{tag}
								</div>
							))}
						</div>
						<div className={styles.AuthorNDate}>
							<h4>{"authorName"}</h4>
							<div className={styles.Dot}></div>
							<h4>{formatDate(Date.now())}</h4>
						</div>
					</div>

					{imageFile && <img src={URL.createObjectURL(imageFile)} alt="" loading="lazy" />}
					{!imageFile && previewImageFile && <img src={previewImageFile} alt="" loading="lazy" />}
				</div>

				<div className={styles.Row2}>
					<div className={styles.Left}>
						<Link to="#" style={{ background: bg, color: color }}>
							<FaFacebookF />
						</Link>

						<Link to="#" style={{ background: bg, color: color }}>
							<FaInstagram />
						</Link>

						<Link to="#" style={{ background: bg, color: color }}>
							<FaXTwitter />
						</Link>
					</div>

					<div className={styles.Right}>
						{blogData?.map((item, i) => (
							<div
								dangerouslySetInnerHTML={{
									__html: item?.data,
								}}
							/>
						))}
						{/* <div className={styles.AuthorDetails}>
							<div className={styles.Author}>
								<img src={blogData?.authorId?.authorImage} alt="" />
								<div className={styles.Details}>
									<h5>{language === "English" ? "The Author" : "Der Autor"}</h5>
									<div className={styles.Name}>{blogData?.authorId?.authorName}</div>
									<div className={styles.designation}>{blogData?.authorId?.authorDesignation}</div>
								</div>
							</div>
						</div> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PreviewBlog;
