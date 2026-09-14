# Laravel backend with Docker

From the `backend` directory:

```powershell
docker compose up --build
```

The Laravel API is available at `http://localhost:5000/api` and MySQL is available to host tools at `localhost:3307`.

The container waits for MySQL, creates the public storage link, generates an application key when needed, and runs migrations automatically. Stop the services with:

```powershell
docker compose down
```

Add `-v` to `docker compose down` only when you intentionally want to remove the database volume.