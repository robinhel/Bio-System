namespace WebApp;

public static class LoginRoutes
{
    private static Obj GetUser(HttpContext context)
    {
        return Session.Get(context, "user");
    }

    public static void Start()
    {
        App.MapPost("/api/login", (HttpContext context, JsonElement bodyJson) =>
        {
            var user = GetUser(context);
            var body = JSON.Parse(bodyJson.ToString());

            // If there is a user logged in already
            if (user != null)
            {
                var already = new { error = "A user is already logged in." };
                return RestResult.Parse(context, already);
            }

            // Find the user in the DB
            var dbUser = SQLQueryOne(
                "SELECT * FROM users WHERE email = @email",
                new { body.email }
            );
            if (dbUser == null)
            {
                return RestResult.Parse(context, new { error = "No such user." });
            }

            // If the password doesn't match
            if (!Password.Verify(
                (string)body.password,
                (string)dbUser.password
            ))
            {
                return RestResult.Parse(context,
                    new { error = "Password mismatch." });
            }

            // Add the user to the session, without password
            dbUser.Delete("password");
            Session.Set(context, "user", new
            {
                id = dbUser.id,
                email = dbUser.email,
                firstName = dbUser.firstName,
                lastName = dbUser.lastName,
                role = dbUser.role
            });

            // Return the user
            return RestResult.Parse(context, dbUser!);
        });

        App.MapGet("/api/login", (HttpContext context) =>
        {
            var user = GetUser(context);
            return RestResult.Parse(context, user != null ?
                user : new { error = "No user is logged in." });
        });

        App.MapDelete("/api/login", (HttpContext context) =>
        {
            var user = GetUser(context);

            // Delete the user from the session
            Session.Set(context, "user", null);

            return RestResult.Parse(context, user == null ?
                new { error = "No user is logged in." } :
                new { status = "Successful logout." }
            );
        });

        App.MapGet("/api/generate-hash", () =>
        {
            return Password.Encrypt("123");
        });

        App.MapPost("/api/register", (HttpContext context, JsonElement bodyJson) =>
        {
            var body = JSON.Parse(bodyJson.ToString());

            // Check if email is already taken
            var existing = SQLQueryOne(
                "SELECT id FROM users WHERE email = @email",
                new { body.email }
            );
            if (existing != null)
            {
                return RestResult.Parse(context, new { error = "Email already in use." });
            }

            // Hash the password before storing
            var hashed = Password.Encrypt((string)body.password);

            var result = SQLQueryOne(
                "INSERT INTO users (email, password, firstName, lastName) VALUES (@email, @password, @firstName, @lastName)",
                new { body.email, password = hashed, body.firstName, body.lastName }
            );

            return RestResult.Parse(context, result);
        });
    }
}