using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WAP_Project.Migrations
{
    /// <inheritdoc />
    public partial class RepositoryAccessRequestCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RepositoryAccessRequests",
                columns: table => new
                {
                    RepositoryAccessRequestId = table.Column<string>(type: "TEXT", nullable: false),
                    CourseId = table.Column<string>(type: "TEXT", nullable: false),
                    StudentId = table.Column<string>(type: "TEXT", nullable: false),
                    RequestTime = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RepositoryAccessRequests", x => x.RepositoryAccessRequestId);
                    table.ForeignKey(
                        name: "FK_RepositoryAccessRequests_Repositories_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Repositories",
                        principalColumn: "RepositoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RepositoryAccessRequests_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RepositoryAccessRequests_CourseId",
                table: "RepositoryAccessRequests",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_RepositoryAccessRequests_StudentId",
                table: "RepositoryAccessRequests",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RepositoryAccessRequests");

        }
    }
}
