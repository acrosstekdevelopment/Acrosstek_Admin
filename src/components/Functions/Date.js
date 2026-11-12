export const dateFormat = (date) => {
	const time = date.split("T")[1].split(".")[0];
	date = date.split("T")[0];
	return date;
};

function formatDate(isoString) {
	const date = new Date(isoString);

	// Options for the date formatting
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	return date.toLocaleDateString("en-US", options);
}

export { formatDate };
