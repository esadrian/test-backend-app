# Dcycle Frontend Technical Test by Adrián López

This project includes the next exercises:

- **Name Analysis**: Provides gender, nationality, and age probabilities based
  on a given name.
- **COVID-19 Analysis**: Displays historical COVID-19 data for the United
  States.

## Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/esadrian/test-backend-app
   cd test-backend-app
   ```

2. **Install dependencies**:

   ```bash
   npm run install
   ```

## Running the Application

### Development

To run the application in development mode with hot reloading:

```bash
npm run dev
```

- The React frontend will be available at `http://localhost:3000`
- The Express backend will be available at `http://localhost:3200`

### Production

To build and run the application in production mode:

1. **Build the React app**:

   ```bash
   npm run build
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

- The entire application will be available at `http://localhost:3000`

## API Endpoints

- **Name Analysis**:

  - `GET /api/genderize/:name`
  - `GET /api/nationalize/:name`
  - `GET /api/agify/:name`

- **COVID-19 Analysis**:
  - `GET /api/covid/historical`

## API Docs

- [Genderize.io](https://genderize.io/)
- [Nationalize.io](https://nationalize.io/)
- [Agify.io](https://agify.io/)
- [COVID Tracking Project](https://covidtracking.com/)
