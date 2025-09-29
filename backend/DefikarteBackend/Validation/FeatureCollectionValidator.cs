using DefikarteBackend.Helpers;
using DefikarteBackend.Model;
using FluentValidation;
using System.Text.RegularExpressions;

namespace DefikarteBackend.Validation
{
    public partial class FeatureCollectionValidator : AbstractValidator<FeatureCollection>
    {
        public FeatureCollectionValidator()
        {
            RuleForEach(x => x.Features).SetValidator(new FeatureValidator());
            RuleFor(x => x.Features).Must(x => x.Count == 1).WithMessage("Only 1 Feature is allowed to create or update.");
            RuleFor(x => x.Type).Equal("FeatureCollection").WithMessage("Type must be 'FeatureCollection'");
        }

        public class FeatureValidator : AbstractValidator<Feature>
        {
            public FeatureValidator()
            {
                RuleFor(x => x.Type).Equal("Feature").WithMessage("Feature Type must be 'Feature'");
                RuleFor(x => x.Geometry).SetValidator(new GeometryValidator());
                RuleFor(x => GeoJsonConverter.Convert2AedPropertyData(x.Properties))
                                    .SetValidator(new AedPropertyDataValidator());
            }
        }

        public class GeometryValidator : AbstractValidator<PointGeometry>
        {
            public GeometryValidator()
            {
                RuleFor(x => x.Type).Equal("Point").WithMessage("Geometry Type must be 'Point'");
                RuleFor(x => x.Coordinates).NotNull().Must(x => x.Length == 2);
            }
        }

        public class AedPropertyDataValidator : AbstractValidator<AedPropertyData>
        {
            public AedPropertyDataValidator()
            {
                RuleFor(x => x.Reporter).NotEmpty();
                RuleFor(x => x.Location).NotEmpty().MaximumLength(200);
                RuleFor(x => x.Description).MaximumLength(200);
                RuleFor(x => x.OperatorPhone).Custom((value, context) => IsPhoneNumberValid(value, context)).When(x => !string.IsNullOrEmpty(x.OperatorPhone));
                RuleFor(x => x.Access).Custom((value, context) => IsAccessValid(value, context));
                RuleFor(x => x.Indoor).NotEmpty().Custom((value, context) => IsIndoorValid(value, context));
                RuleFor(x => x.Level).Custom((value, context) => IsNumber(value, context));
            }
        }

        private static void IsPhoneNumberValid(string? phoneNumberRaw, ValidationContext<AedPropertyData> context)
        {
            if (string.IsNullOrEmpty(phoneNumberRaw))
            {
                return;
            }

            var result = Regex.Match(phoneNumberRaw, "112|144|117|118|1414");
            if (result.Success)
            {
                return;
            }

            var phoneNumberUtil = PhoneNumbers.PhoneNumberUtil.GetInstance();
            try
            {
                var value = phoneNumberUtil.Parse(phoneNumberRaw, "CH");
                var valid =
                  phoneNumberUtil.IsPossibleNumber(value) &&
                  phoneNumberUtil.IsValidNumber(value) &&
                 (phoneNumberUtil.IsValidNumberForRegion(value, "CH")
                 || phoneNumberUtil.IsValidNumberForRegion(value, "LI"));

                if (!valid)
                {
                    context.AddFailure(context.PropertyPath, "Phonenumber not valid");
                }
            }
            catch (Exception)
            {
                context.AddFailure(context.PropertyPath, "Phonenumber not valid");
            }
        }

        private static void IsAccessValid(string? access, ValidationContext<AedPropertyData> context)
        {
            if (string.IsNullOrEmpty(access))
            {
                return;
            }

            if (!(new List<string> { "yes", "no", "private", "permissive" }).Contains(access))
            {
                context.AddFailure(context.PropertyPath, "Access not valid");
            }
        }

        private static void IsIndoorValid(string? indoor, ValidationContext<AedPropertyData> context)
        {
            if (string.IsNullOrEmpty(indoor))
            {
                return;
            }

            if (!(new List<string> { "yes", "no" }).Contains(indoor))
            {
                context.AddFailure(context.PropertyPath, "Indoor not valid");
            }
        }

        private static void IsNumber(string? value, ValidationContext<AedPropertyData> context)
        {
            if (string.IsNullOrEmpty(value))
            {
                return;
            }

            if (!int.TryParse(value, out _))
            {
                context.AddFailure(context.PropertyPath, "Value is not a number");
            }
        }
    }
}