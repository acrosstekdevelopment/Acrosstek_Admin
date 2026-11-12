import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./TagSelector.module.scss";

const TagSelector = ({ onTagsChange, existingTags = [] }) => {
	const { allTags } = useSelector((state) => state.tag);

	const [tagsArray, setTagsArray] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [selectedTags, setSelectedTags] = useState(existingTags);

	useEffect(() => {
		setTagsArray(allTags.map((item) => item.name));
	}, [allTags]);

	useEffect(() => {
		setSelectedTags(existingTags);
	}, [existingTags]);

	// Filter suggestions based on user input
	const filteredSuggestions = tagsArray.filter(
		(suggestion) => suggestion.toLowerCase().includes(inputValue.toLowerCase()) && !selectedTags.includes(suggestion)
	);

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	// Handle tag addition
	const handleAddTag = (tag) => {
		if (tag && !selectedTags.includes(tag)) {
			const updatedTags = [...selectedTags, tag];
			setSelectedTags(updatedTags);
			setInputValue("");
			onTagsChange(updatedTags);
		}
	};

	// Handle Enter key press for new tag addition
	const handleKeyPress = (e) => {
		if (e.key === "Enter" && inputValue) {
			handleAddTag(inputValue);
		}
	};

	// Handle tag deletion
	const handleDeleteTag = (tagIndex) => {
		const updatedTags = selectedTags.filter((_, index) => index !== tagIndex);
		setSelectedTags(updatedTags);
		onTagsChange(updatedTags);
	};

	return (
		<div className={styles.container}>
			<h3>Select Blog Tags</h3>
			<div className={styles.tagInputContainer}>
				{/* Display selected tags */}
				<div className={styles.tags}>
					{selectedTags.map((tag, index) => (
						<div key={index} className={styles.tag}>
							{tag}
							<button type="button" className={styles.removeTag} onClick={() => handleDeleteTag(index)}>
								x
							</button>
						</div>
					))}
				</div>

				{/* Input field for adding new tags */}
				<div className={styles.InputWrapper}>
					<input
						type="text"
						value={inputValue}
						onChange={handleInputChange}
						onKeyPress={handleKeyPress}
						placeholder="Add a tag..."
						className={styles.inputField}
					/>
					{/* Display filtered suggestions */}
					{inputValue && (
						<ul className={styles.suggestions}>
							{filteredSuggestions.length > 0 ? (
								filteredSuggestions.map((suggestion, index) => (
									<li key={index} onClick={() => handleAddTag(suggestion)}>
										{suggestion}
									</li>
								))
							) : (
								<li className={styles.noOptions}>No matching tags</li>
							)}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default TagSelector;
