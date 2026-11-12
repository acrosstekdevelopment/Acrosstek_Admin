import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import leftArrow from "../../assets/svg/leftArrow.svg";
import rightArrow from "../../assets/svg/rightArrow.svg";
import Loading from "../../components/Hooks/Loading";
import axios from "../../components/Hooks/axios";
import { useDeleteAlert } from "../../components/Hooks/useDeleteAlert";
import styles from "./Styles.module.scss";

function Blogs() {
	const navigate = useNavigate();
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [applications, setApplications] = useState([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState({ totalCount: 0, totalPages: 1 });
	const [reload, setReload] = useState(0);
	const [loading, setLoading] = useState(true);
	const { language } = useSelector((state) => state.auth);

	useEffect(() => {
		setLoading(true);
		axios
			.get(`/blog/allBlog?page=1&limit=25&language=${language}`)
			.then(({ data }) => {
				setApplications(data.data);
				console.log(data.data);
				setTotal({ totalCount: data.totalCount, totalPages: data.totalPages });
				setLoading(false);
			})
			.catch((e) => console.log(e));
	}, [page, reload, language]);

	const handelDelete = async (id) => {
		const confirmed = await useDeleteAlert();
		if (!confirmed) return;

		axios
			.delete(`/blog/delete/${id}`)
			.then(({ data }) => {
				toast.success("Successfully Deleted !");
				setReload(Math.random());
			})
			.catch((e) => console.log(e));
	};

	//function to get time in milis
	const convertUTCToIST = (utcDate) => {
		const date = new Date(utcDate);
		const istTime = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);

		// Log the IST time in ISO format with the "+05:30" offset for clarity
		const istTimeISO = istTime.toISOString().replace("Z", "+05:30");
		const istTimeMillis = Date.parse(istTimeISO);

		return istTimeMillis;
	};

	function formatDateTime(input) {
		// Convert input UTC date to IST

		const date = new Date(input);
		const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);


		const day = String(istDate.getUTCDate()).padStart(2, "0");
		const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
		const year = istDate.getUTCFullYear();

		let hours = istDate.getUTCHours();
		const minutes = String(istDate.getUTCMinutes()).padStart(2, "0");

		const period = hours >= 12 ? "p.m" : "a.m";
		hours = hours % 12 || 12; // Convert to 12-hour format

		return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
	}

	return (
		<div className={styles.AdmissionForms}>
			<h1>Blogs</h1>
			<div className={styles.paymentHistory}>
				<div className={styles.heading}>
					<div className={styles.ButtonWrapper}>
						{/* <button
							className={selectedCategory === "all" ? styles.active : ""}
							onClick={() => setSelectedCategory("all")}>
							All
						</button>

						<button
							className={selectedCategory === "filter 1" ? styles.active : ""}
							onClick={() => setSelectedCategory("filter 1")}>
							Filter 1
						</button>

						<button
							className={selectedCategory === "filter 2" ? styles.active : ""}
							onClick={() => setSelectedCategory("filter 2")}>
							Filter 2
						</button> */}

						<button className={styles.refresh} onClick={() => setReload(Math.random())}>
							Refresh
						</button>
					</div>

					<button className={styles.AddDeveloper} onClick={() => navigate("/add-blog")}>
						Add Blogs
					</button>
				</div>

				{loading ? (
					<Loading height="10rem" width="10rem" />
				) : applications.length === 0 ? (
					<div className={styles.supportCards}>
						<h3>No Blogs Added Yet</h3>
					</div>
				) : (
					<div className={styles.supportCards}>
						{applications.map((data, index) => (
							<div className={`${styles.ApplicationCardOuter}`} key={index} s>
								<div className={styles.ApplicationCard} style={{ background: data?.bgColor }}>
									<img src={data?.image} alt="" />
									<h2 style={{ color: data?.textColor }}>{data?.title}</h2>
									<p onClick={() => handelDelete(data._id)}>
										<FaTrashAlt />
									</p>

									<p className={styles.Edit} onClick={() => navigate(`/update-blog/${data._id}`)}>
										<FaEdit />
									</p>
								</div>

								<div
									className={`${styles.BlogTime}  ${
										convertUTCToIST(data?.scheduleTime) >= Date.now() ? styles.ShowBlogTime : ""
									}`}>
									<p>Scheduled At </p>
									<p>{formatDateTime(data?.scheduleTime)}</p>
								</div>
							</div>
						))}
					</div>
				)}

				<div className={styles.pagination}>
					<div className={styles.records}>{`Showing 10 of ${total.totalCount} users in ${page} page`}</div>
					<div className={styles.pageButtons}>
						<button
							className={styles.leftArrow}
							disabled={page === 1}
							onClick={() => {
								setSelectedCategory("all");
								setPage(page - 1);
							}}>
							{page > 1 && <img src={leftArrow} alt="" />}
						</button>

						<div className={styles.pages}>
							<div className={`${styles.buttons} ${styles.active}`}>{page}</div>
						</div>

						<button
							className={styles.rightArrow}
							disabled={page === total.totalPages}
							onClick={() => {
								setSelectedCategory("all");
								setPage(page + 1);
							}}>
							{total.totalPages === page ? "" : <img src={rightArrow} alt="" />}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Blogs;
