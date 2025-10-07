using System.ComponentModel.DataAnnotations;

namespace CrudAPI.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "Nome de usuário é obrigatório")]
    [MaxLength(50)]
    public string Username { get; set; }

    [Required(ErrorMessage = "Senha é obrigatória")]
    public string PasswordHash { get; set; }

    public DateTime DataCriacao { get; set; } = DateTime.Now;
}
