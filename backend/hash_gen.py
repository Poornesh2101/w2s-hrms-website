from passlib.context import CryptContext

# Argon2 setup (Idhe dhaan namba project-layum use panrom)
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Neenga set panna ninaikira password-ai inga kudunga
plain_password = "Ashwin@1403" 

hashed_password = pwd_context.hash(plain_password)

print("\n" + "="*50)
print(f"PLAIN PASSWORD: {plain_password}")
print(f"HASHED PASSWORD (Copy this to DB): \n{hashed_password}")
print("="*50 + "\n")    