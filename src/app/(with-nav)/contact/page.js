import "../../../styles/pages/contact.css";

export default function Contact() {
  return (
    <>
      <div className="contact-container">
        <form className="contact-form">
          <div className="contact-form-item">
            <label htmlFor="name">Nom</label>
            <input type="text" id="name" name="name" />
          </div>
          <div className="contact-form-item">
            <label htmlFor="name">Prénom</label>
            <input type="text" id="name" name="name" />
          </div>
          <div className="contact-form-item">
            <label htmlFor="name">Société</label>
            <input type="text" id="name" name="name" />
          </div>
          <div className="contact-form-item">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="contact-form-item">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="4"></textarea>
          </div>
          <button type="submit">Envoyer</button>
        </form>
      </div>
    </>
  );
} 