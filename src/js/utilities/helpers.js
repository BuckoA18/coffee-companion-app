import { VALIDATION_RULES } from "./config";
import { setProfile } from "../model";
import * as model from "../model";

export const html = String.raw;

export const getCurrentTime = () => {
	const date = new Date();
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${hours}:${minutes}`;
};

export const calcMaxCaffeine = (weight, metabolism) => {
	const max = weight * metabolism;
	return max;
};

export const validate = async (data) => {
	try {
		const firstName = data.firstName?.trim() || "";
		const weight = Math.round(parseFloat(data.weight));

		// Name checks
		if (firstName.length === 0) throw new Error("Name can`t be empty");
		if (firstName.length > VALIDATION_RULES.NAME_CHAR_CAP)
			throw new Error(
				`Name is too long, maximum is: ${VALIDATION_RULES.NAME_CHAR_CAP}`,
			);

		// Weight checks
		if (data.weight < VALIDATION_RULES.WEIGHT.MIN)
			throw new Error(
				`Weight is too low, minimum is: ${VALIDATION_RULES.WEIGHT.MIN}`,
			);
		if (data.weight > VALIDATION_RULES.WEIGHT.MAX)
			throw new Error(
				`Weight is too high, maximum is: ${VALIDATION_RULES.WEIGHT.MAX}`,
			);
		setProfile({ ...data, firstName, weight });
	} catch (error) {
		throw error;
	}
};

export const createShortcuts = () => {
	model.state.search.shortcuts = [
		"All",
		...new Set(
			model.state.drinks.map((drink) => {
				return drink.category;
			}),
		),
	];
};

export const calcCaffeine = () => {
	const caffeine = model.state.user.dailyDrinks.reduce(
		(accumulator, currentValue) => accumulator + currentValue.caffeine_mg,
		0,
	);
	model.state.user.caffeine = caffeine;
};
