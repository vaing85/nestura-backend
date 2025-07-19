# Nestura Backend

This is the backend for Nestura, a property rental platform, built with Node.js, Express, and TypeScript.

## Features
- User authentication
- Property listings
- Booking endpoints

## Getting Started

### Environment Variables
Create a `.env` file in the backend root with the following variables:

```
MONGO_URI=mongodb://localhost:27017/nestura
PORT=3000
JWT_SECRET=changeme
```

You can change these values as needed for your local or production environment.

### Install dependencies
```
npm install
```

### Run the development server
```
npm run dev
```

## Project Structure
- `src/` - Source code
- `tsconfig.json` - TypeScript configuration

## Scripts
- `npm run dev` - Start the server in development mode

---

Replace this README as you build out your project. All references to 'Airbnb Clone' should now be considered 'Nestura.'
