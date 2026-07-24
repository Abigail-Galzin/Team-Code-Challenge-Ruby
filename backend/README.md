# SupportFlow — Backend

Rails API backend for SupportFlow, an internal application for registering, assigning, prioritizing, and tracking technical support requests. Serves JSON to the [React frontend](../frontend); no views, sessions, or server-rendered HTML.

See [ai/DECISIONS.md](../ai/DECISIONS.md) for the architecture rationale (Rails API, PostgreSQL, deployment).

## Technology Stack

- [Ruby](https://www.ruby-lang.org/) 3.2.2 ([.ruby-version](.ruby-version))
- [Rails](https://rubyonrails.org/) 8.1 (API-only, `config.api_only = true`)
- [PostgreSQL](https://www.postgresql.org/) via the `pg` gem
- [RSpec](https://rspec.info/), [FactoryBot](https://github.com/thoughtbot/factory_bot), [Faker](https://github.com/faker-ruby/faker) for testing
- [Kamal](https://kamal-deploy.org/) + [Thruster](https://github.com/basecamp/thruster) for Docker-based deployment

## Requirements

- Ruby 3.2.2 (use a version manager such as `rbenv` or `asdf` to match [.ruby-version](.ruby-version))
- Docker (to run PostgreSQL locally via Compose)

## Setup

```bash
# from backend/
bundle install
cp .env.example .env
```

`.env` holds the database connection variables (see `.env.example`) — defaults already match the Compose service below, so no editing is required for local development.

### Prepare the database

```bash
bin/rails db:prepare
```

Creates `backend_development` (and `backend_test`) if they don't exist and runs pending migrations. Use `bin/rails db:migrate` afterwards for new migrations.

### Seed data

```bash
bin/rails db:seed
```

Populates `db/seeds.rb`: 3 team members (one per role), 3 support requests (one per team member), and 2 comments per support request. Idempotent — safe to run multiple times.

## Run Locally

```bash
bin/rails server
# or: bin/dev
```

The API starts on `http://localhost:3000`. Health check: `GET /up` (returns `200` if the app boots without exceptions).

## Run Tests

```bash
bundle exec rspec
```

## Linting & Static Analysis

```bash
bin/rubocop          # style (rubocop-rails-omakase)
bin/brakeman          # security static analysis
bin/bundler-audit     # dependency vulnerability audit
```

## Environment Variables

Connection settings are read per-environment from `.env` (see [.env.example](.env.example) and [config/database.yml](config/database.yml)):

| Environment | Variables |
| --- | --- |
| development | `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` |
| test | `DATABASE_TEST_HOST`, `DATABASE_TEST_PORT`, `DATABASE_TEST_USERNAME`, `DATABASE_TEST_PASSWORD` |
| production | `DATABASE_PROD_HOST`, `DATABASE_PROD_PORT`, `DATABASE_PROD_USERNAME`, `DATABASE_PROD_PASSWORD` (no defaults — must be set at deploy time) |

## Folder Structure

```
backend/
├── app/
│   ├── controllers/
│   ├── models/          # TeamMember, ...
│   ├── jobs/
│   └── mailers/
├── config/
│   ├── database.yml
│   └── routes.rb
├── db/
│   ├── migrate/
│   └── schema.rb
├── spec/                # RSpec tests + factories
├── docker-compose.yml   # local PostgreSQL
├── Dockerfile           # production image (Kamal)
└── .env.example
```
