import { Button, Card, CardContent, Typography } from "@mui/material";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="max-w-md shadow-xl">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            React + Vite + Tailwind + MUI
          </Typography>

          <p className="mb-4 text-gray-600">
            Tailwind handles layout and spacing, while MUI provides components.
          </p>

          <Button variant="contained">
            MUI Button
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
