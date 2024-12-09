FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install daphne mysqlclient

COPY . .

RUN python manage.py collectstatic --noinput

CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && daphne -b 0.0.0.0 -p 8000 server.asgi:application"]

EXPOSE 8000
