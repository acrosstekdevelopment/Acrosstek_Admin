import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import axios from "../../components/Hooks/axios";
import { setRefreshTag } from "../../redux/slice/tempSlice";

// Create a custom hook that uses dispatch
// In your custom hook file
export const useTagAlerts = () => {
	const dispatch = useDispatch();

	const useAddTagAlert = async () => {
		const { value: tagName } = await Swal.fire({
			title: "Enter tag name",
			input: "text",
			inputPlaceholder: "Enter tag name",
			inputAttributes: {
				autocapitalize: "off",
			},
			showCancelButton: true,
			confirmButtonText: "Add",
			cancelButtonText: "Cancel",
			confirmButtonColor: "#ff621f",
			cancelButtonColor: "#d33",
			showLoaderOnConfirm: true,
			preConfirm: async (name) => {
				try {
					const response = await axios.post("/tags", { name });

					if (response.status !== 201) {
						return Swal.showValidationMessage(`Error: ${response.data.msg || "Failed to add tag"}`);
					}

					return response.data;
				} catch (error) {
					Swal.showValidationMessage(`Request failed: ${error.response?.data?.msg || error.message}`);
				}
			},
			allowOutsideClick: () => !Swal.isLoading(),
		});

		if (tagName) {
			dispatch(setRefreshTag());
			Swal.fire({
				icon: "success",
				title: "Tag added successfully",
				text: `The tag "${tagName?.data?.name}" has been added!`,
			});
		} else {
			Swal.fire({
				icon: "error",
				title: "Cancelled",
				text: "Tag addition was cancelled!",
			});
		}
	};

	return { useAddTagAlert };
};
