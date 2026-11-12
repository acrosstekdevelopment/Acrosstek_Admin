import React, { useEffect, useState } from "react";
import { MdDeleteForever, MdOutlineRestore } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { dateFormat } from "../../components/Functions/Date";
import Loading from "../../components/Hooks/Loading";
import axios from "../../components/Hooks/axios";
import { useDeleteAlert } from "../../components/Hooks/useDeleteAlert";
import styles from "./Trash.module.scss";

const ITEMS_PER_PAGE = 15;

function Trash() {
	const [items, setItems]             = useState([]);
	const [page, setPage]               = useState(1);
	const [total, setTotal]             = useState({ totalCount: 0, totalPages: 1 });
	const [reload, setReload]           = useState(0);
	const [loading, setLoading]         = useState(true);
	const [selectedIds, setSelectedIds] = useState([]);
	const [viewModal, setViewModal]     = useState(null);

	useEffect(() => {
		setLoading(true);
		setSelectedIds([]);
		axios
			.get(`contact_hire/allContact_hire?trash=true&page=${page}&limit=${ITEMS_PER_PAGE}`)
			.then(({ data }) => {
				setItems(data.data);
				setTotal({ totalCount: data.totalCount, totalPages: data.totalPages });
				setLoading(false);
			})
			.catch((e) => { console.log(e); setLoading(false); });
	}, [page, reload]);

	const refresh = () => setReload(Math.random());

	const isAllSelected = items.length > 0 && selectedIds.length === items.length;
	const toggleSelectAll = () => setSelectedIds(isAllSelected ? [] : items.map((i) => i._id));
	const toggleOne = (id) =>
		setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

	const handleRestore = (id) => {
		axios.patch(`/contact_hire/restore/${id}`)
			.then(() => { toast.success("Restored!"); refresh(); })
			.catch((e) => console.log(e));
	};

	const handleMultiRestore = () => {
		axios.patch("/contact_hire/multiRestore", { ids: selectedIds })
			.then(({ data }) => { toast.success(data.msg); refresh(); })
			.catch((e) => console.log(e));
	};

	const handlePermanentDelete = async (id) => {
		const confirmed = await useDeleteAlert();
		if (!confirmed) return;
		axios.delete(`/contact_hire/permanentDelete/${id}`)
			.then(() => { toast.success("Deleted!"); refresh(); })
			.catch((e) => console.log(e));
	};

	const handleMultiPermanentDelete = async () => {
		const confirmed = await useDeleteAlert();
		if (!confirmed) return;
		axios.delete("/contact_hire/multiPermanentDelete", { data: { ids: selectedIds } })
			.then(({ data }) => { toast.success(data.msg); refresh(); })
			.catch((e) => console.log(e));
	};

	const handleEmptyTrash = async () => {
		const confirmed = await useDeleteAlert();
		if (!confirmed) return;
		const allIds = items.map((i) => i._id);
		axios.delete("/contact_hire/multiPermanentDelete", { data: { ids: allIds } })
			.then(() => { toast.success("Trash emptied!"); refresh(); })
			.catch((e) => console.log(e));
	};

	return (
		<div className={styles.container}>

			{/* ── Header ── */}
			<div className={styles.header}>
				<h1>Trash <span>{total.totalCount} items</span></h1>
				<div className={styles.headerBtns}>
					<button className={styles.refreshBtn} onClick={refresh}>Refresh</button>
					{items.length > 0 && (
						<button className={styles.emptyBtn} onClick={handleEmptyTrash}>
							<MdDeleteForever /> Empty Trash
						</button>
					)}
				</div>
			</div>

			{/* ── Table ── */}
			<div className={styles.tableWrapper}>

				{/* Table Head */}
				<div className={styles.tableHead}>
					<div className={styles.colCheck}>
						<input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} />
					</div>
					<div className={styles.colNo}>#</div>
					<div className={styles.colName}>Name</div>
					<div className={styles.colEmail}>Email</div>
					<div className={styles.colType}>Type</div>
					<div className={styles.colDate}>Date</div>
					<div className={styles.colActions}>Actions</div>
				</div>

				{/* Bulk bar — only when selected */}
				{selectedIds.length > 0 && (
					<div className={styles.bulkBar}>
						<span>{selectedIds.length} selected</span>
						<button className={styles.bulkRestore} onClick={handleMultiRestore}>
							<MdOutlineRestore /> Restore
						</button>
						<button className={styles.bulkDelete} onClick={handleMultiPermanentDelete}>
							<MdDeleteForever /> Delete Forever
						</button>
						<button className={styles.bulkClear} onClick={() => setSelectedIds([])}>✕ Clear</button>
					</div>
				)}

				{/* Rows */}
				<div className={styles.tableBody}>
					{loading ? (
						<div className={styles.center}><Loading height="6rem" width="6rem" /></div>
					) : items.length === 0 ? (
						<div className={styles.empty}>🗑️ Trash is empty</div>
					) : (
						items.map((item, index) => (
							<div
								key={item._id}
								className={`${styles.row} ${selectedIds.includes(item._id) ? styles.rowSelected : ""}`}>
								<div className={styles.colCheck}>
									<input
										type="checkbox"
										checked={selectedIds.includes(item._id)}
										onChange={() => toggleOne(item._id)}
									/>
								</div>
								<div className={styles.colNo}>{(page - 1) * ITEMS_PER_PAGE + index + 1}</div>
								<div className={styles.colName}>{item?.name || "—"}</div>
								<div className={styles.colEmail}>{item?.email || "—"}</div>
								<div className={styles.colType}>
									<span className={styles.typePill}>{item?.type || "—"}</span>
								</div>
								<div className={styles.colDate}>{dateFormat(item?.createdAt)}</div>
								<div className={styles.colActions}>
									<button className={styles.btnView} title="View" onClick={() => setViewModal(item)}>
										<FaEye />
									</button>
									<button className={styles.btnRestore} title="Restore" onClick={() => handleRestore(item._id)}>
										<MdOutlineRestore />
									</button>
									<button className={styles.btnDelete} title="Delete Forever" onClick={() => handlePermanentDelete(item._id)}>
										<MdDeleteForever />
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			{/* ── Pagination ── */}
			{!loading && items.length > 0 && (
				<div className={styles.pagination}>
					<span className={styles.pageInfo}>
						Page {page} of {total.totalPages} &nbsp;·&nbsp; {total.totalCount} total
					</span>
					<div className={styles.pageBtns}>
						<button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
						<span className={styles.pageNum}>{page}</span>
						<button disabled={page >= total.totalPages} onClick={() => setPage(page + 1)}>Next →</button>
					</div>
				</div>
			)}

			{/* ── Modal ── */}
			{viewModal && (
				<div className={styles.overlay} onClick={() => setViewModal(null)}>
					<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
						<div className={styles.modalHeader}>
							<h2>Details</h2>
							<button onClick={() => setViewModal(null)}>×</button>
						</div>
						<div className={styles.modalBody}>
							{[
								["Name",        viewModal.name],
								["Email",       viewModal.email],
								["Phone",       viewModal.phone],
								["Company",     viewModal.company],
								["Type",        viewModal.type],
								["Skills",      viewModal.skills],
								["Message",     viewModal.writeSomething],
								["Created",     dateFormat(viewModal.createdAt)],
							].map(([label, val]) =>
								val ? (
									<div className={styles.modalRow} key={label}>
										<span>{label}</span>
										<p>{val}</p>
									</div>
								) : null
							)}
						</div>
						<div className={styles.modalFooter}>
							<button className={styles.modalRestore}
								onClick={() => { handleRestore(viewModal._id); setViewModal(null); }}>
								<MdOutlineRestore /> Restore
							</button>
							<button className={styles.modalDelete}
								onClick={() => { handlePermanentDelete(viewModal._id); setViewModal(null); }}>
								<MdDeleteForever /> Delete Forever
							</button>
							<button className={styles.modalClose} onClick={() => setViewModal(null)}>Close</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Trash;