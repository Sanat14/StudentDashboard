using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentDashboard.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddScoreAndDueDateToStudentWorksheet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DueDate",
                table: "StudentWorksheets",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Score",
                table: "StudentWorksheets",
                type: "double precision",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DueDate",
                table: "StudentWorksheets");

            migrationBuilder.DropColumn(
                name: "Score",
                table: "StudentWorksheets");
        }
    }
}
