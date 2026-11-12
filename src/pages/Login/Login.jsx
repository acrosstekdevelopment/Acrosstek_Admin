import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../../assets/images/AcrosstekLogo.webp";
import eye from "../../assets/svg/eye.svg";
import axios from "../../components/Hooks/axios";
import { setUser } from "../../redux/slice/authSlice";
import "./Login.scss";

// FLOW: "login" → "forgot" → "otp" → back to "login"

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// ── Login state ──
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// ── Forgot password state ──
	const [flow, setFlow] = useState("login"); // "login" | "forgot" | "otp"
	const [forgotEmail, setForgotEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [newPassVisible, setNewPassVisible] = useState(false);
	const [confirmPassVisible, setConfirmPassVisible] = useState(false);

	useEffect(() => {
		if (sessionStorage.getItem("krosshire_token")) navigate("/dashboard", { replace: true });
	}, []);

	// ════════════════════════════════════════
	//  LOGIN  →  POST /admin/login
	// ════════════════════════════════════════
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.email || !formData.password) return toast.error("Please fill all fields!");
		setIsLoading(true);

		axios
			.post("/admin/login", { email: formData.email, password: formData.password })
			.then(({ data }) => {
				if (data.status) {
					toast.success(data.msg);
					// store token + user in redux + sessionStorage
					sessionStorage.setItem("krosshire_token", data.data.token);
					axios.defaults.headers.Authorization = data.data.token;
					dispatch(setUser(data.data));
					navigate("/dashboard", { replace: true });
				} else {
					toast.error(data.msg);
				}
			})
			.catch(({ response }) => {
				toast.error(response?.data?.msg || "Login failed!");
			})
			.finally(() => setIsLoading(false));
	};

	// ════════════════════════════════════════
	//  STEP 1 — Send OTP
	//  PUT /admin/forgotPassword  { email }
	// ════════════════════════════════════════
	const handleSendOtp = (e) => {
		e.preventDefault();
		if (!forgotEmail) return toast.error("Please enter your email!");
		setIsLoading(true);

		axios
			.put("/admin/forgotPassword", { email: forgotEmail })
			.then(({ data }) => {
				// backend always returns status: true with a vague message
				// so we always move to otp step
				toast.success("OTP sent! Check your email.");
				setFlow("otp");
			})
			.catch(({ response }) => {
				toast.error(response?.data?.msg || "Something went wrong!");
			})
			.finally(() => setIsLoading(false));
	};

	// ════════════════════════════════════════
	//  STEP 2 — Verify OTP + set new password
	//  PUT /admin/resetPassword  { email, otp, newPassword }
	// ════════════════════════════════════════
	const handleResetPassword = (e) => {
		e.preventDefault();
		if (!otp) return toast.error("Please enter the OTP!");
		if (!newPassword || !confirmPassword) return toast.error("Please fill all password fields!");
		if (newPassword !== confirmPassword) return toast.error("Passwords do not match!");
		if (newPassword.length < 6) return toast.error("Password must be at least 6 characters!");
		setIsLoading(true);

		axios
			.put("/admin/resetPassword", {
				email: forgotEmail,
				otp: parseInt(otp, 10),  // backend stores as Number
				newPassword: newPassword, // key is "newPassword" in new controller
			})
			.then(({ data }) => {
				if (data.status) {
					toast.success("Password reset successfully! Please login.");
					resetForgotState();
					setFlow("login");
				} else {
					toast.error(data.msg || "Invalid OTP. Please try again!");
				}
			})
			.catch(({ response }) => {
				toast.error(response?.data?.msg || "Something went wrong!");
			})
			.finally(() => setIsLoading(false));
	};

	// ── Helpers ──
	const resetForgotState = () => {
		setForgotEmail("");
		setOtp("");
		setNewPassword("");
		setConfirmPassword("");
		setNewPassVisible(false);
		setConfirmPassVisible(false);
	};

	const goBackToLogin = () => {
		resetForgotState();
		setFlow("login");
	};

	// ════════════════════════════════════════
	//  RENDER
	// ════════════════════════════════════════
	const renderForm = () => {

		// ── STEP 1: Enter email ──
		if (flow === "forgot") {
			return (
				<div className="formCon">
					<button className="backBtn" type="button" onClick={goBackToLogin}>
						← Back to Login
					</button>
					<h1>Forgot Password</h1>
					<p className="subText">
						Enter your admin email. An OTP will be sent if it is registered.
					</p>
					<form onSubmit={handleSendOtp}>
						<div className="inputs">
							<div className="inp1">
								<label htmlFor="forgotEmail">Email Address</label>
								<input
									type="email"
									id="forgotEmail"
									placeholder="admin@acrosstek.com"
									value={forgotEmail}
									onChange={(e) => setForgotEmail(e.target.value)}
									autoComplete="email"
								/>
							</div>
						</div>
						<button disabled={isLoading} type="submit">
							{isLoading ? "Sending OTP..." : "Send OTP"}
						</button>
					</form>
				</div>
			);
		}

		// ── STEP 2: Enter OTP + new password ──
		if (flow === "otp") {
			return (
				<div className="formCon">
					<button className="backBtn" type="button" onClick={() => setFlow("forgot")}>
						← Back
					</button>
					<h1>Reset Password</h1>
					<p className="subText">
						Enter the 6-digit OTP sent to <strong>{forgotEmail}</strong> and set your new password.
					</p>
					<form onSubmit={handleResetPassword}>
						<div className="inputs">
							<div className="inp1">
								<label htmlFor="otp">OTP Code</label>
								<input
									type="number"
									id="otp"
									placeholder="Enter 6-digit OTP"
									value={otp}
									onChange={(e) => setOtp(e.target.value)}
								/>
							</div>

							<div className="inp2">
								<div className="passwordCon">
									<label htmlFor="newPassword">New Password</label>
								</div>
								<div className="inputCon">
									<input
										type={newPassVisible ? "text" : "password"}
										id="newPassword"
										placeholder="••••••••"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
									/>
									<div className="eye" onClick={() => setNewPassVisible((v) => !v)}>
										<img src={eye} alt="toggle" />
									</div>
								</div>
							</div>

							<div className="inp2">
								<div className="passwordCon">
									<label htmlFor="confirmPassword">Confirm Password</label>
								</div>
								<div className="inputCon">
									<input
										type={confirmPassVisible ? "text" : "password"}
										id="confirmPassword"
										placeholder="••••••••"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
									/>
									<div className="eye" onClick={() => setConfirmPassVisible((v) => !v)}>
										<img src={eye} alt="toggle" />
									</div>
								</div>
							</div>
						</div>

						<button disabled={isLoading} type="submit">
							{isLoading ? "Resetting..." : "Reset Password"}
						</button>
					</form>
				</div>
			);
		}

		// ── DEFAULT: Login ──
		return (
			<div className="formCon">
				<h1>Sign in to your account</h1>
				<form onSubmit={handleSubmit}>
					<div className="inputs">
						<div className="inp1">
							<label htmlFor="email">Email Address</label>
							<input
								type="email"
								name="email"
								id="email"
								placeholder="example@gmail.com"
								value={formData.email}
								onChange={handleInputChange}
							/>
						</div>
						<div className="inp2">
							<div className="passwordCon">
								<label htmlFor="password">Password</label>
								<div
									className="forgot"
									role="button"
									tabIndex={0}
									onClick={() => setFlow("forgot")}
									onKeyDown={(e) => e.key === "Enter" && setFlow("forgot")}
								>
									Forgot Password?
								</div>
							</div>
							<div className="inputCon">
								<input
									type={passwordVisible ? "text" : "password"}
									name="password"
									id="password"
									placeholder="••••••••"
									value={formData.password}
									onChange={handleInputChange}
								/>
								<div className="eye" onClick={() => setPasswordVisible((v) => !v)}>
									<img src={eye} alt="toggle visibility" />
								</div>
							</div>
						</div>
					</div>

					<button disabled={isLoading} type="submit">
						{isLoading ? "Signing in..." : "Login"}
					</button>
				</form>
			</div>
		);
	};

	return (
		<div className="LoginContainer">
			<div className="leftSection">
				<div className="glow-orb orb-1"></div>
				<div className="glow-orb orb-2"></div>
				<div className="glow-orb orb-3"></div>
				<div className="glow-orb orb-4"></div>

				<div className="contentWrapper">
					<div className="logoContainer">
						<img src={Logo} alt="Acrosstek Logo" />
					</div>
					<h1 className="welcomeTitle">
						WELCOME TO
						<br />
						<span className="brandName">ACROSSTEK™</span>
					</h1>
					<p className="tagline">DIGITAL WORKFORCE SOLUTION</p>
					<div className="features">
						<span className="featureTag">Analytics</span>
						<span className="featureTag">Team Management</span>
						<span className="featureTag">Reports</span>
						<span className="featureTag">Security</span>
					</div>
				</div>
			</div>

			<div className="rightSection">{renderForm()}</div>
		</div>
	);
};

export default Login;