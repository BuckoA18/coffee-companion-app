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

export const calcMaxCaffeine = (weight) => {
	const max = weight * 6 * 1;
	return max;
};

export const validateSurvey = async (data) => {
	try {
		console.log(data);
		const { type, value } = data;

		const rules = VALIDATION_RULES[type.toUpperCase()];
		const numericValue = Math.round(parseFloat(value));

		if (!rules) throw new Error(`Unknown validation type: ${type}`);

		if (isNaN(numericValue)) {
			throw {
				type: "VALIDATION_ERROR",
				message: `${type} Must be an number`,
			};
		}

		if (numericValue < rules.MIN) {
			throw {
				type: "VALIDATION_ERROR",
				message: `Your ${type} must be bigger then ${rules.MIN}`,
			};
		}

		if (numericValue > rules.MAX) {
			throw {
				type: "VALIDATION_ERROR",
				message: `Your ${type} must be smaller then ${rules.MAX}`,
			};
		}
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

export const getMultiplierValue = (values) => {
	// Get result by multiplying selected multipliers
	const basicValue = 1;
	if (values.length <= 0) return basicValue; // return basic value = 1 if no multipliers selected
	const multiplier = values.reduce(
		(accumulator, currentValue) => accumulator * currentValue,
	);

	return multiplier;
};
