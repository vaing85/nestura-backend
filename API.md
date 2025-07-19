# Nestura Backend API Documentation

## Authentication
Most endpoints require a JWT token in the `Authorization` header as `Bearer <token>`.

---

## Users
- `POST /api/users/register` — Register a new user
- `POST /api/users/login` — Login and receive a JWT
- `GET /api/users/profile` — Get current user profile (auth required)

## Properties
- `GET /api/properties` — List all properties
- `GET /api/properties/:id` — Get property by ID
- `POST /api/properties` — Create a new property (auth required)
- `PUT /api/properties/:id` — Update a property (auth required, owner only)
- `DELETE /api/properties/:id` — Delete a property (auth required, owner only)
- `POST /api/properties/upload-image` — Upload an image for a property (auth required, owner only)

## Bookings
- `GET /api/bookings` — List all bookings (auth required)
- `POST /api/bookings` — Create a new booking (auth required)
- `GET /api/bookings/:id` — Get booking by ID (auth required)
- `DELETE /api/bookings/:id` — Cancel a booking (auth required, owner or user)

## Reviews
- `GET /api/reviews` — List all reviews
- `POST /api/reviews` — Create a review (auth required)
- `GET /api/reviews/:id` — Get review by ID
- `DELETE /api/reviews/:id` — Delete a review (auth required, owner or user)

---

## Error Handling
- All errors return JSON: `{ message: string }`
- File upload errors return 400 with a descriptive message.

---

For detailed request/response examples, see the controller code or request further documentation.


# Detailed Request/Response Examples

## Users

### Register a new user

- **POST** `/api/users/register`

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

#### Success Response
- **Status:** 201 Created
```json
{
  "_id": "60f7c2b5e1b1c2a1b8e1a1b1",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "<jwt-token>"
}
```

#### Error Response (Email already exists)
- **Status:** 400 Bad Request
```json
{
  "message": "User already exists"
}
```

---

### Login

- **POST** `/api/users/login`

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

#### Success Response
- **Status:** 200 OK
```json
{
  "_id": "60f7c2b5e1b1c2a1b8e1a1b1",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "<jwt-token>"
}
```

#### Error Response (Invalid credentials)
- **Status:** 401 Unauthorized
```json
{
  "message": "Invalid email or password"
}
```

---

## Properties

### Create a new property

- **POST** `/api/properties`
- **Auth required:** Yes (Bearer token)

#### Request Body
```json
{
  "title": "Cozy Apartment",
  "description": "A nice place to stay.",
  "location": "New York",
  "price": 120,
  "images": ["image1.jpg", "image2.jpg"]
}
```

#### Success Response
- **Status:** 201 Created
```json
{
  "_id": "60f7c2b5e1b1c2a1b8e1a1b2",
  "title": "Cozy Apartment",
  "description": "A nice place to stay.",
  "location": "New York",
  "price": 120,
  "images": ["image1.jpg", "image2.jpg"],
  "owner": "60f7c2b5e1b1c2a1b8e1a1b1"
}
```

#### Error Response (Missing fields)
- **Status:** 400 Bad Request
```json
{
  "message": "Title, description, location, and price are required."
}
```

---

## Bookings

### Create a new booking

- **POST** `/api/bookings`
- **Auth required:** Yes (Bearer token)

#### Request Body
```json
{
  "propertyId": "60f7c2b5e1b1c2a1b8e1a1b2",
  "startDate": "2025-08-01",
  "endDate": "2025-08-05"
}
```

#### Success Response
- **Status:** 201 Created
```json
{
  "_id": "60f7c2b5e1b1c2a1b8e1a1b3",
  "property": "60f7c2b5e1b1c2a1b8e1a1b2",
  "user": "60f7c2b5e1b1c2a1b8e1a1b1",
  "startDate": "2025-08-01T00:00:00.000Z",
  "endDate": "2025-08-05T00:00:00.000Z",
  "status": "booked"
}
```

#### Error Response (Invalid dates)
- **Status:** 400 Bad Request
```json
{
  "message": "Invalid booking dates."
}
```
