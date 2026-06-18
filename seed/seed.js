import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

dotenv.config();


const run = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({}), Post.deleteMany({}), Comment.deleteMany({})]);
  console.log("Stari podaci obrisani.");

  const hash = async (pw) => bcrypt.hash(pw, await bcrypt.genSalt(10));

  const admin = await User.create({
    username: "admin", email: "admin@blog.com", password: await hash("admin123"), role: "admin",
  });
  const marko = await User.create({
    username: "marko", email: "marko@email.com", password: await hash("marko123"), role: "user",
  });
  const ana = await User.create({
    username: "ana", email: "ana@email.com", password: await hash("ana123"), role: "user",
  });
  console.log("Kreirani korisnici: admin, marko, ana");

  const img = (s) => `https://picsum.photos/seed/${s}/800/400`;
  const posts = await Post.insertMany([
    {
      title: "Uvod u React Hooks", category: "Programiranje",
      content: "React Hooks su uveli potpuno nov način pisanja komponenti. U ovom tekstu prolazimo kroz useState, useEffect i kako da napišete sopstveni hook za ponovnu upotrebu logike.",
      authorId: marko.id, authorName: marko.username, imageUrl: img("react"), likes: [ana.id],
    },
    {
      title: "Osnove modernog CSS-a", category: "Web Dizajn",
      content: "Flexbox i Grid su promenili način na koji raspoređujemo elemente na stranici. Pogledajmo praktične primere koji pokrivaju najčešće slučajeve u svakodnevnom radu.",
      authorId: ana.id, authorName: ana.username, imageUrl: img("css"), likes: [marko.id, admin.id],
    },
    {
      title: "Kako efikasno učiti programiranje", category: "Obrazovanje",
      content: "Učenje programiranja je maraton, a ne sprint. Donosimo nekoliko proverenih saveta za održavanje motivacije i izgradnju dobrih navika tokom dužeg vremenskog perioda.",
      authorId: marko.id, authorName: marko.username, imageUrl: img("learn"), likes: [],
    },
    {
      title: "Veštačka inteligencija u 2026. godini", category: "Tehnologija",
      content: "Pregled najvažnijih trendova u oblasti veštačke inteligencije i njihovog uticaja na svakodnevni razvoj softvera i alate koje koristimo u praksi.",
      authorId: ana.id, authorName: ana.username, imageUrl: img("ai"), likes: [marko.id],
    },
    {
      title: "Node.js i Express od nule", category: "Programiranje",
      content: "Izgradnja REST API-ja pomoću Node.js i Express okruženja. Objašnjavamo rutiranje, middleware i povezivanje sa bazom podataka kroz konkretne primere koda.",
      authorId: admin.id, authorName: admin.username, imageUrl: img("node"), likes: [],
    },
  ]);
  console.log(`Kreirano postova: ${posts.length}`);

  await Comment.insertMany([
    { postId: posts[0].id, authorId: ana.id, authorName: ana.username, content: "Odličan uvod, hvala!" },
    { postId: posts[0].id, authorId: admin.id, authorName: admin.username, content: "Vrlo korisno objašnjeno." },
    { postId: posts[1].id, authorId: marko.id, authorName: marko.username, content: "Grid mi je konačno jasan." },
  ]);
  console.log("Kreirani komentari.");

  console.log("\nSeed uspešno završen. Test nalozi:");
  console.log("  Admin:    admin@blog.com / admin123");
  console.log("  Korisnik: marko@email.com / marko123");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Greška pri seed-ovanju:", err);
  process.exit(1);
});
