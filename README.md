# f24_team_29
Repository for f24_team_29

[Project Board](https://github.com/orgs/cmu-webapps/projects/28/)

## How to run the project

### Frontend

Go to the frontend directory:
```bash
cd frontend
```

Create a `.env` file in the frontend directory with the following:
```
# Backend URL
VITE_PROD=false
VITE_BACKEND_URL=YOUR_BACKEND_URL  # The url of django backend, for local development, http://localhost:8000

# Stripe Publish Key
VITE_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

Install the dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

### Backend

Go to the backend directory:
```bash
cd backend
```

Create a `.env` file in the backend directory with the following:
```
# Django
DJANGO_SECRET_KEY=YOUR_SECRET_KEY
DJANGO_DEBUG=true

# Google OAuth
GOOGLE_OAUTH2_KEY=YOUR_GOOGLE_OAUTH2_KEY
GOOGLE_OAUTH2_SECRET=YOUR_GOOGLE_OAUTH2_SECRET

# URLs
FRONTEND_URL=YOUR_FRONTEND_URL # for local development, http://localhost:5173

# Stripe
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
```

Create a virtual environment and install the dependencies:
```bash
python3 -m venv venv
source venv/bin/activate
python3 -m pip install --upgrade pip
pip install -r requirements.txt
```

Run the development server:
```bash
python3 manage.py migrate
python3 manage.py runserver
```

