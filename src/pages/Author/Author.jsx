import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../components/Hooks/Loading";
import axios from "../../components/Hooks/axios";
import { useDeleteAlert } from "../../components/Hooks/useDeleteAlert";
import AddAuthorPopup from "./AddAuthorPopup";
import styles from "./Author.module.scss";
import EditAuthorPopup from "./EditAuthorPopup";

function Author() {
	const [selectedCategory, setSelectedCategory] = useState("all");

	const [authors, setAuthor] = useState([]);
	const [addPopup, setAddPopup] = useState(false);
	const [EditPopup, setEditPopup] = useState(false);
	const [activeData, setActiveData] = useState(null);
	const [reload, setReload] = useState(0);

	// const [page, setPage] = useState(1);
	// const [total, setTotal] = useState({ totalCount: 0, totalPages: 1 });

	const [loading, setLoading] = useState(true);
	const { language } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	// useEffect(() => {
	// 	dispatch(fetchLanguageFromLocal());
	// }, []);

	useEffect(() => {
		setLoading(true);
		console.log(language);
		axios
			.get(`blog/allAuth`)
			.then(({ data }) => {
				console.log(data);
				setAuthor(data.data);
				// setTotal({ totalCount: data.totalJobData, totalPages: data.totalPage });
				setLoading(false);
			})
			.catch((e) => console.log(e));
	}, [reload]);

	const handelDelete = async (id) => {
		const confirmed = await useDeleteAlert();
		if (!confirmed) return;

		axios
			.delete(`author/delete/${id}`)
			.then(({ data }) => {
				toast.success("Author Successfully Deleted !");
				setReload(Math.random());
			})
			.catch((e) => console.log(e));
	};

	return (
		<div className={styles.AdmissionForms}>
			{addPopup && <AddAuthorPopup {...{ setAddPopup, setReload }} />}
			{activeData && <EditAuthorPopup {...{ activeData, setActiveData, setReload }} />}

			<div className={styles.paymentHistory}>
				<div className={styles.heading}>
					<div className={styles.ButtonWrapper}>
						<button className={styles.refresh} onClick={() => setReload(Math.random())}>
							Refresh
						</button>
					</div>

					<button className={styles.AddDeveloper} onClick={() => setAddPopup(true)}>
						Add Author
					</button>
				</div>

				<div className={styles.subHeading}>
					<div className={styles.userId}>Sl.No</div>
					<div className={styles.Title}>Author Name</div>
					<div className={styles.Description}>Designation</div>
					{/* <div className={styles.Skills}>Skills</div> */}
					<div className={styles.Actions}>Actions</div>
				</div>

				<div className={styles.supportCards}>
					{loading ? (
						<Loading height="10rem" width="10rem" />
					) : (
						authors.map((item, index) => (
							<div className={styles.ApplicationCard} key={index}>
								<div className={styles.userId}>
									<p>{index + 1}</p>
								</div>

								<div className={styles.Title}>
									<img src={item?.authorImage} alt="" />
									<p>{item?.authorName}</p>
								</div>

								<div className={styles.Description}>
									<p>{item?.authorDesignation}</p>
								</div>

								<div className={styles.Actions}>
									<p onClick={() => setActiveData(item)}>
										<FaEdit />
									</p>
									<p onClick={() => handelDelete(item._id)}>
										<FaTrashAlt />
									</p>
								</div>
							</div>
						))
					)}
				</div>

				{/* {applications?.length > 0 && (
					<div className={styles.pagination}>
						<div className={styles.records}>{`Showing ${applications.length} of ${total.totalCount} users in page ${page} `}</div>
						<div className={styles.pageButtons}>
							<button
								className={styles.leftArrow}
								disabled={page === 1}
								onClick={() => {
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
									setPage(page + 1);
								}}>
								{page < total.totalPages && <img src={rightArrow} alt="" />}
							</button>
						</div>
					</div>
				)} */}
			</div>
		</div>
	);
}

export default Author;

// blog / allAuth;
