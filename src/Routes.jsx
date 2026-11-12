import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardWrapper from "./components/DashboardWrapper/DashboardWrapper";
import ScrollToTop from "./components/Hooks/ScrollToTop";
import axios from "./components/Hooks/axios";
import { clearCacheData } from "./components/Hooks/clearCacheData";
import LoadingIndicator from "./components/LoadingIndicator/LoadingIndicator";
import Author from "./pages/Author/Author";
import AddBlog from "./pages/Blogs/AddBlog";
import Blogs from "./pages/Blogs/Blogs";
import UpdateBlog from "./pages/Blogs/updateBlog";
import ContactUS from "./pages/ContactUS/ContactUS";
import Dashboard from "./pages/DashboardIndex/DashboardComp";
import Query from "./pages/DeveloperQuery/Query";
import Jobs from "./pages/Job/Jobs";
import Login from "./pages/Login/Login";
import Page404 from "./pages/Page404/Page404";
import Requests from "./pages/RequestsPage/Requests";
import Tag from "./pages/Tag/Tag";
import { setAllTags, setTagLoading } from "./redux/slice/tagSlice";
import Quote from "./pages/Quote/Quote";
import AddBlog2 from "./pages/BlogsNext/AddBlog2";
import BlogNext from "./pages/BlogsNext/BlogNext";
import BlogForm from "./pages/BlogsNext/BlogForm";
import JobPosting from "./pages/JobPosting/JobPosting";
import JobAdd from "./pages/JobPosting/JobAdd";
import JobQuery from "./pages/JobPosting/JobQuery";
import EditBlog2 from "./pages/BlogsNext/EditBlog2";
import InquiriesManager from "./pages/Contact-us-nextjs/InquiriesManager";
import Form from "./pages/Form/Form";
import Trash from "./pages/Trash/Trash";

function App() {
	clearCacheData();
	const { refreshTag } = useSelector((state) => state.temp);
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setTagLoading(true));
		axios
			.get(`/tags`)
			.then(({ data }) => {
				console.log(data);
				dispatch(setAllTags(data?.data));
			})
			.catch((e) => console.log(e))
			.finally(() => dispatch(setTagLoading(false)));
	}, [refreshTag]);
	return (
		<BrowserRouter>
			<ScrollToTop />

			<ToastContainer
				position="top-right"
				autoClose={3000}
				limit={4}
				hideProgressBar={false}
				newestOnTop={false}
				rtl={false}
				pauseOnFocusLoss={false}
				draggable={false}
				pauseOnHover
			/>

			<Suspense fallback={<LoadingIndicator />}>
				<Routes>
					<Route path="*" element={<Page404 />} />
					<Route exact path="/" element={<Login />} />

					<Route element={<DashboardWrapper />}>
						<Route exact path="/dashboard" element={<Dashboard />} />
						<Route exact path="/jobs" element={<Jobs />} />
						<Route exact path="/contact" element={<ContactUS />} />
						<Route exact path="/contact-us" element={<InquiriesManager/>} />
						{/* <Route exact path="/quote" element={<Quote/>} /> */}
						<Route exact path="/query" element={<Query />} />
						<Route exact path="/requests" element={<Requests />} />
						<Route exact path="/blogs" element={<Blogs />} />
						<Route exact path="/blogNext" element={<BlogNext />} />
						<Route exact path="/author" element={<Author />} />
						<Route exact path="/tags" element={<Tag />} />
						<Route exact path="/add-blog" element={<AddBlog />} />
						<Route exact path="/add-blog2" element={<AddBlog2 />} />
						<Route path="/blog/edit/:slug" element={<EditBlog2 />} />
						<Route exact path="/update-blog/:id" element={<UpdateBlog />} />
						<Route exact path="/blog2/update/:id" element={<BlogForm />} />
						<Route exact path="/nextJobs" element={<JobPosting />} />
						<Route exact path="/add-job" element={<JobAdd/>} />
						<Route exact path="/job/edit/:id" element={<JobAdd/>} />
						<Route exact path="/jobs-application" element={<JobQuery/>} />

						<Route exact path="/trash" element={<Trash/>} />
						<Route exact path="/popup-form" element={<Form/>} />
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}

export default App;
