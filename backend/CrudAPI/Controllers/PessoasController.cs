using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CrudAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace CrudAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class PessoasController : ControllerBase
    {
        private readonly PessoaContext _context;

        public PessoasController(PessoaContext context)
        {
            _context = context;
        }

        // GET: api/Pessoas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
        {
            var pessoas = await _context.Pessoas.ToListAsync();
            return Ok(new
            {
                sucesso = true,
                mensagem = "Lista de pessoas carregada com sucesso.",
                dados = pessoas
            });
        }

        // GET: api/Pessoas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Pessoa>> GetPessoa(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);

            if (pessoa == null)
                return NotFound(new { sucesso = false, mensagem = "Pessoa não encontrada." });

            return Ok(new
            {
                sucesso = true,
                mensagem = "Pessoa encontrada com sucesso.",
                dados = pessoa
            });
        }

        // PUT: api/Pessoas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPessoa(int id, Pessoa pessoa)
        {
            if (id != pessoa.Id)
                return BadRequest(new { sucesso = false, mensagem = "O ID informado é diferente do ID da pessoa." });

            if (!ModelState.IsValid)
                return BadRequest(new { sucesso = false, erros = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });

            var pessoaDb = await _context.Pessoas.FindAsync(id);
            if (pessoaDb == null)
                return NotFound(new { sucesso = false, mensagem = "Pessoa não encontrada para atualização." });

            bool cpfExiste = await _context.Pessoas.AnyAsync(p => p.Cpf == pessoa.Cpf && p.Id != id);
            if (cpfExiste)
                return Conflict(new { sucesso = false, mensagem = "Já existe uma pessoa cadastrada com este CPF." });

            if (pessoa.DataNascimento > DateTime.Today || pessoa.DataNascimento < DateTime.Today.AddYears(-120))
                return BadRequest(new { sucesso = false, mensagem = "Data de nascimento inválida." });

            try
            {
                AtualizarPessoa(pessoaDb, pessoa);
                await _context.SaveChangesAsync();

                return Ok(new { sucesso = true, mensagem = "Pessoa atualizada com sucesso.", dados = pessoaDb });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { sucesso = false, mensagem = "Erro ao atualizar pessoa.", erro = ex.Message });
            }
        }

        // POST: api/Pessoas
        [HttpPost]
        public async Task<ActionResult<Pessoa>> PostPessoa(Pessoa pessoa)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { sucesso = false, erros = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });

            bool cpfExiste = await _context.Pessoas.AnyAsync(p => p.Cpf == pessoa.Cpf);
            if (cpfExiste)
                return Conflict(new { sucesso = false, mensagem = "Já existe uma pessoa cadastrada com este CPF." });

            if (pessoa.DataNascimento > DateTime.Today || pessoa.DataNascimento < DateTime.Today.AddYears(-120))
                return BadRequest(new { sucesso = false, mensagem = "Data de nascimento inválida." });

            pessoa.DataCadastro = DateTime.Now;

            try
            {
                _context.Pessoas.Add(pessoa);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    sucesso = true,
                    mensagem = "Pessoa cadastrada com sucesso.",
                    dados = pessoa
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { sucesso = false, mensagem = "Erro ao cadastrar", erro = ex.Message });
            }
        }

        // DELETE: api/Pessoas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePessoa(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null)
                return NotFound(new { sucesso = false, mensagem = "Pessoa não encontrada para exclusão." });

            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();

            return Ok(new { sucesso = true, mensagem = "Pessoa removida com sucesso." });
        }

        private static void AtualizarPessoa(Pessoa pessoaDb, Pessoa pessoa)
        {
            pessoaDb.Nome = pessoa.Nome;
            pessoaDb.Sexo = pessoa.Sexo;
            pessoaDb.Email = pessoa.Email;
            pessoaDb.DataNascimento = pessoa.DataNascimento;
            pessoaDb.Naturalidade = pessoa.Naturalidade;
            pessoaDb.Nacionalidade = pessoa.Nacionalidade;
            pessoaDb.Cpf = pessoa.Cpf;
            pessoaDb.DataAtualizacao = DateTime.Now;
        }
    }
}
