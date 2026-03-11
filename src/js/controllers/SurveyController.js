import * as model from "../model";
import * as helper from "../utilities/helpers";
import * as config from "../utilities/config";
import * as router from "../router";
import SurveyView from "../views/SurveyView";
import StepsView from "../views/StepsView";

export const controllSurvey = async () => {
	try {
		// Render shell
		SurveyView.render();
		// Attach handlers
		SurveyView.addHandlerSurveyNav(handleSurveyNav);
		SurveyView.addHandlerNavigateBack(handleNavigateBack);
		SurveyView.addHandlerHandleMultipliers(handleMultipliers);
		SurveyView.addHandlerHandleUnitToggle(handleUnitToggle);
	} catch (error) {
		console.error(error);
	}
};

const renderStepUI = () => {
	const { currentStep, maxSteps } = model.state.survey;
	// Prepare data
	const StepData = {
		...config.SURVEY_SCHEMA[currentStep - 1],
		isLastStep: currentStep === maxSteps,
	};

	// Render NEXT markup based on given step
	StepsView.render(StepData);
};

const handleSurveyNav = async (inputValue) => {
	// Get the current step from state
	const { maxSteps } = model.state.survey;
	// console.log("Current step: ", currentStep);

	if (inputValue?.type) {
		try {
			const { type, value } = inputValue;
			// Validate user input
			await helper.validateSurvey(inputValue);

			console.log("Validated!");

			model.state.user[type] = value;
		} catch (error) {
			// Render UI
			renderStepUI();
			// Render error
			StepsView.renderError(error);
			return;
		}
	}

	// Check for last step
	if (model.state.survey.currentStep === maxSteps) {
		await model.calcMaxCaffeine();
		await model.calcHalfLife();
		router.navigateTo("/");
		return;
	}

	// Update state +1
	model.nextStep();

	// Render UI
	renderStepUI();
};

const handleNavigateBack = () => {
	// Update state -1
	model.prevStep();

	if (model.state.survey.currentStep === 0) {
		router.navigateTo("/welcome");
		return;
	}
	// Render UI
	renderStepUI();
};

const handleMultipliers = async (values) => {
	if (!values) return;

	model.state.user.isPregnant = values.some(
		(value) => value.name === "Pregnancy",
	);

	const halfLifeMultipliers = values;
	model.state.user.halfLifeMultipliers = halfLifeMultipliers;
};

const handleUnitToggle = (value) => {
	if (!value) return;
	console.log(value);
	model.state.user.weightUnit = value;
};
