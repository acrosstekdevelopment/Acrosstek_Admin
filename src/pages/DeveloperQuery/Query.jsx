import React, { useEffect, useState } from "react";
import DownArrow from "../../assets/svg/DownArrow.svg";
import leftArrow from "../../assets/svg/leftArrow.svg";
import rightArrow from "../../assets/svg/rightArrow.svg";
import { dateFormat } from "../../components/Functions/Date";
import Loading from "../../components/Hooks/Loading";
import axios from "../../components/Hooks/axios";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "./Query.module.scss";
import { useDeleteAlert } from "../../components/Hooks/useDeleteAlert";

function Query() {
	const [selectedCategory, setSelectedCategory] = useState("contact");
	const [applications, setApplications] = useState([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState({ totalCount: 0, totalPages: 1 });
	const [reload, setReload] = useState(0);
	const [loading, setLoading] = useState(true);

	const [filter, setFilter] = useState("Type 1");
	const [subMenu, setSubMenu] = useState(false);

	const handleFilter = (val) => {
		setFilter(val);
		setSubMenu(false);
	};

	useEffect(() => {
		setLoading(true);
		axios
			.get(`query/allQuery?type=${filter}`)
			.then(({ data }) => {
				setApplications(data.data);
				setTotal({ totalCount: data.totalCount, totalPages: data.totalPages });
				setLoading(false);
			})
			.catch((e) => console.log(e));
	}, [page, reload, filter]);

	const handelDelete = async (id) => {
		const confirmed = await useDeleteAlert();
		if (!confirmed) return;

		axios
			.delete(`/query/delete/${id}`)
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
						<div className={styles.SelectField}>
							<div className={styles.selectTime}>
								<h4>{filter}</h4>
								<img
									src={DownArrow}
									alt="DownArrow"
									style={{ transform: subMenu ? "rotate(-180deg)" : "" }}
									onClick={() => setSubMenu(!subMenu)}
								/>
							</div>
							{subMenu && (
								<div className={styles.menu}>
									<p onClick={() => handleFilter("Type 1")}>Type 1</p>
									<p onClick={() => handleFilter("Type 2")}>Type 2</p>
									<p onClick={() => handleFilter("Type 3")}>Type 3</p>
									<p onClick={() => handleFilter("Type 4")}>Type 4</p>
									<p onClick={() => handleFilter("Type 5")}>Type 5</p>
									<p onClick={() => handleFilter("Type 6")}>Type 6</p>
								</div>
							)}
						</div>

						<button className={styles.refresh} onClick={() => setReload(Math.random())}>
							Refresh
						</button>
					</div>
				</div>

				<div className={styles.subHeading}>
					<div className={styles.userId}>Sl.No</div>
					<div className={styles.Name}>Name</div>
					<div className={styles.Email}>Email</div>
					<div className={styles.Phone}>Phone</div>
					<div className={styles.Skills}>File</div>
					<div className={styles.Description}>Project Brief</div>
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
								<div className={styles.Skills}>
									{item?.file ? (
										<a href={item?.file} target="_blank">
											Link
										</a>
									) : (
										"No File"
									)}
								</div>
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

export default Query;
