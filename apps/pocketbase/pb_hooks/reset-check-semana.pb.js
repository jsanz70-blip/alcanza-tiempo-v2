// Reset check_semana to false every Monday at 00:00 UTC
cronAdd("reset_check_semana", "0 0 * * 1", () => {
  const records = $app.findRecordsByFilter(
    "users", // Replace with your actual collection name
    "check_semana = true"
  );

  records.forEach((record) => {
    record.set("check_semana", false);
    $app.save(record);
  });

  console.log(`Reset check_semana for ${records.length} records`);
});