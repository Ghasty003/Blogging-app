const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/blog");

const app = express();

const dbURI =
  "mongodb+srv://Ghasty:ghasty@blog1.mzg6xvd.mongodb.net/blog1?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(3000, () => {
      console.log("listening at port 3000");
    });
    console.log("Connected to db");
  })
  .catch((err) => console.log("err occured"));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  Blog.find()
    .then((result) => {
      res.status(200).render("index", { title: "Home", blogs: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/about", (req, res) => {
  res.status(200).render("about", { title: "About" });
});

app.get("/blogs/create", (req, res) => {
  res.status(200).render("create", { title: "Create" });
});

app.get("/add-blog", (req, res) => {
  const blog = new Blog({
    title: "A new Blog 2",
    body: "About my new Blog",
    snippet: "More about my new blog 2",
  });
  blog
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/all-blogs", (req, res) => {
  Blog.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/single-blog", (req, res) => {
  Blog.findById("6366515794f67bed2be7abd3")
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

app.get("/:id", (req, res) => {
  const id = req.params.id;

  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result, title: "Blog details" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", (req, res) => {
  const blog = new Blog(req.body);

  blog
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

app.delete("/:id", (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then(() => {
      res.json({ redirect: "/" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
