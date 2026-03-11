namespace WebApp;

public static class OccupiedSeats
{

    public static void Start()
    {
        App.MapGet("/api/occupiedSeats/{screeningId}", (HttpContext context, string screeningId) =>
        {
            var sql = $"SELECT * FROM occupiedSeats WHERE screeningId = {screeningId} ";
            return RestResult.Parse(context, SQLQuery(sql, null, context));
        });
    }
}