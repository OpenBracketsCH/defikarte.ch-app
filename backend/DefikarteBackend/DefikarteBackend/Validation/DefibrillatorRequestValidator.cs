using DefikarteBackend.Model;
using FluentValidation;

namespace DefikarteBackend.Validation
{
    public class DefibrillatorRequestValidator : AbstractValidator<DefibrillatorRequest>
    {
        private readonly string _phoneNumberPattern = @"^(\+41|0041|0)\s?(\d{2})\s?(\d{3})\s?(\d{2})\s?(\d{2})$";

        public DefibrillatorRequestValidator()
        {
            RuleFor(x => x.Latitude).NotEmpty();
            RuleFor(x => x.Longitude).NotEmpty();
            RuleFor(x => x.Reporter).NotEmpty();
            RuleFor(x => x.Location).NotEmpty().MaximumLength(200);
            RuleFor(x => x.Description).MaximumLength(200);
            RuleFor(x => x.OperatorPhone).Matches(_phoneNumberPattern).When(x => !string.IsNullOrEmpty(x.OperatorPhone));
            RuleFor(x => x.Access).NotNull();
            RuleFor(x => x.Indoor).NotNull();
            RuleFor(x => x.EmergencyPhone).NotEmpty().Matches($"({_phoneNumberPattern})|112|144|117|118|1414");
            // opening hours validation is missing
        }
    }
}