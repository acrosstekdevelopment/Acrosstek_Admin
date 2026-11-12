import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import leftArrow from "../../assets/svg/leftArrow.svg";
import rightArrow from "../../assets/svg/rightArrow.svg";
import { dateFormat } from "../../components/Functions/Date";
import Loading from "../../components/Hooks/Loading";
import axios from "../../components/Hooks/axios";
import { useDeleteAlert } from "../../components/Hooks/useDeleteAlert";
import styles from "./Requests.module.scss";

function Requests() {
	const [selectedCategory, setSelectedCategory] = useState("jobSeeker");
	const [applications, setApplications] = useState([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState({ totalCount: 0, totalPages: 1 });
	const [reload, setReload] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		axios
			.get(`req_call/allReq_call?type=${selectedCategory}`)
			.then(({ data }) => {
				setApplications(data.data);
				setTotal({ totalCount: data.totalCount, totalPages: data.totalPages });
				setLoading(false);
			})
			.catch((e) => console.log(e));
	}, [page, reload, selectedCategory]);

	const handelDelete = async (id) => {
		const confirmed = await useDeleteAlert();
		if (!confirmed) return;

		axios
			.delete(`/req_call/delete/${id}`)
			.then(({ data }) => {
				toast.success("Successfully Deleted !");
				setReload(Math.random());
			})
			.catch((e) => console.log(e));
	};

	return (
		<div className={styles.AdmissionForms}>
			<h1>Support</h1>

			<div className={styles.ContentWrapper}>
				<div className={styles.heading}>
					<div className={styles.ButtonWrapper}>
						<button
							className={selectedCategory === "jobSeeker" ? styles.active : ""}
							onClick={() => setSelectedCategory("jobSeeker")}>
							Job Seeker
						</button>
						<button
							className={selectedCategory === "recruiter" ? styles.active : ""}
							onClick={() => setSelectedCategory("recruiter")}>
							Recruiter
						</button>
						<button
							className={selectedCategory === "freeConsultation" ? styles.active : ""}
							onClick={() => setSelectedCategory("freeConsultation")}>
							Free Consultation
						</button>
						<button
							className={selectedCategory === "buildTogether" ? styles.active : ""}
							onClick={() => setSelectedCategory("buildTogether")}>
							Build Together
						</button>

						<button className={styles.refresh} onClick={() => setReload(Math.random())}>
							Refresh
						</button>
					</div>
				</div>

				{selectedCategory === "freeConsultation" ? (
					<>
						<div className={styles.subHeading}>
							<div className={styles.userId}>Sl.No</div>
							<div className={styles.Name}>Name</div>
							<div className={styles.Email}>Email</div>
							<div className={styles.Phone}>Phone</div>
							<div className={styles.Description}>ProjectBrief</div>
							<div className={styles.Date}>Date</div>
							<div className={styles.Actions}>Actions</div>
						</div>

						<div className={styles.supportCards}>
							{loading ? (
								<Loading height="10rem" width="10rem" />
							) : (
								applications.map((item, index) => (
									<div className={styles.ApplicationCard} key={index}>
										<div className={styles.userId}>{index + 1}</div>
										<div className={styles.Name}>{item?.name}</div>
										<div className={styles.Email}>{item?.email}</div>
										<div className={styles.Phone}>{item?.phone}</div>

										<div className={styles.Description}>{item?.projectBrief}</div>
										<div className={styles.Date}>{dateFormat(item?.createdAt)}</div>
										<div className={styles.Actions}>
											<p onClick={() => handelDelete(item._id)}>
												<FaTrashAlt />
											</p>
										</div>
									</div>
								))
							)}
						</div>
					</>
				) : selectedCategory === "buildTogether" ? (
					<>
						<div className={styles.subHeading}>
							<div className={styles.userId}>Sl.No</div>
							<div className={styles.Name}>Name</div>
							<div className={styles.Email}>Email</div>
							<div className={styles.Phone}>Phone</div>
							<div className={styles.Description}>Message</div>
							<div className={styles.Date}>Date</div>
							<div className={styles.Actions}>Actions</div>
						</div>

						<div className={styles.supportCards}>
							{loading ? (
								<Loading height="10rem" width="10rem" />
							) : (
								applications.map((item, index) => (
									<div className={styles.ApplicationCard} key={index}>
										<div className={styles.userId}>{index + 1}</div>
										<div className={styles.Name}>{item?.name}</div>
										<div className={styles.Email}>{item?.email}</div>
										<div className={styles.Phone}>{item?.phone}</div>

										<div className={styles.Description}>{item?.message}</div>
										<div className={styles.Date}>{dateFormat(item?.createdAt)}</div>
										<div className={styles.Actions}>
											<p onClick={() => handelDelete(item._id)}>
												<FaTrashAlt />
											</p>
										</div>
									</div>
								))
							)}
						</div>
					</>
				) : (
					<>
						<div className={styles.subHeading}>
							<div className={styles.userId}>Sl.No</div>
							<div className={styles.Name}>Name</div>
							<div className={styles.Email}>Email</div>
							<div className={styles.Phone}>Phone</div>
							{selectedCategory === "jobSeeker" && <div className={styles.Skills}>Skills</div>}
							<div className={styles.Description}>Links</div>
							<div className={styles.Date}>Date</div>
							<div className={styles.Actions}>Actions</div>
						</div>

						<div className={styles.supportCards}>
							{loading ? (
								<Loading height="10rem" width="10rem" />
							) : (
								applications.map((item, index) => (
									<div className={styles.ApplicationCard} key={index}>
										<div className={styles.userId}>{index + 1}</div>
										<div className={styles.Name}>{item?.name}</div>
										<div className={styles.Email}>{item?.email}</div>
										<div className={styles.Phone}>{item?.phone}</div>
										{selectedCategory === "jobSeeker" && <div className={styles.Skills}>{item?.skills}</div>}

										<div className={styles.Description}>{item?.link}</div>
										<div className={styles.Date}>{dateFormat(item?.createdAt)}</div>
										<div className={styles.Actions}>
											<p onClick={() => handelDelete(item._id)}>
												<FaTrashAlt />
											</p>
										</div>
									</div>
								))
							)}
						</div>
					</>
				)}

				<div className={styles.pagination}>
					<div className={styles.records}>{`Showing 10 of ${total.totalCount} users in ${page} page`}</div>
					<div className={styles.pageButtons}>
						<button
							className={styles.leftArrow}
							disabled={page === 1}
							onClick={() => {
								// setSelectedCategory("all");
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
								// setSelectedCategory("all");
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

export default Requests;
