using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace CrudAPI.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
public class CpfAttribute : ValidationAttribute
{
    public override bool IsValid(object? value)
    {
        if (value is null) return false;
        var input = value.ToString()!.Trim();
        if (input.Length == 0) return false;

        var digits = Regex.Replace(input, "[^0-9]", "");
        if (digits.Length != 11) return false;
        if (digits.Distinct().Count() == 1) return false;

        return ValidateCheckDigits(digits);
    }

    private static bool ValidateCheckDigits(string digits)
    {
        int sum = 0;
        for (int i = 0, weight = 10; i < 9; i++, weight--)
            sum += (digits[i] - '0') * weight;

        int firstDV = (sum * 10) % 11;
        if (firstDV == 10) firstDV = 0;
        if (firstDV != (digits[9] - '0')) return false;

        sum = 0;
        for (int i = 0, weight = 11; i < 10; i++, weight--)
            sum += (digits[i] - '0') * weight;

        int secondDV = (sum * 10) % 11;
        if (secondDV == 10) secondDV = 0;
        if (secondDV != (digits[10] - '0')) return false;

        return true;
    }
}