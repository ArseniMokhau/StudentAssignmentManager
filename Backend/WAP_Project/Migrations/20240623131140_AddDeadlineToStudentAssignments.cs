using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WAP_Project.Migrations
{
    /// <inheritdoc />
    public partial class AddDeadlineToStudentAssignments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "SubmissionDate",
                table: "StudentAssignments",
                type: "TEXT",
                nullable: false,
                defaultValue: DateTime.UtcNow); // Значение по умолчанию - текущая дата и время UTC
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubmissionDate",
                table: "StudentAssignments");
        }
    }
}
