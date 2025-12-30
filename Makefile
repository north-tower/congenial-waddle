.PHONY: help build up down restart logs clean test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker image
	docker compose build

up: ## Start container
	docker compose up -d

down: ## Stop container
	docker compose down

restart: ## Restart container
	docker compose restart

logs: ## View logs
	docker compose logs -f

logs-frontend: ## View frontend logs
	docker compose logs -f frontend

clean: ## Remove container and images
	docker compose down --rmi all

ps: ## Show container status
	docker compose ps

shell: ## Open shell in container
	docker compose exec frontend sh

test: ## Test health endpoint
	curl http://localhost/health

deploy: ## Deploy to production
	./deploy.sh production

