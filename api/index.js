import { app } from "../server/dist/app.js";
import { connectDatabase } from "../server/dist/config/database.js";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("API error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
