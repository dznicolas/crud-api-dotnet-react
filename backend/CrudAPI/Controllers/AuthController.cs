using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CrudAPI.Models;
using CrudAPI.Services;

namespace CrudAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly PessoaContext _context;
    private readonly JwtService _jwtService;

    public AuthController(PessoaContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        if (string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
        {
            return BadRequest(new
            {
                sucesso = false,
                mensagem = "Nome de usuário e senha são obrigatórios"
            });
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginRequest.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash))
        {
            return Unauthorized(new
            {
                sucesso = false,
                mensagem = "Credenciais inválidas"
            });
        }

        var token = _jwtService.GenerateToken(user);

        return Ok(new
        {
            sucesso = true,
            mensagem = "Login realizado com sucesso",
            token,
            usuario = new
            {
                id = user.Id,
                username = user.Username
            }
        });
    }
}
