[migrations cli](https://knexjs.org/guide/migrations.html#migration-cli)

[seed files](https://knexjs.org/guide/migrations.html#seed-files)

country codes ISO 3166-1 alpha-2

## Basic configuration

```
UI_URL=
SERVER_URL=
POSTGRES_HOST=
POSTGRES_DATABASE=minhaserra-api-database
POSTGRES_PORT=5432
POSTGRES_PASSWORD=
POSTGRES_USER=
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
JWT_SECRET=
```

TODOS:

- add sleep middleware to login, password reset, and email recovery
- allow user that soft deleted account to re-enable it using createUser
- narrow AWS account perms
- PASSWORD RESET - use token sent by email and set new password⌛
- prevent SQL injection
- udpate updatedAt everytime updatePassword, setEmailVerified etc
- only allow one password reset active at a time per user
