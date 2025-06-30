using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace DefikarteBackend.Validation
{
    public static class HttpRequestExtensions
    {
        /// <summary>
        /// Returns the deserialized request body with validation information.
        /// </summary>
        /// <typeparam name="T">Type used for deserialization of the request body.</typeparam>
        /// <typeparam name="V">
        /// Validator used to validate the deserialized request body.
        /// </typeparam>
        /// <param name="request"></param>
        /// <returns></returns>
        public static async Task<ValidatedRequest<T>> GetValidatedRequestAsync<T, V>(this HttpRequest request)
            where V : AbstractValidator<T>, new()
        {
            T? requestObject;
            try
            {
                requestObject = await request.ReadFromJsonAsync<T>();
            }
            catch (Exception)
            {
                return new ValidatedRequest<T>
                {
                    Value = default,
                    IsValid = false,
                    Errors = [new("Body", "Request body is null or not a valid JSON")],
                };
            }

            if (requestObject == null)
            {
                return new ValidatedRequest<T>
                {
                    Value = default,
                    IsValid = false,
                    Errors = [new("Body", "Request body is null")],
                };
            }

            var validator = new V();
            var validationResult = validator.Validate(requestObject);

            if (!validationResult.IsValid)
            {
                return new ValidatedRequest<T>
                {
                    Value = requestObject,
                    IsValid = false,
                    Errors = validationResult.Errors
                };
            }

            return new ValidatedRequest<T>
            {
                Value = requestObject,
                IsValid = true
            };
        }
    }
}