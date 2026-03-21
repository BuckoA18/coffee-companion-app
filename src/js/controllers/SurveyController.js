import * as model from "../model";
import * as helper from "../utilities/helpers";
import { SURVEY_SCHEMA, EVENTS } from "../utilities/config";
import * as router from "../router";
import SurveyView from "../views/SurveyView";
import StepsView from "../views/StepsView";

const renderStepUI = () => {
	const { currentStep, maxSteps } = model.state.survey;
	// Prepare data
	const StepData = {
		...SURVEY_SCHEMA[currentStep - 1],
		isLastStep: currentStep === maxSteps,
	};

	// Render NEXT markup based on given step
	StepsView.render(StepData);
};

export const controllSurvey = async () => {
	try {
		// Render shell
		SurveyView.render();

		// Attach handlers
		SurveyView.addHandlerSurveyNav(handleSurveyNav);
		SurveyView.addHandlerNavigateBack(handleNavigateBack);
		SurveyView.addHandlerHandleMultipliers(handleMultipliers);
		SurveyView.addHandlerHandleUnitToggle(handleUnitToggle);

		model.subscribe(EVENTS.STEPS_UPDATED, renderStepUI);

		renderStepUI();
	} catch (error) {
		console.error(error);
	}
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
		await model.saveUserProfile();

		router.navigateTo("/");
		return;
	}

	// Update and render
	model.nextStep();
};

const handleNavigateBack = () => {
	// Update and render
	model.prevStep();

	if (model.state.survey.currentStep === 0) {
		router.navigateTo("/welcome");
		return;
	}
};

const handleMultipliers = async (values) => {
	if (!values) return;
};

const handleUnitToggle = (value) => {
	if (!value) return;
	model.state.user.weightUnit = value;
};
