/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const projectsCollection = app.findCollectionByNameOrId("projects");
  const collection = app.findCollectionByNameOrId("tareas");

  const existing = collection.fields.getByName("proyecto_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("proyecto_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "proyecto_id",
    required: false,
    collectionId: projectsCollection.id,
    maxSelect: 1
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("tareas");
    collection.fields.removeByName("proyecto_id");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})