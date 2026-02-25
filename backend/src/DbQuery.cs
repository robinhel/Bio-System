namespace WebApp;

public static class DbQuery
{
    // Setup the database connection from config
    private static string connectionString;

    // JSON columns for _CONTAINS_ validation
    public static Arr JsonColumns = Arr(new[] { "categories" });

    public static bool IsJsonColumn(string column) => JsonColumns.Includes(column);

    static DbQuery()
    {
        var configPath = Path.Combine(
            AppContext.BaseDirectory, "..", "..", "..", "db-config.json"
        );
        var configJson = File.ReadAllText(configPath);
        var config = JSON.Parse(configJson);

        connectionString =
            $"Server={config.host};Port={config.port};Database={config.database};" +
            $"User={config.username};Password={config.password};";

        var db = new MySqlConnection(connectionString);
        db.Open();

        // Create tables if they don't exist
        if (config.createTablesIfNotExist == true)
        {
            CreateTablesIfNotExist(db);
        }

        // Seed data if tables are empty
        if (config.seedDataIfEmpty == true)
        {
            SeedDataIfEmpty(db);
        }

        db.Close();
    }

    private static void CreateTablesIfNotExist(MySqlConnection db)
    {
        var createTablesSql = @"
        CREATE TABLE IF NOT EXISTS sessions (
            id VARCHAR(255) PRIMARY KEY NOT NULL,
            created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            modified DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            data JSON
        );

        CREATE TABLE IF NOT EXISTS acl (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            userRoles VARCHAR(255) NOT NULL,
            method VARCHAR(50) NOT NULL DEFAULT 'GET',
            allow ENUM('allow', 'disallow') NOT NULL DEFAULT 'allow',
            route VARCHAR(255) NOT NULL,
            `match` ENUM('true', 'false') NOT NULL DEFAULT 'true',
            comment VARCHAR(500) NOT NULL DEFAULT '',
            UNIQUE KEY unique_acl (userRoles, method, route)
        );

        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            created DATE DEFAULT (CURDATE()) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            firstName VARCHAR(100) NOT NULL,
            lastName VARCHAR(100) NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'user'
        );

