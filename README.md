# VML Test

A [Docker](https://www.docker.com/)-based project for VML using [Symfony](https://symfony.com) web framework and [Rect](https://es.react.dev/)

## Getting Started

1. If not already done, [install Docker Compose](https://docs.docker.com/compose/install/) (v2.10+)
2. Run `docker compose up --pull always -d --wait` to start the project
3. Run `ocker compose exec php-fpm git config --global --add safe.directory /application` to avoid git owner issues
4. Run `docker compose exec php-fpm composer install` to install PHP dependencies
5. Run `docker compose run --rm node npm install && npm run build` to install and compile js/css assets dependencies
6. Open `https://localhost:8080` in your favorite web browser to check the project
6. Open `https://localhost:8080/api` in your favorite web browser to inspect the API Specification
5. Run `docker compose down --remove-orphans` to stop the Docker containers.

## Features

* List user's data from external API
* Request response cached for performance
* Filtering data by name, username and email


**Enjoy!**
