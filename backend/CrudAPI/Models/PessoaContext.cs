using Microsoft.EntityFrameworkCore;

namespace CrudAPI.Models;

public class PessoaContext(DbContextOptions<PessoaContext> options) : DbContext(options)
{
    public DbSet<Pessoa> Pessoas { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
}
