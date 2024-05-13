using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WAP_Project.Migrations
{
    /// <inheritdoc />
    public partial class SecondInitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Repositories",
                columns: table => new
                {
                    RepositoryId = table.Column<string>(type: "TEXT", nullable: false),
                    RepositoryName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Repositories", x => x.RepositoryId);
                });

            migrationBuilder.CreateTable(
                name: "RepositoryAssigments",
                columns: table => new
                {
                    AssignmentId = table.Column<string>(type: "TEXT", nullable: false),
                    RepositoryId = table.Column<string>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RepositoryAssigments", x => x.AssignmentId);
                    table.ForeignKey(
                        name: "FK_RepositoryAssigments_Repositories_RepositoryId",
                        column: x => x.RepositoryId,
                        principalTable: "Repositories",
                        principalColumn: "RepositoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentRepositories",
                columns: table => new
                {
                    StudentRepositoryId = table.Column<string>(type: "TEXT", nullable: false),
                    RepositoriesRepositoryId = table.Column<string>(type: "TEXT", nullable: false),
                    StudentId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentRepositories", x => x.StudentRepositoryId);
                    table.ForeignKey(
                        name: "FK_StudentRepositories_Repositories_RepositoriesRepositoryId",
                        column: x => x.RepositoriesRepositoryId,
                        principalTable: "Repositories",
                        principalColumn: "RepositoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentRepositories_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TeacherRepositories",
                columns: table => new
                {
                    TeacherRepositoryId = table.Column<string>(type: "TEXT", nullable: false),
                    RepositoriesRepositoryId = table.Column<string>(type: "TEXT", nullable: false),
                    TeacherId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeacherRepositories", x => x.TeacherRepositoryId);
                    table.ForeignKey(
                        name: "FK_TeacherRepositories_Repositories_RepositoriesRepositoryId",
                        column: x => x.RepositoriesRepositoryId,
                        principalTable: "Repositories",
                        principalColumn: "RepositoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TeacherRepositories_Teachers_TeacherId",
                        column: x => x.TeacherId,
                        principalTable: "Teachers",
                        principalColumn: "TeacherId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RepositoryAssigments_RepositoryId",
                table: "RepositoryAssigments",
                column: "RepositoryId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentRepositories_RepositoriesRepositoryId",
                table: "StudentRepositories",
                column: "RepositoriesRepositoryId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentRepositories_StudentId",
                table: "StudentRepositories",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherRepositories_RepositoriesRepositoryId",
                table: "TeacherRepositories",
                column: "RepositoriesRepositoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherRepositories_TeacherId",
                table: "TeacherRepositories",
                column: "TeacherId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RepositoryAssigments");

            migrationBuilder.DropTable(
                name: "StudentRepositories");

            migrationBuilder.DropTable(
                name: "TeacherRepositories");

            migrationBuilder.DropTable(
                name: "Repositories");
        }
    }
}
