import Dexie from "dexie";

export const db = new Dexie("CaffeineTrackerDB");

db.version(1).stores({
	drinks: "id, name, category",
	consumption: "++id, drinkId, timestamp",
	settings: "key",
});

export const seedDatabase = async (initialDrinks) => {
	const count = await db.drinks.count();
	if (count === 0) {
		console.log("Seeding initial drinks...");
		await db.drinks.bulkAdd(initialDrinks);
	}
	console.log("DB already seeded...");
};

export const clearTable = (tableName) => {
	tableName.clear();
	console.log("Table deleted: ", tableName.toArray());
};
clearTable(db.consumption);
