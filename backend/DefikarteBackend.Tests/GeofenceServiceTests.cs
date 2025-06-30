using DefikarteBackend.Interfaces;
using DefikarteBackend.Services;
using Microsoft.Extensions.Logging;
using Moq;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using NetTopologySuite.Geometries.Implementation;
using System.Reflection;

namespace DefikarteBackend.Tests
{
    [TestFixture]
    public class GeofenceServiceTests
    {
        private Mock<IBlobStorageDataRepository> _blobRepositoryMock;
        private Mock<IServiceConfiguration> _configuratonMock;
        private Mock<ILogger<GeofenceService>> _loggerMock;

        [SetUp]
        public void Setup()
        {
            NtsGeometryServices.Instance = new NtsGeometryServices(
              CoordinateArraySequenceFactory.Instance,
              new PrecisionModel(1000d),
              4326,
              GeometryOverlay.NG,
              new CoordinateEqualityComparer());

            _blobRepositoryMock = new Mock<IBlobStorageDataRepository>();
            var geoJson = GetFileContents("swissboundaries3d_2024-01_4326.geojson");
            _blobRepositoryMock.Setup(x => x.ReadAsync(It.IsAny<string>())).ReturnsAsync(geoJson);

            _configuratonMock = new Mock<IServiceConfiguration>();
            _configuratonMock.Setup(Setup => Setup.BlobStorageSwissBoundariesName).Returns("swissboundaries3d_2024-01_4326.geojson");

            _loggerMock = new Mock<ILogger<GeofenceService>>();
        }

        [Test]
        public async Task IsSwitzerlandAsync_GivenCooridnatesInSwitzerland_ShouldReturnTrueAsync()
        {
            // Arrange
            var localisationService = new GeofenceService(NtsGeometryServices.Instance, _blobRepositoryMock.Object, _configuratonMock.Object, _loggerMock.Object);

            // Act
            var result = await localisationService.IsSwitzerlandAsync(47.0, 7.0).ConfigureAwait(false);

            // Assert
            Assert.That(result, Is.True);
        }

        [Test]
        public async Task IsSwitzerlandAsync_GivenCooridnatesOutsideSwitzerland_ShouldReturnFalseAsync()
        {
            // Arrange
            var localisationService = new GeofenceService(NtsGeometryServices.Instance, _blobRepositoryMock.Object, _configuratonMock.Object, _loggerMock.Object);

            // Act
            var result = await localisationService.IsSwitzerlandAsync(47.73921, 8.04199).ConfigureAwait(false);

            // Assert
            Assert.That(result, Is.False);
        }

        private string GetFileContents(string resourceFile)
        {
            var asm = Assembly.GetExecutingAssembly();
            var resource = string.Format("DefikarteBackend.Tests.Resources.{0}", resourceFile);
            using (var stream = asm.GetManifestResourceStream(resource))
            {
                if (stream != null)
                {
                    var reader = new StreamReader(stream);
                    return reader.ReadToEnd();
                }
            }

            return string.Empty;
        }
    }
}