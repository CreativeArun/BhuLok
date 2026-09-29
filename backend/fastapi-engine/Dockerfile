FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libgl1 \
    libegl1 \
    libusb-1.0-0 \
    libidn2-0 \
    libxcb1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY storage ./storage

RUN mkdir -p storage/uploads storage/models storage/meshes storage/pointclouds

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
