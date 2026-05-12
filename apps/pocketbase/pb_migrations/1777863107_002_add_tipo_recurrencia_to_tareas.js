/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tareas");

  const existing = collection.fields.getByName("tipo_recurrencia");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("tipo_recurrencia"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "tipo_recurrencia",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("tareas");
    collection.fields.removeByName("tipo_recurrencia");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})