        CREATE TABLE IF NOT EXISTS theaters (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            name VARCHAR(100) NOT NULL,
            totalSeats INT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS movies (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            Title VARCHAR(255) NOT NULL,
            Description TEXT NOT NULL,
            Genre VARCHAR(100) NOT NULL,
            AgeRating INT NOT NULL,
            Cover VARCHAR(500) NOT NULL DEFAULT '',
            trailer VARCHAR(100) NOT NULL DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS screenings (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            movieId INT NOT NULL,
            theaterId INT NOT NULL,
            startTime DATETIME NOT NULL,
            endTime DATETIME NOT NULL,
            KEY movieId (movieId),
            KEY theaterId (theaterId),
            CONSTRAINT screenings_ibfk_1 FOREIGN KEY (movieId) REFERENCES movies(id),
            CONSTRAINT screenings_ibfk_2 FOREIGN KEY (theaterId) REFERENCES theaters(id)
        );

        CREATE TABLE IF NOT EXISTS seats (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            theaterId INT NOT NULL,
            rowNumber INT NOT NULL,
            seatNumber INT NOT NULL,
            KEY theaterId (theaterId),
            CONSTRAINT seats_ibfk_1 FOREIGN KEY (theaterId) REFERENCES theaters(id),
            UNIQUE KEY unique_seat (theaterId, rowNumber, seatNumber)
        );

        CREATE TABLE IF NOT EXISTS bookings (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            userId INT NOT NULL,
            screeningId INT NOT NULL,
            bookingNumber VARCHAR(20) NOT NULL,
            totalPrice DECIMAL(10,2) NOT NULL,
            UNIQUE KEY bookingNumber (bookingNumber),
            KEY userId (userId),
            KEY screeningId (screeningId),
            CONSTRAINT bookings_ibfk_1 FOREIGN KEY (userId) REFERENCES users(id),
            CONSTRAINT bookings_ibfk_2 FOREIGN KEY (screeningId) REFERENCES screenings(id)
        );

        CREATE TABLE IF NOT EXISTS bookingSeats (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            bookingId INT NOT NULL,
            seatId INT NOT NULL,
            ticketType ENUM('adult', 'child', 'senior') NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            KEY bookingId (bookingId),
            KEY seatId (seatId),
            CONSTRAINT bookingSeats_ibfk_1 FOREIGN KEY (bookingId) REFERENCES bookings(id),
            CONSTRAINT bookingSeats_ibfk_2 FOREIGN KEY (seatId) REFERENCES seats(id),
            UNIQUE KEY unique_booking_seat (bookingId, seatId)
        );
        ";

        // Execute each statement separately
        foreach (var sql in createTablesSql.Split(';'))
        {
            var trimmed = sql.Trim();
            if (!string.IsNullOrEmpty(trimmed))
            {
                var command = db.CreateCommand();
                command.CommandText = trimmed;
                command.ExecuteNonQuery();
            }
        }
    }

    private static void SeedDataIfEmpty(MySqlConnection db)
    {
        // Check if tables are empty and seed if needed
        var command = db.CreateCommand();

        // Seed ACL rules
        command.CommandText = "SELECT COUNT(*) FROM acl";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var aclData = @"
                INSERT INTO acl (userRoles, method, allow, route, `match`, comment) VALUES
                ('visitor', 'POST', 'allow', '/api/auth/register', 'true', 'Registrering öppen för alla'),
                ('visitor', 'POST', 'allow', '/api/auth/login', 'true', 'Login öppen för alla'),
                ('visitor', 'GET', 'allow', '/api/movies', 'true', 'Visa filmer för alla'),
                ('visitor', 'GET', 'allow', '/api/screenings', 'true', 'Visa visningar för alla'),
                ('user, admin', 'GET', 'allow', '/api/bookings', 'true', 'Användare kan se bokningar'),
                ('user, admin', 'POST', 'allow', '/api/bookings', 'true', 'Användare kan boka'),
                ('admin', '*', 'allow', '/api', 'true', 'Admin får göra allt i API')
            ";
            command.CommandText = aclData;
            command.ExecuteNonQuery();
        }

        // Seed Users
        command.CommandText = "SELECT COUNT(*) FROM users";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var usersData = @"
                INSERT INTO users (email, password, firstName, lastName, role) VALUES
                ('admin@bio.se', '$13$Cq/ULrmQ8SluiSw4vFAGKe6Xd25G2yw6t0LYww4mnuRxSl0sE70J6', 'Anna', 'Andersson', 'admin'),
                ('user@bio.se', '$13$Cq/ULrmQ8SluiSw4vFAGKe6Xd25G2yw6t0LYww4mnuRxSl0sE70J6', 'Bengt', 'Bengtsson', 'user'),
                ('kalle@mail.se', '$13$Cq/ULrmQ8SluiSw4vFAGKe6Xd25G2yw6t0LYww4mnuRxSl0sE70J6', 'Kalle', 'Karlsson', 'user'),
                ('lisa@mail.se', '$13$Cq/ULrmQ8SluiSw4vFAGKe6Xd25G2yw6t0LYww4mnuRxSl0sE70J6', 'Lisa', 'Larsson', 'user')
            ";
            command.CommandText = usersData;
            command.ExecuteNonQuery();
        }

