const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");

const allowedOrigins = [
  'http://localhost:5173',                  
  'http://localhost:3000',                    
  'https://farmer-ordering-frontend-three.vercel.app/',
  'https://farmer-ordering-frontend-git-main-gmariehappy-7011.vercel.app',
  'https://farmer-ordering-frontend-gmariehappy-7011.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      console.log('No origin header - allowing request');
      return callback(null, true);
    }
        
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = `The CORS policy does not allow access from ${origin}`;
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Farmer Ordering API is running" });
});

module.exports = app;
