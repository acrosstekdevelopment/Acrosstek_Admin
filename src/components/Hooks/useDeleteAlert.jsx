import Swal from "sweetalert2";

export const useDeleteAlert = async () => {
	const result = await Swal.fire({
		title: "Are you sure?",
		text: "You won't be able to revert this!",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#ff621f",
		cancelButtonColor: "#d33",
		confirmButtonText: "Yes, delete it!",
	});

	return result.isConfirmed;
};
