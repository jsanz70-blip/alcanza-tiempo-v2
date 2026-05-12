/// <reference path="../pb_data/types.d.ts" />
// Reset check_hoy to false daily at 00:00 UTC
cronAdd("reset_check_hoy", "0 0 * * *", () => {
  const records = $app.findAllRecords("tareas");
  records.forEach((record) => {
    record.set("check_hoy", false);
    $app.save(record);
  });
  console.log("Reset check_hoy for all tareas records");
});