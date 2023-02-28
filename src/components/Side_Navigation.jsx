import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router';

export default function Side_Navigation() {
  const navigate = useNavigate();
  const logout = async () => {
    await localStorage.removeItem('auth_token');
    navigate('/')
  }


  const css = `
    /*========== GOOGLE FONTS ==========*/
    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");
    
    /*========== VARIABLES CSS ==========*/
    :root {
      --header-height: 3.5rem;
      --nav-width: 219px;
    
      /*========== Colors ==========*/
      --first-color: #6923D0;
      --first-color-light: #F4F0FA;
      --title-color: #19181B;
      --text-color: #58555E;
      --text-color-light: #A5A1AA;
      --body-color: #F9F6FD;
      --container-color: #FFFFFF;
    
      /*========== Font and typography ==========*/
      --body-font: 'Poppins', sans-serif;
      --normal-font-size: .938rem;
      --small-font-size: .75rem;
      --smaller-font-size: .75rem;
    
      /*========== Font weight ==========*/
      --font-medium: 500;
      --font-semi-bold: 600;
    
      /*========== z index ==========*/
      --z-fixed: 100;
    }
    
    @media screen and (min-width: 1024px) {
      :root {
        --normal-font-size: 1rem;
        --small-font-size: .875rem;
        --smaller-font-size: .813rem;
      }
    }
    
    /*========== BASE ==========*/
    *, ::before, ::after {
      box-sizing: border-box;
    }
    
    body {
      margin: var(--header-height) 0 0 0;
      padding: 1rem 1rem 0;
      font-family: var(--body-font);
      font-size: var(--normal-font-size);
      background-color: var(--body-color);
      color: var(--text-color);
    }
    
    h3 {
      margin: 0;
    }
    
    a {
      text-decoration: none;
    }
    
    img {
      max-width: 54%;
      height: auto;
    }
    
    /*========== HEADER ==========*/
    .header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: var(--container-color);
      box-shadow: 0 1px 0 rgba(22, 8, 43, 0.1);
      padding: 0 1rem;
      z-index: var(--z-fixed);
    }
    
    .header__container {
      display: flex;
      align-items: center;
      height: var(--header-height);
      justify-content: space-between;
    }
    
    .header__img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }
    
    .header__logo {
      color: var(--title-color);
      font-weight: var(--font-medium);
      display: none;
    }
    
    .header__search {
      display: flex;
      padding: .40rem .75rem;
      background-color: var(--first-color-light);
      border-radius: .25rem;
    }
    
    .header__input {
      width: 100%;
      border: none;
      outline: none;
      background-color: var(--first-color-light);
    }
    
    .header__input::placeholder {
      font-family: var(--body-font);
      color: var(--text-color);
    }
    
    .header__icon, 
    .header__toggle {
      font-size: 1.2rem;
    }
    
    .header__toggle {
      color: var(--title-color);
      cursor: pointer;
    }
    
    /*========== NAV ==========*/
    .nav {
      position: fixed;
      top: 0;
      left: -100%;
      height: 100vh;
      padding: 1rem 1rem 0;
      background-color: var(--container-color);
      box-shadow: 1px 0 0 rgba(22, 8, 43, 0.1);
      z-index: var(--z-fixed);
      transition: .4s;
    }
    
    .nav__container {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-bottom: 3rem;
      overflow: auto;
      scrollbar-width: none; /* For mozilla */
    }
    
    /* For Google Chrome and others */
    .nav__container::-webkit-scrollbar {
      display: none;
    }
    
    .nav__logo {
      font-weight: var(--font-semi-bold);
      margin-bottom: 2.5rem;
    }
    
    .nav__list, 
    .nav__items {
      display: grid;
    }
    
    .nav__list {
      row-gap: 2.5rem;
    }
    
    .nav__items {
      row-gap: 1.5rem;
    }
    
    .nav__subtitle {
      font-size: var(--normal-font-size);
      text-transform: uppercase;
      letter-spacing: .1rem;
      color: var(--text-color-light);
    }
    
    .nav__link {
      display: flex;
      align-items: center;
      color: var(--text-color);
    }
    
    .nav__link:hover {
      color: var(--first-color);
    }
    
    .nav__icon {
      font-size: 1.2rem;
      margin-right: .5rem;
    }
    
    .nav__name {
      font-size: var(--small-font-size);
      font-weight: var(--font-medium);
      white-space: nowrap;
    }
    
    .nav__logout {
      margin-top: 5rem;
    }
    
    /* Dropdown */
    .nav__dropdown {
      overflow: hidden;
      max-height: 21px;
      transition: .4s ease-in-out;
    }
    
    .nav__dropdown-collapse {
      background-color: var(--first-color-light);
      border-radius: .25rem;
      margin-top: 1rem;
    }
    
    .nav__dropdown-content {
      display: grid;
      row-gap: .5rem;
      padding: .75rem 2.5rem .75rem 1.8rem;
    }
    
    .nav__dropdown-item {
      font-size: var(--smaller-font-size);
      font-weight: var(--font-medium);
      color: var(--text-color);
    }
    
    .nav__dropdown-item:hover {
      color: var(--first-color);
    }
    
    .nav__dropdown-icon {
      margin-left: auto;
      transition: .4s;
    }
    
    /* Show dropdown collapse */
    .nav__dropdown.open {
      max-height: 100rem;
    }
    
    /* Rotate icon arrow */
    .nav__dropdown.open .nav__dropdown-icon {
      transform: rotate(180deg);
    }
    /*===== Show menu =====*/
    .show-menu {
      left: 0;
    }
    
    /*===== Active link =====*/
    .active {
      color: var(--first-color);
    }
    
    /* ========== MEDIA QUERIES ==========*/
    /* For small devices reduce search*/
    @media screen and (max-width: 320px) {
      .header__search {
        width: 70%;
      }
    }
    
    @media screen and (min-width: 768px) {
      body {
        padding: 1rem 3rem 0 6rem;
      }
      .header {
        padding: 0 3rem 0 6rem;
      }
      .header__container {
        height: calc(var(--header-height) + .5rem);
      }
      .header__search {
        width: 300px;
        padding: .55rem .75rem;
      }
      .header__toggle {
        display: none;
      }
      .header__logo {
        display: block;
      }
      .header__img {
        width: 40px;
        height: 40px;
        order: 1;
      }
      .nav {
        left: 0;
        padding: 1.2rem 1.5rem 0;
        width: 68px; /* Reduced navbar */
      }
      .nav__items {
        row-gap: 1.7rem;
      }
      .nav__icon {
        font-size: 1.3rem;
      }
    
      /* Element opacity */
      .nav__logo-name, 
      .nav__name, 
      .nav__subtitle, 
      .nav__dropdown-icon {
        opacity: 0;
        transition: .3s;
      }
      
      
      /* Navbar expanded */
      .nav:hover{
        width: var(--nav-width);
      }
      
      /* Visible elements */
      .nav:hover .nav__logo-name {
        opacity: 1;
      }
      .nav:hover .nav__subtitle {
        opacity: 1;
      }
      .nav:hover .nav__name {
        opacity: 1;
      }
      .nav:hover .nav__dropdown-icon {
        opacity: 1;
      }
    }
    

    `

  /*==================== SHOW NAVBAR ====================*/
  const showMenu = (headerToggle, navbarId) => {
    const toggleBtn = document.getElementById(headerToggle),
      nav = document.getElementById(navbarId)

    // Validate that variables exist
    if (headerToggle && navbarId) {
      toggleBtn?.addEventListener('click', () => {
        // We add the show-menu class to the div tag with the nav__menu class
        nav.classList.toggle('show-menu')
        // change icon
        toggleBtn.classList.toggle('bx-x')
      })
    }
  }
  showMenu('header-toggle', 'navbar')

  /*==================== LINK ACTIVE ====================*/
  const linkColor = document.querySelectorAll('.nav__link')

  function colorLink() {
    linkColor.forEach(l => l.classList.remove('active'))
    this.classList.add('active')
  }

  linkColor.forEach(l => l?.addEventListener('click', colorLink))



  return (
    <>
      <style>{css}</style>


      <div>
        {/*========== HEADER ==========*/}
        <header className="header">
          <div className="header__container">
            {/* <img src="images/profile.png" alt className="header__img" /> */}
            <Link to="#" className="header__logo"><img src="images/splash.png" alt="No Logo" /></Link>
            <div className="header__search">
              <input type="search" placeholder="Search" className="header__input" />
              <i className="bx bx-search header__icon" />
            </div>
            <div className="header__toggle">
              <i className="bx bx-menu" id="header-toggle" />
            </div>
          </div>
        </header>
        {/*========== NAV ==========*/}
        <div className="nav" id="navbar">
          <nav className="nav__container">
            <div>
              <Link to="#" className="nav__link nav__logo">
                <span className="nav__logo-name">
                  <img src="images/splash.png" alt className="" />
                </span>
              </Link>
              <div className="nav__list">
                <div className="nav__items">
                  <h3 className="nav__subtitle">Dashboard</h3>
                  <Link to="/home" className={window.location.href.includes("home") ? "nav__link active" : "nav__link"}>
                    <i className="bx bx-home nav__icon" />
                    <span className="nav__name">Home</span>
                  </Link>
                  <Link to="/curriculum" className={window.location.href.includes("curriculum") ? "nav__link active" : "nav__link"}>
                    <i className="bx bx-book nav__icon" />
                    <span className="nav__name">Curriculum</span>
                  </Link>
                </div>
              </div>
            </div>
            <Link to="#" className="nav__link nav__logout">
              <i className="bx bx-log-out nav__icon" />
              <span className="nav__name" onClick={logout}>Log Out</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}
