all: build run

run:
	caddy start
	cd backend && flask --app ./kitchenfire run --port 5123  || caddy stop

run_flask:
	cd backend && flask --app ./kitchenfire run --port 5123

build:
	cd frontend && npm run build

