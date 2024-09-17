import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-section about">
        <h4>About Trek Seeker</h4>
        <p>
          Trek Seeker is your go-to travel companion for personalized itineraries and travel recommendations. Discover
          new destinations and make the most of your trips with us!
        </p>
      </div>

      <div className="footer-section links">
        <h4>Quick Links</h4>
        <ul>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">Create Trip</a>
          </li>
          <li>
            <a href="#services">Currency Convert</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </div>

      <div className="footer-section social">
        <h4>Follow Us</h4>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <p className="footer-text">
        Developed with <span className="heart">❤️</span> by Sanith Samaraweera
      </p>
      <p className="copyright">&copy; {new Date().getFullYear()} Trek Seeker. All rights reserved.</p>
    </div>
  </footer>
);
