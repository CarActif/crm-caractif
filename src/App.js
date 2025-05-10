import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";
import logo from "./caractif-logo.png";

const supabase = createClient(
  "https://gijlunazysdaidggpnag.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpamx1bmF6eXNkYWlkZ2dwbmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MTY1NDMsImV4cCI6MjA2MjM5MjU0M30.7ThIOCt7xeNdLtXUhU91xm6Kp8mefglKPRQmgpk3xmE"
);

export default function App() {
  const [user, setUser] = useState(null);
  const [mandats, setMandats] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState({
    marque: "",
    modele: "",
    prix: "",
    kilometrage: "",
    description: "",
    proprietaire: "",
    statut: "Mandat reçu",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data?.user) {
      setUser(data.user);
    } else {
      alert("Erreur de connexion : " + error.message);
    }
  };

  const fetchMandats = async () => {
    const { data } = await supabase
      .from("mandats")
      .select("*")
      .order("id", { ascending: false });
    setMandats(data || []);
  };

  const handleSubmit = async () => {
    const { error } = await supabase.from("mandats").insert([
      { ...form, commercial: user.email }
    ]);
    if (!error) {
      fetchMandats();
      setForm({
        marque: "",
        modele: "",
        prix: "",
        kilometrage: "",
        description: "",
        proprietaire: "",
        statut: "Mandat reçu",
      });
    } else {
      console.error(error);
alert("Erreur à l'ajout du mandat : " + JSON.stringify(error));
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user));
  }, []);

  useEffect(() => {
    if (user) fetchMandats();
  }, [user]);

  if (!user) {
    return (
      <div className="container">
        <img src={logo} alt="CarActif" className="logo" />
        <h1>Connexion CarActif</h1>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Connexion</button>
      </div>
    );
  }

  return (
    <div className="container">
      <img src={logo} alt="CarActif" className="logo" />
      <h1>Bienvenue {user.email}</h1>
      <h2>Ajouter un mandat</h2>
      <form>
        <input name="marque" placeholder="Marque" value={form.marque} onChange={handleChange} />
        <input name="modele" placeholder="Modèle" value={form.modele} onChange={handleChange} />
        <input name="prix" placeholder="Prix" value={form.prix} onChange={handleChange} />
        <input name="kilometrage" placeholder="Kilométrage" value={form.kilometrage} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}></textarea>
        <input name="proprietaire" placeholder="Propriétaire" value={form.proprietaire} onChange={handleChange} />
        <select name="statut" value={form.statut} onChange={handleChange}>
          <option>Mandat reçu</option>
          <option>Annonce publiée</option>
          <option>Sous offre</option>
          <option>Vendu</option>
        </select>
        <button type="button" onClick={handleSubmit}>Ajouter Mandat</button>
      </form>

      <h2>Mandats enregistrés</h2>
      {mandats.map((m) => (
        <div key={m.id} className="mandat-card">
          <strong>{m.marque} {m.modele}</strong> - {m.prix} €<br />
          {m.kilometrage} km - {m.proprietaire} - <strong>{m.statut}</strong><br />
          {m.description}
        </div>
      ))}
    </div>
  );
}
