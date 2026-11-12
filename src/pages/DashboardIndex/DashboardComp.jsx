import React from "react";
import styles from "./Dashboard.module.scss";
import Row1 from "./Row1";
import Row2 from "./Row2";

const Dashboard = () => {
	return (
		<div className={styles.Dashboard}>
			{/* <div className={styles.UpperSection}>{items && items.map((item, i) => <UpperCards key={i} {...item} />)}</div> */}
			<Row1 />
			<Row2 />
		</div>
	);
};

export default Dashboard;

const UpperCards = ({ id, count, itemName, imgUrl }) => {
	return (
		<div className={styles.cardContainer}>
			<div className={styles.upperSection}>
				<div className={styles.details}>
					<h3>{count}</h3>
					<h4>{itemName}</h4>
				</div>

				<div className={styles.prod}>
					<img src={imgUrl} alt="" />
				</div>
			</div>

			<div className={styles.line}>
				<hr />
			</div>

			<div className={styles.lowerSection}>
				<p>Last Updated at {"15 minutes ago"} </p>
				<button>More Info</button>
			</div>
		</div>
	);
};
