# 目安箱

A simple web application used to gather opinions. Each opinion can be liked, disliked and commented on in similar fashion to StackOverflow. Comments behave like opinions and can receive likes, and comments of their own.

This application is written in TypeScript, built using Bun with ElysiaJS as web framework.
Opinions/comments are stored in a PostgreSQL database, interfaced with using the Prisma ORM.

## Environment variables

- MEYASUBAKO_DATABASE_URL: The URL of the PostgreSQL database
