﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WAP_Project.Models;

#nullable disable

namespace WAP_Project.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20240622200008_RepositoryAccessRequestCreate")]
    partial class RepositoryAccessRequestCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.4");

            modelBuilder.Entity("WAP_Project.Models.Repository", b =>
                {
                    b.Property<string>("RepositoryId")
                        .HasColumnType("TEXT");

                    b.Property<string>("RepositoryName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("RepositoryId");

                    b.ToTable("Repositories");
                });

            modelBuilder.Entity("WAP_Project.Models.RepositoryAssigments", b =>
                {
                    b.Property<string>("AssignmentId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("RepositoryId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("AssignmentId");

                    b.ToTable("RepositoryAssigments");
                });

            modelBuilder.Entity("WAP_Project.Models.Student", b =>
                {
                    b.Property<string>("StudentId")
                        .HasColumnType("TEXT");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("StudentId");

                    b.ToTable("Students");
                });

            modelBuilder.Entity("WAP_Project.Models.StudentAssignments", b =>
                {
                    b.Property<string>("StudentAssignmentId")
                        .HasColumnType("TEXT");

                    b.Property<string>("AssignmentId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Deadline")
                        .HasColumnType("TEXT");

                    b.Property<string>("RepositoryAssigmentsAssignmentId")
                        .HasColumnType("TEXT");

                    b.Property<string>("StudentId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("StudentAssignmentId");

                    b.HasIndex("RepositoryAssigmentsAssignmentId");

                    b.HasIndex("StudentId");

                    b.ToTable("studentAssigments");
                });

            modelBuilder.Entity("WAP_Project.Models.StudentRepository", b =>
                {
                    b.Property<string>("StudentRepositoryId")
                        .HasColumnType("TEXT");

                    b.Property<string>("RepositoriesRepositoryId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("StudentId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("StudentRepositoryId");

                    b.HasIndex("RepositoriesRepositoryId");

                    b.HasIndex("StudentId");

                    b.ToTable("StudentRepositories");
                });

            modelBuilder.Entity("WAP_Project.Models.Teacher", b =>
                {
                    b.Property<string>("TeacherId")
                        .HasColumnType("TEXT");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("TeacherId");

                    b.ToTable("Teachers");
                });

            modelBuilder.Entity("WAP_Project.Models.TeacherRepository", b =>
                {
                    b.Property<string>("TeacherRepositoryId")
                        .HasColumnType("TEXT");

                    b.Property<string>("RepositoriesRepositoryId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("TeacherId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("TeacherRepositoryId");

                    b.HasIndex("RepositoriesRepositoryId");

                    b.HasIndex("TeacherId");

                    b.ToTable("TeacherRepositories");
                });

            modelBuilder.Entity("WAP_Project.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("WAP_Project.Models.UserToken", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("UserTokens");
                });

            modelBuilder.Entity("WAP_Project.Models.StudentAssignments", b =>
                {
                    b.HasOne("WAP_Project.Models.RepositoryAssigments", "RepositoryAssigments")
                        .WithMany()
                        .HasForeignKey("RepositoryAssigmentsAssignmentId");

                    b.HasOne("WAP_Project.Models.Student", "Student")
                        .WithMany()
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("RepositoryAssigments");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("WAP_Project.Models.StudentRepository", b =>
                {
                    b.HasOne("WAP_Project.Models.Repository", "Repository")
                        .WithMany()
                        .HasForeignKey("RepositoriesRepositoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WAP_Project.Models.Student", "Student")
                        .WithMany("StudentRepositories")
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Repository");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("WAP_Project.Models.TeacherRepository", b =>
                {
                    b.HasOne("WAP_Project.Models.Repository", "Repositories")
                        .WithMany()
                        .HasForeignKey("RepositoriesRepositoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WAP_Project.Models.Teacher", "Teachers")
                        .WithMany()
                        .HasForeignKey("TeacherId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Repositories");

                    b.Navigation("Teachers");
                });

            modelBuilder.Entity("WAP_Project.Models.Student", b =>
                {
                    b.Navigation("StudentRepositories");
                });
#pragma warning restore 612, 618
        }
    }
}
