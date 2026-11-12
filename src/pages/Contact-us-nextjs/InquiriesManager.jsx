import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { dateFormat } from "../../components/Functions/Date";
import Loading from "../../components/Hooks/Loading";
import axios from "../../components/Hooks/axios";
import { useDeleteAlert } from "../../components/Hooks/useDeleteAlert";
import styles from "./InquiriesManager.module.scss";

const ITEMS_PER_PAGE = 9;
const FETCH_LIMIT = 50;
const SKIP_SKILLS = ["notavailable", "ScheduleCall", "letsconnect"];

function InquiriesManager() {
	const [selectedCategory, setSelectedCategory] = useState("contact");
	const [allInquiries, setAllInquiries]         = useState([]);
	const [page, setPage]                         = useState(1);
	const [reload, setReload]                     = useState(0);
	const [loading, setLoading]                   = useState(true);
	const [viewModal, setViewModal]               = useState(null);
	const [selectedIds, setSelectedIds]           = useState([]);

	useEffect(() => {
		setLoading(true);
		setSelectedIds([]);
		axios
			.get(`contact_hire/allContact_hire?type=${selectedCategory}&page=1&limit=${FETCH_LIMIT}`)
			.then(({ data }) => {
				const cleaned = (data.data || []).filter(
					(item) => item.skills && !SKIP_SKILLS.includes(item.skills)
				);
				setAllInquiries(cleaned);
				setLoading(false);
			})
			.catch((e) => { console.log(e); setLoading(false); });
	}, [reload, selectedCategory]);

	const refresh = () => { setPage(1); setReload(Math.random()); };

	const totalPages    = Math.ceil(allInquiries.length / ITEMS_PER_PAGE);
	const startIndex    = (page - 1) * ITEMS_PER_PAGE;
	const pageInquiries = allInquiries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

	const isAllSelected = pageInquiries.length > 0 && pageInquiries.every((i) => selectedIds.includes(i._id));

	const toggleSelectAll = () =>
		setSelectedIds(isAllSelected
			? selectedIds.filter((id) => !pageInquiries.map((i) => i._id).includes(id))
			: [...new Set([...selectedIds, ...pageInquiries.map((i) => i._id)])]
		);

	const toggleOne = (id) =>
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
		);

	const handleDelete = async (id) => {
		const confirmed = await useDeleteAlert();
		if (!confirmed) return;
		axios
			.patch(`/contact_hire/softDelete/${id}`)
			.then(() => { toast.success("Moved to trash!"); refresh(); })
			.catch((e) => console.log(e));
	};

	const handleMultiDelete = async () => {
		const confirmed = await useDeleteAlert();
		if (!confirmed) return;
		axios
			.patch("/contact_hire/multiSoftDelete", { ids: selectedIds })
			.then(({ data }) => { toast.success(data.msg); refresh(); })
			.catch((e) => console.log(e));
	};

	return (
		<div className={styles.container}>
			<div className={styles.contentWrapper}>

				<div className={styles.tabs}>
					<button
						className={selectedCategory === "contact" ? styles.active : ""}
						onClick={() => { setSelectedCategory("contact"); setPage(1); }}>
						Contact Forms
					</button>
					<button
						className={selectedCategory === "hire developer" ? styles.active : ""}
						onClick={() => { setSelectedCategory("hire developer"); setPage(1); }}>
						Hire Developer
					</button>
					<button className={styles.refresh} onClick={refresh}>Refresh</button>
				</div>

				{allInquiries.length > 0 && (
					<div className={styles.selectBar}>
						<label className={styles.selectAll}>
							<input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} />
							<span>Select All</span>
						</label>
						{selectedIds.length > 0 && (
							<>
								<span className={styles.selectedCount}>{selectedIds.length} selected</span>
								<button className={styles.bulkDeleteBtn} onClick={handleMultiDelete}>
									<FaTrashAlt /> Delete Selected
								</button>
								<button className={styles.clearBtn} onClick={() => setSelectedIds([])}>✕</button>
							</>
						)}
					</div>
				)}

				{loading ? (
					<div className={styles.loadingWrap}>
						<Loading height="8rem" width="8rem" />
					</div>
				) : pageInquiries.length === 0 ? (
					<div className={styles.empty}>No inquiries found</div>
				) : (
					<div className={styles.grid}>
						{pageInquiries.map((item, index) => (
							<div
								key={item._id}
								className={`${styles.card} ${selectedIds.includes(item._id) ? styles.cardSelected : ""}`}>

								<div className={styles.cardTop}>
									<div className={styles.cardTopLeft}>
										<input
											type="checkbox"
											checked={selectedIds.includes(item._id)}
											onChange={() => toggleOne(item._id)}
										/>
										<span>#{startIndex + index + 1}</span>
									</div>
									<span>{dateFormat(item?.createdAt)}</span>
								</div>

								<div className={styles.cardBody}>
									<p><strong>Name:</strong> {item?.name || "N/A"}</p>
									<p><strong>Email:</strong> {item?.email || "N/A"}</p>
									<p><strong>Phone:</strong> {item?.phone || "N/A"}</p>
									{item?.company && <p><strong>Company:</strong> {item.company}</p>}
									{item?.skills && <p><strong>Requirement:</strong> {item.skills}</p>}
								</div>

								<div className={styles.cardActions}>
									<button onClick={() => setViewModal(item)}>
										<FaEye /> View
									</button>
									<button onClick={() => handleDelete(item._id)}>
										<FaTrashAlt /> Delete
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				{!loading && allInquiries.length > 0 && (
					<div className={styles.pagination}>
						<button
							disabled={page === 1}
							onClick={() => setPage(page - 1)}
							className={page === 1 ? styles.disabled : ""}>
							&lt; Previous
						</button>
						<div className={styles.pageInfo}>
							<span>Page {page} of {totalPages}</span>
							<span className={styles.totalCount}>Total: {allInquiries.length} inquiries</span>
						</div>
						<button
							disabled={page >= totalPages}
							onClick={() => setPage(page + 1)}
							className={page >= totalPages ? styles.disabled : ""}>
							Next &gt;
						</button>
					</div>
				)}
			</div>

			{viewModal && (
				<div className={styles.modalOverlay} onClick={() => setViewModal(null)}>
					<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
						<div className={styles.modalHeader}>
							<h2>Inquiry Details</h2>
							<button onClick={() => setViewModal(null)}>×</button>
						</div>
						<div className={styles.modalBody}>
							<p><strong>ID:</strong> {viewModal._id}</p>
							<p><strong>Name:</strong> {viewModal.name || "N/A"}</p>
							<p><strong>Email:</strong> {viewModal.email || "N/A"}</p>
							<p><strong>Phone:</strong> {viewModal.phone || "N/A"}</p>
							<p><strong>Company:</strong> {viewModal.company || "N/A"}</p>
							<p><strong>Requirement/Skills:</strong> {viewModal.skills || "N/A"}</p>
							<p><strong>Type:</strong> {viewModal.type || "N/A"}</p>
							{viewModal.writeSomething && (
								<div className={styles.message}>
									<strong>Message:</strong>
									<p>{viewModal.writeSomething}</p>
								</div>
							)}
							<p><strong>Created:</strong> {dateFormat(viewModal.createdAt)}</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default InquiriesManager;