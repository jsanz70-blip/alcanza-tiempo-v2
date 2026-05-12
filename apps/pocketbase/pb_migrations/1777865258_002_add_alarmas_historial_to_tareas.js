/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tareas");

  const existing = collection.fields.getByName("alarmas_historial");
  if (existing) {
    if (existing.type === "json") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("alarmas_historial"); // exists with wrong type, remove first
  }

  collection.fields.add(new JSONField({
    name: "alarmas_historial",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("tareas");
    collection.fields.removeByName("alarmas_historial");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})