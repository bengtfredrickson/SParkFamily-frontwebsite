import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const css = `
  @import url(https://fonts.googleapis.com/css?family=Roboto:400,500,300,700);

* {
  font-family: Roboto;
}
.footer-distributed {
  background-color: #bdbdbd78;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
  width: 100%;
  text-align: left;
  font: normal 16px sans-serif;
  padding: 5px 42px;
}

.footer-distributed .footer-left p {
  color: #8f9296;
  font-size: 14px;
  margin: 0;
}
/* Footer links */

.footer-distributed p.footer-links {
  font-size: 18px;
  font-weight: bold;
  color: #000;
  margin: 0 0 10px;
  padding: 0;
  transition: ease .25s;
}

.footer-distributed p.footer-links a {
  display: inline-block;
  line-height: 1.8;
  text-decoration: none;
  color: inherit;
  transition: ease .25s;
}

.footer-distributed .footer-links a:before {
  content: "·";
  font-size: 20px;
  left: 0;
  color: #fff;
  display: inline-block;
  padding-right: 5px;
}

.footer-distributed .footer-links .link-1:before {
  content: none;
}

.footer-distributed .footer-right {
  float: right;
  margin-top: 6px;
  max-width: 180px;
}

.footer-distributed .footer-right a {
  display: inline-block;
  width: 35px;
  height: 35px;
  background-color: #33383b;
  border-radius: 2px;
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  line-height: 35px;
  margin-left: 3px;
  transition:all .25s;
}

.footer-distributed .footer-right a:hover{transform:scale(1.1); -webkit-transform:scale(1.1);}

.footer-distributed p.footer-links a:hover{text-decoration:underline;}

/* Media Queries */

@media (max-width: 600px) {
  .footer-distributed .footer-left, .footer-distributed .footer-right {
    text-align: center;
  }
  .footer-distributed .footer-right {
    float: none;
    margin: 0 auto 20px;
  }
  .footer-distributed .footer-left p.footer-links {
    line-height: 1.8;
  }
}

  `

  return (
    <>
      <style>{css}</style>
      <div>
        <footer className="footer-distributed">
          {/* <div className="footer-right">
            <a href="#"><i class="fa-brands fa-twitter"></i></a>
            <a href="#"><i className="fa-brands fa-twitter" /></a>
            <a href="#"><i className="fa-brands fa-linkedin" /></a>
            <a href="#"><i className="fa-brands fa-github" /></a>
          </div> */}
          <div className="footer-left">
            <p className="footer-links">
              {/* <Link to="/home" className="link-1" >Home</Link>
              <Link to="#">Blog</Link>
              <Link to="#">Pricing</Link>
              <Link to="#">About</Link>
              <Link to="#">Faq</Link>
              <Link to="#">Contact</Link> */}
            </p>
            <p>Valere Labs © 2019</p>
          </div>
        </footer>
      </div>

    </>
  )
}
