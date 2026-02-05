# Running the Full Application

This readme explains how to connect and run both the server (FastAPI) and client (React) together.

## Prerequisites

- Python 3.8+ installed
- Node.js and npm installed
- Virtual environment activated for Python

## Step-by-Step Instructions

### 1. Start the Backend Server (FastAPI)

**Terminal 1 - Backend:**

```bash
# Navigate to server directory
cd server

# Activate virtual environment (if not already activated)
source fastapienv/bin/activate  # or your venv path

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Run the FastAPI server with uvicorn
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The server will start at: **http://localhost:8000**

- API Documentation (Swagger): http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

**Verify it's running**: Open http://localhost:8000/docs in your browser

---

### 2. Start the Frontend Client (React)

**Terminal 2 - Frontend:**

```bash
# Navigate to client directory
cd client

# Install dependencies (if not already installed)
npm install

# Start the React development server
npm start
```

The client will start at: **http://localhost:3000**

**Verify it's running**: Your browser should automatically open http://localhost:3000

---

## Connection Configuration

The connection is already configured:

### Backend (FastAPI)
- **Port**: 8000
- **CORS**: Configured to allow `http://localhost:3000`
- **Location**: `server/app.py`

### Frontend (React)
- **Port**: 3000 (default)
- **API URL**: `http://localhost:8000` (configured in `client/src/services/api.js`)
- **Location**: `client/src/services/api.js`

```javascript
// Client automatically uses: http://localhost:8000
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
```

---

## API Endpoints Available

### Authentication
- `POST /auth` - Register new user
- `POST /auth/token` - Login (get JWT token)

### Products
- `GET /products` - Get all products
- `GET /products/{id}` - Get single product
- `POST /products` - Create product (requires auth)
- `PUT /products/{id}` - Update product (requires auth)
- `DELETE /products/{id}` - Delete product (requires auth)

### Cart
- `GET /cart` - Get user's cart (requires auth)
- `POST /cart/add` - Add item to cart (requires auth)
- `PUT /cart/update/{item_id}` - Update cart item (requires auth)
- `DELETE /cart/remove/{item_id}` - Remove item from cart (requires auth)

---

## Verification Checklist

### Backend is Running:
- [ ] Open http://localhost:8000/docs
- [ ] See Swagger API documentation
- [ ] Can test endpoints from the docs page

### Frontend is Running:
- [ ] Open http://localhost:3000
- [ ] React app loads in browser
- [ ] No CORS errors in browser console

### Connection Works:
- [ ] Frontend can fetch products from backend
- [ ] Login/Register works
- [ ] API calls show in backend terminal

---

## Troubleshooting

### Backend Issues

**Problem**: Port 8000 already in use
```bash
# Kill process on port 8000 (Linux/Mac)
lsof -ti:8000 | xargs kill -9

# Or use a different port
uvicorn app:app --reload --port 8001
# Then update client API_BASE_URL
```

**Problem**: Module not found errors
```bash
cd server
source fastapienv/bin/activate
pip install -r requirements.txt
```

### Frontend Issues

**Problem**: Port 3000 already in use
```bash
# React will automatically ask to use another port (3001, 3002, etc.)
# Or kill the process:
lsof -ti:3000 | xargs kill -9
```

**Problem**: Cannot connect to backend
- Check backend is running on port 8000
- Check CORS configuration in `server/app.py`
- Check browser console for errors
- Verify API_BASE_URL in `client/src/services/api.js`

**Problem**: CORS errors
- Backend must be running first
- Check `allow_origins=["http://localhost:3000"]` in `server/app.py`

---

## Workflow

1. **Start Backend First** (Terminal 1)
   ```bash
   cd server
   source fastapienv/bin/activate
   uvicorn app:app --reload --port 8000
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd client
   npm start
   ```


## Expected Behavior

1. Backend serves API at http://localhost:8000
2. Frontend runs at http://localhost:3000
3. Frontend makes API calls to http://localhost:8000
4. CORS allows communication between them
5. JWT tokens stored in localStorage for authentication

---



