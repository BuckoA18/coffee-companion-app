# Brew 
Personalized Caffeine Tracking
https://brewtest.netlify.app/

Brew is a real-time caffeine metabolism tracker designed to move beyond generic daily limits. Originally started as a deep-dive into Vanilla JS best practices, it evolved into a functional tool that models caffeine decay based on individual user data.

## Technologies

- **Vanilla JavaScript (ES6+)**
- **Vite**
- **SCSS**
- **Service Workers**
- **IndexedDB (Dexie)**

## Features
- **Instalable PWA:** Brew can work fully offline due to simple SW logic and caching
- **Pure Vanilla JS:** Built to demonstrate clean DOM manipulation, state management, separation of concerns and best practices using standard ES6+ features
- **Custom tracking:** Unlike static trackers, Brew adjusts your maximum daily intake based on age, weight, and metabolic profile
- **Real time tracking:** Real-time tracking of caffeine to help you understand exactly when the 4:00 PM espresso will actually leave your system


## Architecture  

### **MVC Architecture**
- **Model** : State management and business logic
- **Views** : Reausable components for rendering UI
- **Controllers** : Handle user interactions and coordinate between model and views

### **Custom Router**
 Client-side router for navigation without a framework:
- Manages different application states
- Handles route transitions and view updates

## Limitations and future improvements

- Daily caffeine intake and caffeine monitor BOTH resets at midnight
- To reset data you must clear browser CACHE
- No custom drinks
- No test implementation
- Simple error handling
- Could have widgets and notifications
- Could implement more features so the dashboard isnt as empty
- Could implement stats!
  














