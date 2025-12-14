# MySQL Database Setup Instructions

## 1. Install MySQL Server

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### CentOS/RHEL:
```bash
sudo yum install mysql-server
sudo systemctl start mysqld
sudo mysql_secure_installation
```

### macOS:
```bash
brew install mysql
brew services start mysql
```

### Windows:
Download and install from: https://dev.mysql.com/downloads/mysql/

## 2. Create Database

```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE instagram_growth;

-- Create user (optional, for security)
CREATE USER 'instagram_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON instagram_growth.* TO 'instagram_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE instagram_growth;
```

## 3. Update Environment Variables

Update your `.env` file with your MySQL credentials:

```env
# Format: mysql://username:password@host:port/database_name
DATABASE_URL="mysql://root:your_password@localhost:3306/instagram_growth"

# Or with the dedicated user:
DATABASE_URL="mysql://instagram_user:your_secure_password@localhost:3306/instagram_growth"
```

## 4. Run Database Migration

```bash
# Push the schema to MySQL
npm run db:push

# Or generate and apply migration
npx prisma migrate dev --name init
```

## 5. Start the Application

```bash
npm run dev
```

## Security Notes:

1. **Password Hashing**: All passwords are hashed using bcryptjs
2. **Database Security**: Use dedicated database user with limited privileges
3. **Environment Variables**: Never commit `.env` file to version control
4. **MySQL Security**: 
   - Disable remote root access
   - Use strong passwords
   - Enable SSL connections in production
   - Regular backups

## Troubleshooting:

### Connection Issues:
- Check MySQL service: `sudo systemctl status mysql`
- Verify credentials: `mysql -u username -p -h localhost`
- Check firewall settings

### Permission Issues:
- Ensure database user has proper privileges
- Check database and table permissions

### Migration Issues:
- Drop and recreate database if needed
- Check Prisma schema compatibility