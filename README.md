# 目安箱

[![AWS ECR](https://img.shields.io/badge/AWS%20ECR-meyasubako-blue)](https://gallery.ecr.aws/jtekt-corporation/meyasubako)

A simple web application used to gather opinions. Each opinion can be liked, disliked and commented on in similar fashion to StackOverflow. Comments behave like opinions and can receive likes, and comments of their own.

This application is written in TypeScript, built using Bun with ElysiaJS as web framework.
Opinions/comments are stored in a PostgreSQL database, interfaced with using the Prisma ORM.

## Environment variables

- DATABASE_URL: The PostgreSQL connection string
