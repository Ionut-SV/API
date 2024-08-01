import React from 'react';
import '../styles/About.css'; // Make sure to create this CSS file

function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>Telecom Academy</h1>
        <p>Hub Educațional pentru Proiecte de Rețelistică și Programare</p>
      </header>

      <main className="about-content">
        <section className="about-section">
          <h2>Misiunea Noastră</h2>
          <p>
            Telecom Academy își propune să creeze un hub educațional centralizat unde studenții și profesioniștii pot accesa și împărtăși cunoștințe despre proiecte de CCNA și programare. Misiunea noastră este de a împuternici cursanții cu abilități practice și resurse, ajutându-i să exceleze în carierele lor în telecomunicații și dezvoltare software.
          </p>
        </section>

        <section className="about-section">
          <h2>Viziunea Noastră</h2>
          <p>
            Ne imaginăm o lume în care cunoștințele sunt accesibile gratuit pentru toți, promovând o comunitate de cursanți și educatori pasionați de avansarea în tehnologie și telecomunicații. Ne străduim să fim platforma lider pentru învățare practică, bazată pe proiecte.
          </p>
        </section>

        <section className="about-section">
          <h2>Povestea Noastră</h2>
          <p>
            Telecom Academy a luat naștere din dorința de a reduce diferența dintre cunoștințele teoretice și aplicarea practică. Fondatorii noștri, experți în telecomunicații și programare, au realizat nevoia unei platforme care să ofere proiecte reale și experiență practică. De la înființare, am devenit o comunitate vibrantă dedicată învățării continue și dezvoltării profesionale.
          </p>
        </section>

        <section className="about-section">
          <h2>Faceți Cunoștință cu Echipa</h2>
          <p>
            Echipa noastră este compusă din profesioniști cu experiență în telecomunicații, inginerie de rețea și dezvoltare software. Suntem pasionați de educație și dedicați furnizării de resurse și suport de înaltă calitate utilizatorilor noștri.
          </p>
        </section>
      </main>
    </div>
  );
}

export default About;