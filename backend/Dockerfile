FROM python:3.11-slim

WORKDIR /app

# Upgrade pip and install curl
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY server.py .

EXPOSE 8000

# Using uvicorn directly. In the composed environment, the python server will run on 8000, mapped to 8042.
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
