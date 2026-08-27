# 🍳 CookSmart — Smart Cooking & Recipe Discovery Portal

CookSmart is a modern web application designed to help home cooks discover recipes based on available ingredients, meal preferences, dietary requirements, and cooking time.

## 🚀 Tech Stack
- **Frontend**: Angular 17 (Standalone Components, SCSS, RxJS)
- **Backend**: ASP.NET Core 8 Web API (Minimal APIs / Entity Framework Core with MySQL support)
- **Database**: MySQL (`CookSmartDb.sql`) & Local JSON fallback

## 📂 Project Structure
```text
├── backend/
│   └── CookSmart.Api/       # ASP.NET Core Web API
├── frontend/                # Angular 17 Single Page Application
├── docs/                    # Architecture diagrams, reports, specifications
├── CookSmartDb.sql          # MySQL database schema & sample dataset
└── README.md
```

## 🛠️ Local Development Setup

### 1. Run Backend API (.NET 8)
```bash
cd backend/CookSmart.Api
dotnet run
```
API runs at: `http://localhost:5080`

### 2. Run Frontend (Angular 17)
```bash
cd frontend
npm install
npm start
```
Frontend runs at: `http://localhost:4200`
