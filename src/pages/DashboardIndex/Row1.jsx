import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import axios from "../../components/Hooks/axios";
import Loading from "../../components/Hooks/Loading";
import styles from "./Dashboard.module.scss";

const Row1 = () => {
	const [eventData, setEventData] = useState([
		{
			event_count: "2671",
			event_name: "page_view",
		},
		{
			event_count: "715",
			event_name: "scroll",
		},
		{
			event_count: "466",
			event_name: "user_engagement",
		},
		{
			event_count: "191",
			event_name: "session_start",
		},
		{
			event_count: "81",
			event_name: "first_visit",
		},
		{
			event_count: "1",
			event_name: "click",
		},
	]);
	const [eventCount, setEventCount] = useState(0);
	const [eventLoading, setEventLoading] = useState(false);

	const [userActivate, setUserActivate] = useState({
		last_1_day: {
			data: [
				{
					active_users: "5",
					date: "20240801",
				},
			],
			total_active_users: 5,
		},
		last_30_days: {
			data: [
				{
					active_users: "15",
					date: "20240705",
				},
				{
					active_users: "13",
					date: "20240703",
				},
				{
					active_users: "12",
					date: "20240719",
				},
				{
					active_users: "11",
					date: "20240706",
				},
				{
					active_users: "9",
					date: "20240718",
				},
				{
					active_users: "6",
					date: "20240712",
				},
				{
					active_users: "6",
					date: "20240716",
				},
				{
					active_users: "5",
					date: "20240704",
				},
				{
					active_users: "5",
					date: "20240715",
				},
				{
					active_users: "5",
					date: "20240720",
				},
				{
					active_users: "5",
					date: "20240801",
				},
				{
					active_users: "4",
					date: "20240709",
				},
				{
					active_users: "4",
					date: "20240711",
				},
				{
					active_users: "4",
					date: "20240713",
				},
				{
					active_users: "4",
					date: "20240725",
				},
				{
					active_users: "4",
					date: "20240731",
				},
				{
					active_users: "3",
					date: "20240708",
				},
				{
					active_users: "3",
					date: "20240710",
				},
				{
					active_users: "3",
					date: "20240714",
				},
				{
					active_users: "3",
					date: "20240717",
				},
				{
					active_users: "3",
					date: "20240724",
				},
				{
					active_users: "3",
					date: "20240728",
				},
				{
					active_users: "2",
					date: "20240707",
				},
				{
					active_users: "2",
					date: "20240722",
				},
				{
					active_users: "2",
					date: "20240729",
				},
				{
					active_users: "2",
					date: "20240730",
				},
				{
					active_users: "1",
					date: "20240723",
				},
				{
					active_users: "1",
					date: "20240726",
				},
			],
			total_active_users: 140,
		},
		last_7_days: {
			data: [
				{
					active_users: "5",
					date: "20240801",
				},
				{
					active_users: "4",
					date: "20240731",
				},
				{
					active_users: "3",
					date: "20240728",
				},
				{
					active_users: "2",
					date: "20240729",
				},
				{
					active_users: "2",
					date: "20240730",
				},
				{
					active_users: "1",
					date: "20240726",
				},
			],
			total_active_users: 17,
		},
	});
	const [user_30, setUser_30] = useState([
		10, 23, 356, 17, 36, 428, 10, 123, 36, 17, 36, 128, 10, 233, 36, 117, 365, 2810, 23, 36, 17, 36, 28,
	]);
	const [date_30, setDate_30] = useState([
		20240701, 20240702, 20240703, 20240704, 20240705, 20240706, 20240707, 20240708, 20240709, 20240710, 20240711, 20240712,
		20240713, 20240714, 20240715, 20240716, 20240717, 20240718, 20240719, 20240720, 20240721, 20240722, 20240723, 20240724,
		20240725, 20240726, 20240727, 20240728, 20240729, 20240730,
	]);
	const [user_07, setUser_07] = useState([102, 232, 362, 172, 362, 28, 26]);
	const [user_01, setUser_01] = useState([106]);
	const [userLoading, setUserLoading] = useState(false);

	const totalEventCount = (data) => {
		const sum = data.reduce((accumulator, current) => accumulator + Number(current.event_count), 0);
		return sum;
	};

	useEffect(() => {
		setUserLoading(true);
		// setEventLoading(true);
		axios
			.get(`/user-activity`)
			.then(({ data }) => {
				setUserActivate(data?.data);
				const u_30 = [];
				const d_30 = [];
				const u_07 = [];
				const u_01 = [];
				data?.data?.last_30_days?.data.map((item) => {
					u_30.push(Number(item?.active_users));
					d_30.push(Number(item?.date));
				});
				data?.data?.last_7_days?.data.map((item) => {
					u_07.push(Number(item?.active_users));
				});
				data?.data?.last_1_day?.data.map((item) => {
					u_01.push(Number(item?.active_users));
				});
				setUser_30(u_30);
				setDate_30(d_30);
				setUser_07(u_07);
				setUser_01(u_01);

				setUserLoading(false);
			})
			.catch(({ response }) => {
				console.log("Error => ", response);
			});

		// 	//event

		setEventLoading(true);
		axios
			.get(`/getEventCounts`)
			.then(({ data }) => {
				console.log(data);
				setEventData(data?.data);
				setEventCount(totalEventCount(data?.data));
			})
			.catch(({ response }) => {
				console.log("Error => ", response);
			})
			.finally(() => setEventLoading(false));
	}, []);

	return (
		<div className={styles.Row1}>
			<div className={styles.Col1}>
				<div className={styles.Top}>
					<h1>Users Activity over Time</h1>
				</div>

				<div className={styles.Bottom}>
					{userLoading ? (
						<div className={styles.Loading} style={{ margin: "auto" }}>
							<Loading />
						</div>
					) : (
						<>
							<div className={styles.Left}>
								<Chart
									options={{
										yaxis: {
											labels: {
												formatter: function (value) {
													return value;
												},
												style: {
													colors: "#CBD5E0",
												},
											},
										},
										xaxis: {
											categories: date_30,
											tickPlacement: "between",
											labels: {
												formatter: function (value) {
													const year = Math.floor(value / 10000);
													const month = Math.floor((value % 10000) / 100);
													const dateObject = new Date(year, month - 1, 1);
													const formattedDate = new Intl.DateTimeFormat("en-US", {
														year: "2-digit",
														month: "numeric",
													}).format(dateObject);

													return formattedDate;
												},
												style: {
													colors: "#CBD5E0",
												},
											},
										},
										legend: {
											show: false,
										},
										chart: {
											toolbar: {
												show: false,
											},
										},
										stroke: {
											show: true,
											curve: "smooth",
											lineCap: "round",
											colors: undefined,
											width: 3,
											dashArray: 0,
										},
										dataLabels: {
											enabled: false,
										},
										grid: {
											borderColor: "#56577A",
											strokeDashArray: 4,
										},
									}}
									series={[
										{
											type: "line",
											name: "30 days",
											color: "#0075FF",
											data: user_30,
										},
										{
											type: "line",
											name: "07 days",
											color: "#2CD9FF",
											data: user_07,
										},
										{
											type: "line",
											name: "01 day",
											color: "#EE2CFF",
											data: user_01,
										},
									]}
									width="100%"
									height="100%"
								/>
							</div>

							<div className={styles.Right}>
								<div>
									<p>
										<span style={{ background: "#0075FF" }} /> 30 Days
									</p>
									<h1>{userActivate?.last_30_days?.total_active_users}</h1>
								</div>

								<div>
									<p>
										<span style={{ background: "#2CD9FF" }} />
										07 Days
									</p>
									<h1>{userActivate?.last_7_days?.total_active_users}</h1>
								</div>

								<div>
									<p>
										<span style={{ background: "#EE2CFF" }} />
										01 Days
									</p>
									<h1>{userActivate?.last_1_day?.total_active_users}</h1>
								</div>
							</div>
						</>
					)}
				</div>
			</div>

			<div className={styles.Col2}>
				<div className={styles.Top}>
					<h1>Events Counts</h1>
					<Link>View All</Link>
				</div>

				<div className={styles.Bottom}>
					{eventLoading ? (
						<div className={styles.Loading}>
							<Loading />
						</div>
					) : (
						eventData.map((data, index) => (
							<div key={index} className={styles.Box}>
								<div className={styles.Text}>
									<h4>{data.event_name}</h4>
									<h5>{data.event_count}</h5>
								</div>
								<div className={styles.Bar}>
									<span style={{ width: `${(Number(data.event_count) / eventCount) * 100}%` }} />
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default Row1;
