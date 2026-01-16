# Bookstore Backend

A Spring Boot REST API for the Second-Hand Bookstore application.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Item Management**: CRUD operations for books and stationery items
- **Category Management**: Organize items by categories
- **Search & Filtering**: Advanced search with multiple filters
- **User Management**: User registration, login, and profile management
- **Database**: H2 in-memory database for development, PostgreSQL ready for production

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** with JWT
- **Spring Data JPA**
- **H2 Database** (development)
- **PostgreSQL** (production ready)
- **Maven**

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info

### Items
- `GET /api/items` - Get all items (paginated)
- `GET /api/items/search` - Search items with filters
- `GET /api/items/{id}` - Get item by ID
- `POST /api/items` - Create new item (authenticated)
- `PUT /api/items/{id}` - Update item (owner only)
- `DELETE /api/items/{id}` - Delete item (owner only)
- `GET /api/items/my-items` - Get current user's items
- `GET /api/items/conditions` - Get available item conditions

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/{id}` - Update category (admin)
- `DELETE /api/categories/{id}` - Delete category (admin)

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bookstore-backend
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Access the application**
   - API Base URL: `http://localhost:8080`
   - H2 Console: `http://localhost:8080/h2-console`
     - JDBC URL: `jdbc:h2:mem:bookstore`
     - Username: `sa`
     - Password: `password`

### Sample Data

The application comes with sample data including:
- 3 sample users (passwords: `password123`)
- 4 categories (Books, Textbooks, Stationery, School Supplies)
- 6 sample items

### Sample Users
- **Regular User**: `john@example.com` / `password123`
- **Regular User**: `jane@example.com` / `password123`
- **Admin User**: `admin@example.com` / `password123`

## Configuration

### Database Configuration

The application is configured to use H2 in-memory database by default. To switch to PostgreSQL:

1. **Update `application.yml`**:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/bookstore
       driver-class-name: org.postgresql.Driver
       username: ${DB_USERNAME:bookstore}
       password: ${DB_PASSWORD:password}
     jpa:
       hibernate:
         ddl-auto: update
       properties:
         hibernate:
           dialect: org.hibernate.dialect.PostgreSQLDialect
   ```

2. **Create PostgreSQL database**:
   ```sql
   CREATE DATABASE bookstore;
   ```

### JWT Configuration

JWT settings can be configured in `application.yml`:
```yaml
jwt:
  secret: your-secret-key-here
  expiration: 86400000 # 24 hours in milliseconds
```

### CORS Configuration

CORS is configured to allow requests from `http://localhost:3000` (React frontend). Update in `application.yml`:
```yaml
cors:
  allowed-origins: http://localhost:3000
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: "*"
  allow-credentials: true
```

## API Usage Examples

### Authentication

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "New User",
    "email": "newuser@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Items

**Get all items:**
```bash
curl -X GET "http://localhost:8080/api/items?page=0&size=10"
```

**Search items:**
```bash
curl -X GET "http://localhost:8080/api/items/search?category=Books&minPrice=100&maxPrice=1000"
```

**Create item (requires authentication):**
```bash
curl -X POST http://localhost:8080/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New Book",
    "price": 500.00,
    "imageUrl": "https://example.com/image.jpg",
    "condition": "GOOD",
    "description": "A great book",
    "categoryId": 1
  }'
```

## Development

### Project Structure
```
src/main/java/com/bookstore/
├── BookstoreApplication.java
├── config/
│   ├── SecurityConfig.java
│   └── CorsConfig.java
├── controller/
│   ├── AuthController.java
│   ├── ItemController.java
│   └── CategoryController.java
├── dto/
│   ├── AuthResponse.java
│   ├── ItemDto.java
│   └── CategoryDto.java
├── entity/
│   ├── User.java
│   ├── Item.java
│   └── Category.java
├── exception/
│   └── GlobalExceptionHandler.java
├── repository/
│   ├── UserRepository.java
│   ├── ItemRepository.java
│   └── CategoryRepository.java
├── security/
│   ├── JwtUtil.java
│   ├── JwtAuthenticationFilter.java
│   └── UserDetailsServiceImpl.java
└── service/
    ├── AuthService.java
    ├── ItemService.java
    └── CategoryService.java
```

## Production Deployment

1. **Configure PostgreSQL database**
2. **Set environment variables**:
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET`
3. **Build JAR file**: `mvn clean package`
4. **Run**: `java -jar target/bookstore-backend-0.0.1-SNAPSHOT.jar`

## License

This project is licensed under the MIT License.
