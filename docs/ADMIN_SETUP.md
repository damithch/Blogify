# Admin User Management Guide

## 🔐 Creating Admin Users

### Method 1: Database Seeding (Recommended for Initial Setup)

1. **Set environment variables** in `.env.local`:
   ```bash
   ADMIN_EMAIL="admin@yourcompany.com"
   ADMIN_PASSWORD="your-secure-password"
   ADMIN_NAME="System Administrator"
   ```

2. **Run the seed script**:
   ```bash
   npm run db:seed
   ```

This creates an initial admin user with the credentials from your environment variables.

### Method 2: Interactive CLI Tool (Recommended for Production)

**Create new admin users:**
```bash
npm run admin:create
```

This interactive tool allows you to:
- ✅ Create new admin users
- ✅ List existing admin users  
- ✅ Promote regular users to admin
- ✅ View admin statistics

### Method 3: Database Direct (Emergency Only)

If you have direct database access:

```sql
-- Promote existing user to admin
UPDATE users SET role = 'ADMIN' WHERE email = 'user@example.com';

-- Or create new admin user (hash password first!)
INSERT INTO users (id, name, email, password, role, "createdAt", "updatedAt") 
VALUES (
  'clxxx', 
  'Admin Name', 
  'admin@example.com', 
  '$2a$10$hashedpasswordhere', 
  'ADMIN', 
  NOW(), 
  NOW()
);
```

## 🛡️ Security Best Practices

### 1. **Strong Passwords**
- Minimum 12 characters
- Mix of letters, numbers, symbols
- Unique for each admin

### 2. **Environment Security**
```bash
# .env.local (never commit to git)
ADMIN_EMAIL="admin@yourcompany.com"
ADMIN_PASSWORD="Str0ng!P@ssw0rd#2024"
```

### 3. **Regular Audits**
```bash
# List all admin users
npm run admin:create
# Choose option 2 to list admins
```

### 4. **Remove Default Credentials**
After creating your admin, update the password immediately:
1. Sign in to admin panel: `/admin`
2. Change password through user settings

## 📋 Admin Access URLs

- **Admin Panel**: `http://localhost:3000/admin`
- **Sign In**: `http://localhost:3000/auth/signin`
- **User Registration**: `http://localhost:3000/auth/signup`

## 🚨 Troubleshooting

### "No admin users found"
1. Run `npm run db:seed` to create initial admin
2. Or use `npm run admin:create` to create manually

### "User already exists"
Use the CLI tool to promote existing user:
```bash
npm run admin:create
# Choose option 3: "Promote existing user to admin"
```

### Database connection issues
1. Check your `DATABASE_URL` in `.env.local`
2. Run `npm run db:migrate` to ensure database is up to date
3. Use `npm run db:studio` to inspect database

## 🔧 Development vs Production

### Development
- Use `npm run admin:create` for quick admin creation
- Environment variables in `.env.local`

### Production  
- Use secure environment variable management
- Consider additional security layers (2FA, IP restrictions)
- Regular security audits
- Backup admin access methods