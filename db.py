import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        database="llm_observability",
        user="admin",
        password="admin",
        port=5432
    )

    print("Database connected successfully ✅")

except Exception as e:
    print("Database connection failed ❌")
    print(e)