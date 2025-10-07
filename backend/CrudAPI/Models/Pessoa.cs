using CrudAPI.Validation;
using System.ComponentModel.DataAnnotations;

namespace CrudAPI.Models;

public class Pessoa
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "Nome é obrigatório")]
    [MaxLength(150)]
    public string Nome { get; set; }

    public string? Sexo { get; set; }

    [EmailAddress(ErrorMessage = "Email inválido")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Data de nascimento é obrigatória")]
    public DateTime DataNascimento { get; set; }

    public string? Naturalidade { get; set; }

    public string? Nacionalidade { get; set; }

    [Required(ErrorMessage = "CPF é obrigatório")]
    [StringLength(11, MinimumLength = 11, ErrorMessage = "CPF deve ter 11 dígitos")]
    [Cpf(ErrorMessage = "CPF inválido")]
    public string Cpf { get; set; }

    public DateTime DataCadastro { get; set; } = DateTime.Now;
    public DateTime? DataAtualizacao { get; set; }

}
