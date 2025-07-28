using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentDashboard.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRelationshipConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StudentId1",
                table: "StudentWorksheets",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WorksheetTemplateId1",
                table: "StudentWorksheets",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StudentId1",
                table: "StudentTests",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TestTemplateId1",
                table: "StudentTests",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StudentId1",
                table: "StudentProgress",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentWorksheets_StudentId1",
                table: "StudentWorksheets",
                column: "StudentId1");

            migrationBuilder.CreateIndex(
                name: "IX_StudentWorksheets_WorksheetTemplateId1",
                table: "StudentWorksheets",
                column: "WorksheetTemplateId1");

            migrationBuilder.CreateIndex(
                name: "IX_StudentTests_StudentId1",
                table: "StudentTests",
                column: "StudentId1");

            migrationBuilder.CreateIndex(
                name: "IX_StudentTests_TestTemplateId1",
                table: "StudentTests",
                column: "TestTemplateId1");

            migrationBuilder.CreateIndex(
                name: "IX_StudentProgress_StudentId1",
                table: "StudentProgress",
                column: "StudentId1");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentProgress_Students_StudentId1",
                table: "StudentProgress",
                column: "StudentId1",
                principalTable: "Students",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentTests_Students_StudentId1",
                table: "StudentTests",
                column: "StudentId1",
                principalTable: "Students",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentTests_TestTemplates_TestTemplateId1",
                table: "StudentTests",
                column: "TestTemplateId1",
                principalTable: "TestTemplates",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentWorksheets_Students_StudentId1",
                table: "StudentWorksheets",
                column: "StudentId1",
                principalTable: "Students",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentWorksheets_WorksheetTemplates_WorksheetTemplateId1",
                table: "StudentWorksheets",
                column: "WorksheetTemplateId1",
                principalTable: "WorksheetTemplates",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentProgress_Students_StudentId1",
                table: "StudentProgress");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentTests_Students_StudentId1",
                table: "StudentTests");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentTests_TestTemplates_TestTemplateId1",
                table: "StudentTests");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentWorksheets_Students_StudentId1",
                table: "StudentWorksheets");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentWorksheets_WorksheetTemplates_WorksheetTemplateId1",
                table: "StudentWorksheets");

            migrationBuilder.DropIndex(
                name: "IX_StudentWorksheets_StudentId1",
                table: "StudentWorksheets");

            migrationBuilder.DropIndex(
                name: "IX_StudentWorksheets_WorksheetTemplateId1",
                table: "StudentWorksheets");

            migrationBuilder.DropIndex(
                name: "IX_StudentTests_StudentId1",
                table: "StudentTests");

            migrationBuilder.DropIndex(
                name: "IX_StudentTests_TestTemplateId1",
                table: "StudentTests");

            migrationBuilder.DropIndex(
                name: "IX_StudentProgress_StudentId1",
                table: "StudentProgress");

            migrationBuilder.DropColumn(
                name: "StudentId1",
                table: "StudentWorksheets");

            migrationBuilder.DropColumn(
                name: "WorksheetTemplateId1",
                table: "StudentWorksheets");

            migrationBuilder.DropColumn(
                name: "StudentId1",
                table: "StudentTests");

            migrationBuilder.DropColumn(
                name: "TestTemplateId1",
                table: "StudentTests");

            migrationBuilder.DropColumn(
                name: "StudentId1",
                table: "StudentProgress");
        }
    }
}
