using FluentValidation.Results;

namespace DefikarteBackend.Validation
{
    public class ValidatedRequest<T>
    {
        /// <summary>
        /// The deserialized value of the request.
        /// </summary>
        public required T Value { get; set; }

        /// <summary>
        /// Whether or not the deserialized value was found to be valid.
        /// </summary>
        public bool IsValid { get; set; }

        /// <summary>
        /// The collection of validation errors.
        /// </summary>
        public IList<ValidationFailure> Errors { get; set; } = [];
    }
}