using DefikarteBackend.Model;
using FluentValidation;

namespace DefikarteBackend.Validation
{
    public class DefibrillatorRequestValidator : AbstractValidator<DefibrillatorRequest>
    {
        private readonly string phoneNumberPattern = @"^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$";

        public DefibrillatorRequestValidator()
        {
            RuleFor(x => x.Latitude).NotEmpty();
            RuleFor(x => x.Longitude).NotEmpty();
            RuleFor(x => x.Reporter).NotEmpty();
            RuleFor(x => x.Location).NotEmpty().MaximumLength(200);
            RuleFor(x => x.Description).MaximumLength(200);
            RuleFor(x => x.OperatorPhone).Matches(phoneNumberPattern).When(x => !string.IsNullOrEmpty(x.OperatorPhone));
            RuleFor(x => x.Access).NotNull();
            RuleFor(x => x.Indoor).NotNull();
            RuleFor(x => x.EmergencyPhone).NotEmpty().Matches($"({phoneNumberPattern})|112|144|117|118|1414");
            // opening hours validation is missing
        }
    }
}
