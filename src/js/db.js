import Dexie from "dexie";

export const db = new Dexie("CaffeineTrackerDB_v2");

db.version(4).stores({
	drinks: "id, name, category",
	consumption: "++id, drinkId, consumptionTime, [drinkId+consumptionTime]",
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
// clearTable(db.consumption);
// clearTable(db.settings);
