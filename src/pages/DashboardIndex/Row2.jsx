import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Flag from "../../assets/svg/Flag.svg";
import axios from "../../components/Hooks/axios";
import Loading from "../../components/Hooks/Loading";
import styles from "./Dashboard.module.scss";

const Row2 = () => {
	const [activeMapBtn, setActiveMapBtn] = useState("7daysAgo");
	const [pageViewData, setPageViewData] = useState([]);
	const [pageViewCount, setPageViewCount] = useState(0);
	const [pageViewLoading, setPageViewLoading] = useState(false);

	const [countryData, setCountryData] = useState({
		most_users_country: "IN",
		user_data: {
			AE: 5,
			CN: 12,
			DE: 1,
			GB: 1,
			IN: 60,
			NG: 4,
			PK: 1,
			SA: 1,
			SE: 1,
			US: 7,
		},
	});
	const [totalUserByCountry, setTotalUserByCountry] = useState(103);
	const [countryLoading, setCountryLoading] = useState(false);

	const totalPageViewCount = (data) => {
		const sum = data.reduce((accumulator, current) => accumulator + Number(current.count), 0);
		return sum;
	};
	useEffect(() => {
		setPageViewLoading(true);

		axios
			.get(`/getRoutePageViews`)
			.then(({ data }) => {
				setPageViewData(data.data);
				setPageViewCount(totalPageViewCount(data.data));
			})
			.catch((response) => {
				console.log("Error => ", response);
			})
			.finally(() => setPageViewLoading(false));
	}, []);

	const totalUserCountInCountry = (data) => {
		const sum = Object.values(data).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
		return sum;
	};
	// const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
	const displayNames = new Intl.DisplayNames(["en"], { type: "region" });

	// Function to get full country name from country code
	function getCountryName(countryCode) {
		return displayNames.of(countryCode);
	}

	// Example usage
	// const countryCode = "IN";
	// const countryName = getCountryName(countryCode);

	useEffect(() => {
		setCountryLoading(true);
		axios
			.get(`/getMostUsersCountry?time-range=${activeMapBtn}`)
			.then(({ data }) => {
				console.log(data);
				setCountryData(data?.data);
				setTotalUserByCountry(totalUserCountInCountry(data?.data?.user_data));
				setCountryLoading(false);
			})
			.catch((response) => {
				console.log("Error => ", response);
			});
	}, [activeMapBtn]);

	return (
		<div className={styles.Row2}>
			<div className={styles.Col2}>
				<div className={styles.Top}>
					<h1>Users Location</h1>

					<div className={styles.ButtonContainer}>
						<button className={activeMapBtn === "1daysAgo" ? styles.Active : ""} onClick={() => setActiveMapBtn("1daysAgo")}>
							Daily
						</button>
						<button className={activeMapBtn === "7daysAgo" ? styles.Active : ""} onClick={() => setActiveMapBtn("7daysAgo")}>
							Weekly
						</button>

						<button className={activeMapBtn === "30daysAgo" ? styles.Active : ""} onClick={() => setActiveMapBtn("30daysAgo")}>
							Monthly
						</button>

						<button className={activeMapBtn === "365daysAgo" ? styles.Active : ""} onClick={() => setActiveMapBtn("365daysAgo")}>
							Yearly
						</button>
					</div>
				</div>

				{countryLoading ? (
					<div className={styles.Loading}>
						<Loading />
					</div>
				) : (
					<>
						<div className={styles.Mid}>
							<VectorMap
								map={worldMill}
								containerStyle={{ with: "100%", height: "100%" }}
								backgroundColor="transparent"
								series={{
									regions: [
										{
											scale: ["#9db7df", "#0066ff"],
											values: countryData?.user_data,
										},
									],
								}}
								onRegionTipShow={function reginalTip(event, label, code) {
									return label.html(
										`<div> <p>${label.html()}</p>  <p>${countryData?.user_data[getCountryName(code)] || 0}</p> </div>`
									);
								}}
							/>
						</div>

						<div className={styles.Bottom}>
							<div className={styles.Box}>
								<img src={Flag} alt="" />
								<div className={styles.Text}>
									<h2>{countryData?.most_users_country}</h2>
									<p>
										{Math.floor((countryData?.user_data[countryData?.most_users_country] / totalUserByCountry) * 100)}
										% <span /> {countryData?.user_data[countryData?.most_users_country]} Users
									</p>
								</div>
							</div>
						</div>
					</>
				)}
			</div>

			<div className={styles.Col3}>
				<div className={styles.Top}>
					<h1>Pages Views</h1>
					<Link>View All</Link>
				</div>

				<div className={styles.Bottom}>
					{pageViewLoading ? (
						<div className={styles.Loading}>
							<Loading />
						</div>
					) : (
						pageViewData.map((data, index) => (
							<div key={index} className={styles.Box}>
								<div className={styles.Text}>
									<h4>{data?.route}</h4>
									<h5>{data?.count}</h5>
								</div>
								<div className={styles.Bar}>
									<span style={{ width: `${(data?.count / pageViewCount) * 100}%` }} />
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default Row2;
