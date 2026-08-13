export async function onRequest(context) {

  return Response.json({
    tourStartDate: context.env.TOUR_START_DATE || "",
    showDates: context.env.SHOW_DATES || "false",
    showCompletedDays: context.env.SHOW_COMPLETED_DAYS || "false",
    initialLanguage: context.env.INITIAL_LANGUAGE || "es",
    version: context.env.VERSION || "1.0.0",
  });

}