import redis

# Redis Connection
redis_client = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)


def store_otp(email: str, otp: str):
    """
    Store OTP in Redis with 5 minutes expiry.
    """

    # Store OTP for 300 seconds (5 mins)
    redis_client.setex(email, 300, str(otp))

    print(f"--- [REDIS OTP STORED] ---")
    print(f"Email: {email}")
    print(f"OTP: {otp}")
    print(f"Expires In: 300 seconds")
    print(f"--------------------------")


def verify_otp(email: str, otp: str, delete: bool = True):
    """
    Verify OTP from Redis.
    """

    stored_otp = redis_client.get(email)

    # OTP expired or not found
    if stored_otp is None:
        return False

    # OTP matched
    if stored_otp == str(otp):

        # Delete OTP after successful verification
        if delete:
            redis_client.delete(email)

        return True

    # OTP mismatch
    return False