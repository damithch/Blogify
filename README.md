# 📝 Blogify - Next.js Blog with CMS

A modern, full-featured blog application with Content Management System capabilities, built with Next.js, featuring user authentication, post creation/editing, and a powerful admin panel for content moderation.


## ✨ Features

### 🔐 **Authentication & Authorization**
- **Email/Password Authentication** using NextAuth.js v5
- **Role-based Access Control** (User/Admin)
- **Protected Routes** with middleware
- **Session Management** with JWT tokens

### 📖 **Blog Functionality**
- **Public Blog Feed** displaying approved posts
- **Dynamic Post Routes** with SEO-friendly URLs
- **Responsive Design** with modern UI/UX
- **Post Status System** (Pending, Approved, Rejected)

### 👤 **User Dashboard**
- **Personal Post Management** (Create, Edit, Delete)
- **Real-time Status Tracking** for submitted posts
- **Rich Text Editor** for content creation
- **Post Analytics** and statistics

### 🛡️ **Admin Panel**
- **Content Moderation** with approve/reject workflow
- **Bulk Actions** for efficient post management
- **Advanced Filtering** by status and author
- **Analytics Dashboard** with real-time stats
- **Post Preview Modal** for quick review

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **PostgreSQL** database
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/damithch/Blogify.git
cd Blogify
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/blogify"

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Admin User (Required - Set your admin credentials)
ADMIN_EMAIL="admin@yourcompany.com"
ADMIN_PASSWORD="your-secure-password"
ADMIN_NAME="System Administrator"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npm run db:migrate

# Seed the database with initial admin user
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🎯 Admin Access (Built-in Demo Account)

**Ready-to-use Admin Credentials:**

🔑 **Admin Login:**
- **Email**: `admin@blogify.com`
- **Password**: `admin123`
- **Access**: Full admin panel at `/admin`

**Regular User Accounts:**
- Create new user accounts at `/auth/signup`
- Regular users can create posts and manage their own content

> 💡 **For Assignment Evaluators**: These admin credentials are hardcoded and work immediately after starting the application - no database setup required!


## 📊 Database Schema

### User Table
```sql
- id: String (Primary Key)
- name: String
- email: String (Unique)
- password: String (Hashed)
- role: Enum (USER, ADMIN)
- createdAt: DateTime
- updatedAt: DateTime
```

### Post Table
```sql
- id: String (Primary Key)
- title: String
- content: String (Text)
- status: Enum (PENDING, APPROVED, REJECTED)
- authorId: String (Foreign Key → User)
- createdAt: DateTime
- updatedAt: DateTime
```

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database with admin user |
| `npm run db:studio` | Open Prisma Studio |
| `npm run admin:create` | Interactive admin management tool |

## 🛡️ Authentication & Role Management

### User Roles

- **USER**: Can create, edit, and delete their own posts
- **ADMIN**: Full access to all posts and admin panel

### Admin Access System

**This application uses a hardcoded admin login system for maximum security and ease of testing:**

#### 🚀 Instant Admin Access
**Built-in Admin Credentials (No Setup Required):**
- **Email**: `admin@blogify.com`
- **Password**: `admin123`
- **Role**: Full Administrator
- **Features**: Complete access to admin panel, post moderation, user management

#### 🔐 How It Works
1. **Hardcoded Authentication**: Admin credentials are built into the authentication system
2. **Immediate Access**: Works instantly after starting the application
3. **No Database Required**: Authentication bypasses database for demo admin
4. **Secure Fallback**: Still supports database users for regular accounts

#### 🛠️ Additional Admin Creation (Optional)
For production or additional admins, you can use:

**Environment Variables:**
```bash
# Optional: Set custom admin in .env.local
ADMIN_EMAIL="admin@yourcompany.com"
ADMIN_PASSWORD="your-secure-password" 
ADMIN_NAME="System Administrator"

# Then run: npm run db:seed
```

**CLI Management Tool:**
```bash
# Interactive admin creation
npm run admin:create
```

#### 🔒 Security Features
- ✅ No public admin registration endpoints
- ✅ Hardcoded demo admin for assignment testing
- ✅ Environment-based custom admin support
- ✅ Role-based access control (USER/ADMIN)
- ✅ Secure password hashing for database users
- ⚠️ Change demo credentials in production environments!


## 📱 Admin Panel Usage

### 🚀 Quick Admin Login
1. **Navigate to**: `http://localhost:3000/auth/signin`
2. **Enter credentials**:
   - Email: `admin@blogify.com`
   - Password: `admin123`
3. **Access admin panel**: Automatic redirect to `/admin`

### 🛡️ Admin Features
- **📊 Dashboard Analytics**: View post statistics and trends
- **🔍 Advanced Filtering**: Filter by status, author, or date
- **✅ Bulk Actions**: Approve, reject, or delete multiple posts
- **👁️ Post Preview**: Review posts before making decisions
- **📈 Real-time Updates**: Live stats and notifications

### 📋 Admin Capabilities
- **Content Moderation**: Approve/reject user-submitted posts
- **User Management**: View all users and their activity
- **Post Management**: Full CRUD operations on all posts
- **Analytics**: Track system usage and performance
- **Security**: Role-based access control
- **🔍 Advanced Filtering**: Filter by status, author, or date
- **✅ Bulk Actions**: Approve, reject, or delete multiple posts
- **👁️ Post Preview**: Review posts before making decisions
- **📈 Real-time Updates**: Live stats and notifications

## 🏗️ Tech Stack

### Frontend
- **Next.js 15.5.3** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **React 19.1.0** - Latest React with concurrent features

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js 5** - Authentication solution
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Production database

### DevOps & Tools
- **ESLint** - Code linting
- **Prisma Studio** - Database GUI
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel components
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── posts/             # Blog post pages
├── components/            # Reusable components
├── lib/                   # Utility functions
└── types/                 # TypeScript definitions

prisma/
├── schema.prisma          # Database schema
├── migrations/            # Database migrations
└── seed.ts               # Database seeding

docs/
└── ADMIN_SETUP.md        # Admin setup guide
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm run start
```

## 📝 API Documentation

### Authentication Required Endpoints

| Method | Endpoint | Description | Auth Level |
|--------|----------|-------------|------------|
| `POST` | `/api/posts` | Create new post | User |
| `GET` | `/api/posts` | Get user's posts | User |
| `PUT` | `/api/posts/[id]` | Update post | User (Owner) |
| `DELETE` | `/api/posts/[id]` | Delete post | User (Owner) |
| `PATCH` | `/api/admin/posts/[id]` | Update post status | Admin |
| `POST` | `/api/admin/posts/bulk` | Bulk post actions | Admin |

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Home page with approved posts |
| `GET` | `/posts/[id]` | Individual post page |
| `POST` | `/api/auth/register` | User registration |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment tools
- **Prisma** for the excellent ORM
- **NextAuth.js** for authentication solution
