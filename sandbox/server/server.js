import "dotenv/config";
import app from "./server/app.js";

app.listen(3000,()=>{
    console.log('Sandbox API server is running on port 3000');
})