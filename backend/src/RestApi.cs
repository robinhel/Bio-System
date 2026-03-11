namespace WebApp;

public static class RestApi
{
    public static void Start()
    {

        //------------------------------------------------------------custom endpoints---------------------------------------------------------------

        App.MapGet("/api/bookings/{bookingNumber}", (
            HttpContext context, string bookingNumber
        ) =>
            RestResult.Parse(context, SQLQueryOne(
                $"SELECT * FROM bookings WHERE bookingNumber = @bookingNumber",
            new { bookingNumber },
                context
            ))
        );

        App.MapPut("/api/bookings/{bookingNumber}/cancel", (
            HttpContext context, string bookingNumber
        ) =>
        {
            SQLQueryOne(
        "UPDATE bookings SET isAvailable = 0 WHERE bookingNumber = @bookingNumber",
        new { bookingNumber },
        context
    );

            SQLQueryOne(
        @"DELETE FROM bookingSeats
          WHERE bookingId = (
              SELECT id FROM bookings
              WHERE bookingNumber = @bookingNumber
          )",
        new { bookingNumber },
        context);

            return RestResult.Parse(context, Obj(new { success = true }));
        });

        //----------------------------------------------------------Färdiga endpoints-----------------------------------------------------------------

        App.MapPost("/api/{table}", (
            HttpContext context, string table, JsonElement bodyJson
        ) =>
        {
            var body = JSON.Parse(bodyJson.ToString());
            body.Delete("id");
            var parsed = ReqBodyParse(table, body);
            var columns = parsed.insertColumns;
            var values = parsed.insertValues;
            var sql = $"INSERT INTO {table}({columns}) VALUES({values})";
            var result = SQLQueryOne(sql, parsed.body, context);
            if (!result.HasKey("error"))
            {
                // Get the insert id and add to our result
                result.id = SQLQueryOne( // changed from result.InsertID to result.id
                    @$"SELECT id AS __insertId 
                       FROM {table} ORDER BY id DESC LIMIT 1"
                ).__insertId;
            }
           
            return RestResult.Parse(context, result);
        });

        App.MapGet("/api/{table}", (
            HttpContext context, string table
        ) =>
        {
            var query = RestQuery.Parse(context.Request.Query);
            if (query.error != null)
            {
                return RestResult.Parse(context, Arr(Obj(new { error = query.error })));
            }
            var sql = $"SELECT * FROM {table}" + query.sql;
            return RestResult.Parse(context, SQLQuery(sql, query.parameters, context));
        });

        App.MapGet("/api/{table}/{id}", (
            HttpContext context, string table, string id
        ) =>
            RestResult.Parse(context, SQLQueryOne(
                $"SELECT * FROM {table} WHERE id = @id",
                ReqBodyParse(table, Obj(new { id })).body,
                context
            ))
        );

        App.MapPut("/api/{table}/{id}", (
            HttpContext context, string table, string id, JsonElement bodyJson
        ) =>
        {
            var body = JSON.Parse(bodyJson.ToString());
            body.id = id;
            var parsed = ReqBodyParse(table, body);
            var update = parsed.update;
            var sql = $"UPDATE {table} SET {update} WHERE id = @id";
            var result = SQLQueryOne(sql, parsed.body, context);
            return RestResult.Parse(context, result);
        });

        App.MapDelete("/api/{table}/{id}", (
             HttpContext context, string table, string id
        ) =>
            RestResult.Parse(context, SQLQueryOne(
                $"DELETE FROM {table} WHERE id = @id",
                ReqBodyParse(table, Obj(new { id })).body,
                context
            ))
        );



    }
}