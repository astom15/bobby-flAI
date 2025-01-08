export const mergeLists = (
	existingItems: string[],
	newItems: string[]
): string[] => {
	return Array.from(new Set([...existingItems, ...newItems]));
};

export const removeItemsFromList = (
	existingItems: string[],
	itemsToRemove: string[]
): string[] => {
	return existingItems.filter((item) => !itemsToRemove.includes(item));
};

export const updateArrayItems = (
	existingItems: string[],
	input?: string[],
	removalInput?: string[]
): string[] => {
	let updatedArray = [...existingItems];
	if (input) {
		updatedArray = mergeLists(updatedArray, input);
	}
	if (removalInput) {
		updatedArray = removeItemsFromList(updatedArray, removalInput);
	}
	return updatedArray;
};
