import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import leftArrow from "../../assets/svg/leftArrow.svg";
import rightArrow from "../../assets/svg/rightArrow.svg";
import Loading from "../../components/Hooks/Loading";
import axios from "../../components/Hooks/axios";
import { useDeleteAlert } from "../../components/Hooks/useDeleteAlert";
import AddDeveloperPopup from "./AddJobPopup";
import EditDeveloperPopup from "./EditJobPopup";
import styles from "./Jobs.module.scss";

function Jobs() {
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [applications, setApplications] = useState([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState({ totalCount: 0, totalPages: 1 });
	const [reload, setReload] = useState(0);
	const [loading, setLoading] = useState(true);
	const [addPopup, setAddPopup] = useState(false);
	const [activeData, setActiveData] = useState(null);
	const { language } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	// useEffect(() => {
	// 	dispatch(fetchLanguageFromLocal());
	// }, []);

	useEffect(() => {
		setLoading(true);
		console.log(language);
		axios
			.get(`jobPost/allJobs?language=${language}`)
			.then(({ data }) => {
				console.log(data);
				setApplications(data.data);
				setTotal({ totalCount: data.totalJobData, totalPages: data.totalPage });
				setLoading(false);
			})
			.catch((e) => console.log(e));
	}, [page, reload, language]);

	const handelDelete = async (id) => {
		const confirmed = await useDeleteAlert();
		if (!confirmed) return;

		axios
			.delete(`/jobPost/delete/${id}`)
			.then(({ data }) => {
				toast.success("Successfully Deleted !");
				setReload(Math.random());
			})
			.catch((e) => console.log(e));
	};

	return (
		<div className={styles.AdmissionForms}>
			{addPopup && <AddDeveloperPopup {...{ setAddPopup, setReload }} />}
			{activeData && <EditDeveloperPopup {...{ activeData, setActiveData, setReload }} />}

			<h1>Developers</h1>
			<div className={styles.paymentHistory}>
				<div className={styles.heading}>
					<div className={styles.ButtonWrapper}>
						<button className={styles.refresh} onClick={() => setReload(Math.random())}>
							Refresh
						</button>
					</div>

					<button className={styles.AddDeveloper} onClick={() => setAddPopup(true)}>
						Add Job
					</button>
				</div>

				<div className={styles.subHeading}>
					<div className={styles.userId}>Sl.No</div>
					<div className={styles.Title}>Job Title</div>
					<div className={styles.Description}>Description</div>
					<div className={styles.Skills}>Skills</div>
					<div className={styles.Actions}>Actions</div>
				</div>

				<div className={styles.supportCards}>
					{loading ? (
						<Loading height="10rem" width="10rem" />
					) : (
						applications.map((item, index) => (
							<div className={styles.ApplicationCard} key={index}>
								<div className={styles.userId}>
									<p>{index + 1}</p>
								</div>

								<div className={styles.Title}>
									<p>{item?.title}</p>
								</div>

								<div className={styles.Description}>
									<p>{item?.description}</p>
								</div>

								<div className={styles.Skills}>
									<p>{item?.skills.join(", ")}</p>
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

				{applications?.length > 0 && (
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
				)}
			</div>
		</div>
	);
}

export default Jobs;