        // Seed Theaters
        command.CommandText = "SELECT COUNT(*) FROM theaters";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var theatersData = @"
                INSERT INTO theaters (name, totalSeats) VALUES
                ('Stora Salongen', 81),
                ('Lilla Salongen', 55)
            ";
            command.CommandText = theatersData;
            command.ExecuteNonQuery();
        }

        // Seed Movies
        command.CommandText = "SELECT COUNT(*) FROM movies";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var moviesData = @"
                INSERT INTO movies (Title, Description, Genre, AgeRating, Cover, trailer) VALUES
                ('Avatar: Fire and Ash', 'Resan fortsätter på Pandora där Jake Sully och Neytiri ställs inför ett nytt hot från Asfolket, en aggressiv Na-vi-stam som lever i vulkaniska miljöer.', 'Sci-Fi/Action', 11, 'https://upload.wikimedia.org/wikipedia/en/9/95/Avatar_Fire_and_Ash_poster.jpeg', 'nb_fFj_0rq8'),
                ('Superman', 'Stålmannen försöker förena sitt utomjordiska arv med sin mänskliga uppväxt som Clark Kent. En nystart för DC:s filmuniversum regisserad av James Gunn.', 'Action/Sci-Fi', 11, 'https://m.media-amazon.com/images/M/MV5BOGMwZGJiM2EtMzEwZC00YTYzLWIxNzYtMmJmZWNlZjgxZTMwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 'Ox8ZLF6cGM0'),
                ('Zootopia 2', 'Judy Hopps och Nick Wilde är tillbaka för att lösa ett nytt mysterium i den myllrande djurmetropolen Zootopia.', 'Animerat/Familj', 7, 'https://m.media-amazon.com/images/M/MV5BYjg1Mjc3MjQtMTZjNy00YWVlLWFhMWEtMWI3ZTgxYjJmNmRlXkEyXkFqcGc@._V1_.jpg', 'BjkIOU5PhyQ'),
                ('A Minecraft Movie', 'En udda grupp äventyrare dras in i den blockiga världen Overworld och måste lära sig att tämja naturen för att rädda den från onda krafter.', 'Äventyr/Familj', 7, 'https://upload.wikimedia.org/wikipedia/en/thumb/6/66/A_Minecraft_Movie_poster.jpg/250px-A_Minecraft_Movie_poster.jpg', '8B1EtVPBSMw'),
                ('Jurassic World Rebirth', 'En ny era av dinosaurier börjar när mänskligheten kämpar för att samexistera med förhistoriska varelser på en global skala.', 'Action/Thriller', 11, 'https://m.media-amazon.com/images/M/MV5BNjg2NTcwYWQtYzk4NS00MTJhLWEzZjItMzIxNjk3YzlkYzU0XkEyXkFqcGc@._V1_.jpg', '6m1eOoUoVao'),
                ('Avengers: Doomsday', 'Hjältarna i Marvel-universumet ställs inför sin hittills största utmaning när den mystiske och mäktige Doctor Doom dyker upp.', 'Action/Sci-Fi', 11, 'https://upload.wikimedia.org/wikipedia/en/e/ee/Avengers_Doomsday_poster.jpg', 'zit4DTsP9Mw'),
                ('The Mandalorian & Grogu', 'Prisjägaren Din Djarin och hans följeslagare Grogu ger sig ut på ett nytt storslaget äventyr i Star Wars-galaxen.', 'Sci-Fi/Äventyr', 11, 'https://image.tmdb.org/t/p/original/qSWiY6KAvkapXJWeyNrmDGYWQwr.jpg', '_pa1KLXuW0Y'),
                ('Tron: Ares', 'Ett sofistikerat datorprogram vid namn Ares skickas från den digitala världen in i den verkliga världen på ett farligt uppdrag.', 'Sci-Fi/Action', 11, 'https://lumiere-a.akamaihd.net/v1/images/image_255af947.jpeg?region=0,0,540,810', 'YShVEXb7-ic'),
                ('Mortal Kombat II', 'Turneringen fortsätter när nya kämpar från Outworld och Earthrealm möts i en blodig kamp om universums framtid.', 'Action/Fantasy', 15, 'https://m.media-amazon.com/images/M/MV5BNGZjZGUxYjMtNDBmYi00N2JmLTk5OTEtNDQzNDliMWMzZWUyXkEyXkFqcGc@._V1_.jpg', 'ZdC5mFHPldg'),
                ('Frankenstein', 'En modern tolkning av Mary Shelleys klassiska berättelse där den briljante men besatte vetenskapsmannen Victor Frankenstein väcker liv i en varelse skapad av död materia, med förödande konsekvenser.', 'Horror/Sci-Fi/Drama', 15, 'https://lancerfeed.press/wp-content/uploads/2025/11/img_5991_8.webp', '8aulMPhE12g')
                ";
            command.CommandText = moviesData;
            command.ExecuteNonQuery();
        }

        // Seed Screenings
        command.CommandText = "SELECT COUNT(*) FROM screenings";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var screeningsData = @"
                INSERT INTO screenings (movieId, theaterId, startTime, endTime) VALUES
                (1, 1, '2026-03-01 19:00:00', '2026-03-01 21:30:00'),
                (1, 2, '2026-03-01 21:00:00', '2026-03-01 23:30:00'),
                (2, 1, '2026-03-02 18:00:00', '2026-03-02 20:30:00'),
                (3, 2, '2026-03-02 19:30:00', '2026-03-02 22:00:00'),
                (4, 1, '2026-03-03 20:00:00', '2026-03-03 22:30:00'),
                (5, 2, '2026-03-03 15:00:00', '2026-03-03 17:00:00'),
                (6, 1, '2026-03-04 18:30:00', '2026-03-04 21:00:00'),
                (7, 2, '2026-03-05 19:00:00', '2026-03-05 21:30:00'),
                (8, 1, '2026-03-06 20:00:00', '2026-03-06 22:15:00'),
                (9, 2, '2026-03-07 19:30:00', '2026-03-07 21:45:00'),
                (10, 1, '2026-03-08 21:00:00', '2026-03-08 23:15:00')
            ";
            command.CommandText = screeningsData;
            command.ExecuteNonQuery();
        }

        // Seed Seats
        command.CommandText = "SELECT COUNT(*) FROM seats";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            // Stora Salongen: olika antal säten per rad (totalt 81)
            int[] storaSalongenSeats = { 8, 9, 10, 10, 10, 10, 12, 12 };
            for (int row = 0; row < storaSalongenSeats.Length; row++)
            {
                for (int seat = 1; seat <= storaSalongenSeats[row]; seat++)
                {
                    command.CommandText = $"INSERT INTO seats (theaterId, rowNumber, seatNumber) VALUES (1, {row + 1}, {seat})";
                    command.ExecuteNonQuery();
                }
            }

            // Lilla Salongen: olika antal säten per rad (totalt 55)
            int[] lillaSalongenSeats = { 6, 8, 9, 10, 10, 12 };
            for (int row = 0; row < lillaSalongenSeats.Length; row++)
            {
                for (int seat = 1; seat <= lillaSalongenSeats[row]; seat++)
                {
                    command.CommandText = $"INSERT INTO seats (theaterId, rowNumber, seatNumber) VALUES (2, {row + 1}, {seat})";
                    command.ExecuteNonQuery();
                }
            }
        }

        // Seed Bookings
        command.CommandText = "SELECT COUNT(*) FROM bookings";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var bookingsData = @"
                INSERT INTO bookings (userId, screeningId, bookingNumber, totalPrice) VALUES
                (2, 1, 'BOOK-001', 280.00),
                (3, 2, 'BOOK-002', 220.00),
                (4, 3, 'BOOK-003', 280.00),
                (2, 5, 'BOOK-004', 200.00)
            ";
            command.CommandText = bookingsData;
            command.ExecuteNonQuery();
        }

        // Seed BookingSeats
        command.CommandText = "SELECT COUNT(*) FROM bookingSeats";
        if (Convert.ToInt32(command.ExecuteScalar()) == 0)
        {
            var bookingSeatsData = @"
                INSERT INTO bookingSeats (bookingId, seatId, ticketType, price) VALUES
                (1, 10, 'adult', 140.00),
                (1, 11, 'adult', 140.00),
                (2, 85, 'adult', 140.00),
                (2, 86, 'child', 80.00),
                (3, 20, 'adult', 140.00),
                (3, 21, 'adult', 140.00),
                (4, 30, 'senior', 120.00),
                (4, 31, 'child', 80.00)
            ";
            command.CommandText = bookingSeatsData;
            command.ExecuteNonQuery();
        }
    }

    // Helper to create an object from the DataReader
    private static dynamic ObjFromReader(MySqlDataReader reader)
    {
        var obj = Obj();
        for (var i = 0; i < reader.FieldCount; i++)
        {
            var key = reader.GetName(i);
            var value = reader.GetValue(i);

            // Handle NULL values
            if (value == DBNull.Value)
            {
                obj[key] = null;
            }
            // Handle DateTime - convert to ISO string
            else if (value is DateTime dt)
            {
                obj[key] = dt.ToString("yyyy-MM-ddTHH:mm:ss");
            }
            // Handle boolean (MySQL returns sbyte for TINYINT(1))
            else if (value is sbyte sb)
            {
                obj[key] = sb != 0;
            }
            else if (value is bool b)
            {
                obj[key] = b;
            }
            // Handle JSON columns (MySQL returns JSON as string starting with [ or {)
            else if (value is string strValue && (strValue.StartsWith("[") || strValue.StartsWith("{")))
            {
                try
                {
                    obj[key] = JSON.Parse(strValue);
                }
                catch
                {
                    // If parsing fails, keep the original value and try to convert to number
                    obj[key] = strValue.TryToNum();
                }
            }
            else
            {
                // Normal handling - convert to string and try to parse as number
                obj[key] = value.ToString().TryToNum();
            }
        }
        return obj;
    }

    // Run a query - rows are returned as an array of objects
    public static Arr SQLQuery(
        string sql, object parameters = null, HttpContext context = null
    )
    {
        var paras = parameters == null ? Obj() : Obj(parameters);
        using var db = new MySqlConnection(connectionString);
        db.Open();
        var command = db.CreateCommand();
        command.CommandText = @sql;
        var entries = (Arr)paras.GetEntries();
        entries.ForEach(x => command.Parameters.AddWithValue("@" + x[0], x[1]));
        if (context != null)
        {
            DebugLog.Add(context, new
            {
                sqlQuery = sql.Regplace(@"\s+", " "),
                sqlParams = paras
            });
        }
        var rows = Arr();
        try
        {
            if (sql.StartsWith("SELECT ", true, null))
            {
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    rows.Push(ObjFromReader(reader));
                }
                reader.Close();
            }
            else
            {
                rows.Push(new
                {
                    command = sql.Split(" ")[0].ToUpper(),
                    rowsAffected = command.ExecuteNonQuery()
                });
            }
        }
        catch (Exception err)
        {
            rows.Push(new { error = err.Message });
        }
        return rows;
    }

    // Run a query - only return the first row, as an object
    public static dynamic SQLQueryOne(
        string sql, object parameters = null, HttpContext context = null
    )
    {
        return SQLQuery(sql, parameters, context)[0];
    }
}

