namespace StudentDashboard.Api.DTOs
{
    public class StudentSummaryDto
    {
        public string? StudentName { get; set; }
        public int TotalWorksheetsAssigned { get; set; }
        public int TotalWorksheetsSubmitted { get; set; }

        public int TotalTestsTaken { get; set; }
        public double AverageTestScore { get; set; }

        public string? MostRecentActivityDescription { get; set; }
        public DateTime? MostRecentActivityTimestamp { get; set; }
    }
}
