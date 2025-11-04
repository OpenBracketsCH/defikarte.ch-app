using System.Text.RegularExpressions;

namespace DefikarteBackend.Helpers
{
    public static partial class StringHelper
    {
        public static string? RemoveDuplicatedWhitespace(string? input)
        {
            return input == null ? null : DuplicatedWhitespaceRegex().Replace(input.Trim(), " ");
        }

        [GeneratedRegex(@"\s+")]
        private static partial Regex DuplicatedWhitespaceRegex();
    }
}
