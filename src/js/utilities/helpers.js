import { VALIDATION_RULES } from "./config";
import * as model from "../model";
import * as config from "./config";
import { db } from "../db";

export const html = String.raw;

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

export const getMultiplierValue = (values) => {
	if (values.length <= 0) return config.METABOLIC_FACTORS.BASELINE_MULTIPLIER;
	const multiplier = values.reduce(
		(accumulator, currentValue) => accumulator * currentValue,
	);

	return multiplier;
};

export const convertToKilos = (weight, weightUnit) => {
	if (weightUnit === "kg") return weight;

	const kilos = Math.round(weight / 2.205);
	return kilos;
};

export const getElapsedHours = (currentTime, drinkTime) => {
	const elapsedMs = currentTime.getTime() - drinkTime.getTime();
	return Math.max(0, elapsedMs / (1000 * 60 * 60));
};

export const calcRemainingCaffeine = (
	initialCaffeine,
	elapsedHours,
	halfLife,
) => {
	return initialCaffeine * Math.pow(0.5, elapsedHours / halfLife);
};

export const calcHoursUntilThreshold = (
	currentCaffeine,
	threshold,
	halfLife,
) => {
	if (currentCaffeine <= threshold) return 0;
	return halfLife * (Math.log(threshold / currentCaffeine) / Math.log(0.5));
};

export const getCaffeine = (drinksArray) => {
	return drinksArray.reduce(
		(accumulator, currentValue) => accumulator + currentValue.caffeine_mg,
		0,
	);
};
