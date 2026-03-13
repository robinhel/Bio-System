namespace WebApp;

public static class getScreeningDates
{

    public static void Start()
    {
        App.MapGet("/api/screenings/movie/{movieId}", (HttpContext context, string movieId) =>
        {
            var sql = $"SELECT * FROM screenings WHERE movieId = {movieId} ";
            return RestResult.Parse(context, SQLQuery(sql, null, context));
        });
    }
}