public class StudentWorksheetDto
{
    public int Id { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string WorksheetTitle { get; set; } = string.Empty;
    public string Topic { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public DateTime AssignedDate { get; set; }
    public DateTime? SubmittedDate { get; set; }
    public double? Score { get; set; }
    public DateTime? DueDate { get; set; }
}
