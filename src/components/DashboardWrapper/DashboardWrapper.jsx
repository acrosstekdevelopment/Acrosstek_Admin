import React, { useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { FaPenNib, FaTags } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { GrBlog } from "react-icons/gr";
import { IoIosNotifications } from "react-icons/io";
import { MdDashboard, MdLogout, MdOutlineSupportAgent, MdWork } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/AcrosstekLogo.png";
import { fetchLanguageFromLocal, removeUser, setLanguage } from "../../redux/slice/authSlice";
import styles from "./DashboardWrapper.module.scss";
import { Trash } from "lucide-react";

const DashboardWrapper = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { pathname } = useLocation();
	const { language } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(fetchLanguageFromLocal());
	}, []);

	return (
		<div className={styles.dashboardContainer}>
			<div className={styles.sidebar}>
				<div className={styles.Logo} onClick={() => navigate("/dashboard")}>
					<img src={Logo} alt="Logo" />
				</div>

				<div className={styles.menu}>
					<div
						className={`${styles.items} ${pathname === "/dashboard" ? styles.activeItem : ""}`}
						onClick={() => navigate("/dashboard")}>
						<MdDashboard />
						<p>Dashboard</p>
					</div>

					{/* <div className={`${styles.items} ${pathname === "/jobs" ? styles.activeItem : ""}`} onClick={() => navigate("/jobs")}>
						<MdWork />
						<p>Jobs</p>
					</div> */}

					<div className={`${styles.items} ${pathname === "/nextjobs" ? styles.activeItem : ""}`} onClick={() => navigate("/nextjobs")}>
						<MdWork />
						<p>Nextjs Jobs</p>
					</div>


					<div
						className={`${styles.items} ${pathname === "/author" ? styles.activeItem : ""}`}
						onClick={() => navigate("/author")}>
						<FaPenNib />
						<p>Authors</p>
					</div>

					<div
						className={`${styles.items} ${pathname === "/requests" ? styles.activeItem : ""}`}
						onClick={() => navigate("/requests")}>
						<FaNoteSticky />
						<p>Requests</p>
					</div>

					<div
						className={`${styles.items} ${pathname === "/jobs-application" ? styles.activeItem : ""}`}
						onClick={() => navigate("/jobs-application")}>
						<FaNoteSticky />
						<p>Job Applications</p>
					</div>

					<div
						className={`${styles.items} ${pathname === "/popup-form" ? styles.activeItem : ""}`}
						onClick={() => navigate("/popup-form")}>
						<MdOutlineSupportAgent />
						<p>Form Data</p>
					</div>

					<div className={`${styles.items} ${pathname === "/tags" ? styles.activeItem : ""}`} onClick={() => navigate("/tags")}>
						<FaTags />
						<p>Manage Tags</p>
					</div>

					<div
						className={`${styles.items} ${pathname === "/blogs" || pathname === "/add-blog" ? styles.activeItem : ""}`}
						onClick={() => navigate("/blogs")}>
						<GrBlog />
						<p>Blogs</p>
					</div>

					<div
						className={`${styles.items} ${pathname === "/blogNext" || pathname === "/add-blog2" ? styles.activeItem : ""}`}
						onClick={() => navigate("/blogNext")}>
						<GrBlog />
						<p>Nextjs Blogs</p>
					</div>

					{/* <div
						className={`${styles.items} ${pathname === "/contact" ? styles.activeItem : ""}`}
						onClick={() => navigate("/contact")}>
						<MdOutlineSupportAgent />
						<p>Contact/Hire</p>
					</div> */}

					<div
						className={`${styles.items} ${pathname === "/contact-us" ? styles.activeItem : ""}`}
						onClick={() => navigate("/contact-us")}>
						<MdOutlineSupportAgent />
						<p>Contact/Hire (next)</p>
					</div>

					{/* <div
						className={`${styles.items} ${pathname === "/quote" ? styles.activeItem : ""}`}
						onClick={() => navigate("/quote")}>
						<MdOutlineSupportAgent />
						<p>Quote</p>
					</div> */}

					


					<div className={`${styles.items} ${pathname === "/query" ? styles.activeItem : ""}`} onClick={() => navigate("/query")}>
						<MdOutlineSupportAgent />
						<p>Query</p>
					</div>

					<div className={`${styles.items} ${pathname === "/trash" ? styles.activeItem : ""}`} onClick={() => navigate("/trash")}>
						<Trash/>
						<p>Trash</p>
					</div>


					<div
						className={styles.items}
						onClick={() => {
							navigate("/", { replace: true });
							dispatch(removeUser());
						}}>
						<MdLogout />
						<p>Logout</p>
					</div>
				</div>
			</div>

			<div className={styles.content}>
				<div className={styles.navbar}>
					<div className={styles.languageNotification}>
						<select
							name="language"
							id=""
							className={styles.language}
							value={language}
							onChange={(e) => dispatch(setLanguage(e.target.value))}>
							<option value="English">English</option>
							<option value="German">German</option>
							<option value="French">French</option>
						</select>

						<div className={styles.notification}>
							<IoIosNotifications />
						</div>

						<div className={styles.profilePic}>
							<CgProfile />
						</div>
					</div>
				</div>

				<div className={styles.mainSection}>
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default DashboardWrapper;
