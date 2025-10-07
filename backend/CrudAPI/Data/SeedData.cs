using CrudAPI.Models;

namespace CrudAPI.Data
{
    public static class SeedData
    {
        public static void Initialize(PessoaContext context)
        {
            if (context.Users.Any())
                return;

            var users = new List<User>
            {
                new() {
                    Username = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    DataCriacao = DateTime.Now
                }
            };

            context.Users.AddRange(users);
            context.SaveChanges();
        }
    }
}
