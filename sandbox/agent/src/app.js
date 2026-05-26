import express from "express";
import morgan from "morgan";
import fs from "fs";

const WORKING_DIR = "/workspace";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from sandbox agent!",
    status: "success",
  });
});

app.get("/list-files", async (req, res) => {
  const elements = await fs.promises.readdir("/workspace");

  res.status(200).json({
    message: "Elements in working directory",
    elements,
  });
});

app.get("/read-files", async (req, res) => {
  const files = req.query.files;

  if (!files) {
    return res.status(400).json({
      message: "No files specified",
      status: "error",
    });
  }
  const fileList = files.split(",");

  await Promise.all(
    fileList.map(async (file) => {
      const filePath = `${WORKING_DIR}/${file}`;
      try {
        const content = await fs.promises.readFile(filePath, "utf-8");
        return {
          [filePath]: content,
        };
      } catch (err) {
        res.write(`Error reading file ${file}: ${err.message}\n`);
      }
    }),
  );
});

app.patch("/update-files", async (req, res) => {
  const updates = req.body;
  if (!updates || Array.isArray(updates)) {
    return res.status(400).json({
      message:
        'invalid request body, Expected a Json object with an "updates" property containing an array of file updates',
      status: "error",
    });
  }

  const results = await Promise.all(
    updates.map(async (update) => {
      const { file, content } = update;
      const filePath = `${WORKING_DIR}/${file}`;
      try {
        await fs.promises.writeFile(filePath, content, "utf-8");
        return {
          [filePath]: "File updated successfully",
        };
      } catch (err) {
        return {
          [filePath]: `Error updating file: ${err.message}`,
        };
      }
    }),
  );
    res.status(200).json({
        message: "File update results",
        results,
    })
});

export default app;
