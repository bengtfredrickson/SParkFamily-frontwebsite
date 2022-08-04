import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router';
export default function Side_Navigation() {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('auth_token');
        // localStorage.removeItem('auth_meta');
        navigate('/')
    }
    return (
        <>
            <div id="app">
                <div className="main-wrapper main-wrapper-1">
                    <div className="navbar-bg"></div>
                    <nav className="navbar navbar-expand-lg main-navbar">
                        <div className="form-inline mr-auto">
                            <ul className="navbar-nav mr-3">
                                {/* <li><a href="#" dataToggle="sidebar" className="nav-link nav-link-lg collapse-btn"><i
                                    className="fas fa-bars"></i></a></li> */}
                                <li>
                                    {/* <div className="search-group">
                                        <span className="nav-link nav-link-lg" id="search">
                                            <i className="fa fa-search" aria-hidden="true"></i>
                                        </span>
                                        <input type="text" className="search-control" placeholder="search" aria-label="search" aria-describedby="search" />
                                    </div> */}
                                </li>
                            </ul>
                        </div>
                        <ul className="navbar-nav navbar-right">

                            {/* 
                            <li className="dropdown dropdown-list-toggle"><a href="#" data-toggle="dropdown"
                                className="nav-link notification-toggle nav-link-lg beep"><i className="far fa-bell"></i></a>
                                <div className="dropdown-menu dropdown-list dropdown-menu-right">

                                    <div className="dropdown-list-content dropdown-list-icons">
                                        <a href="#" className="dropdown-item dropdown-item-unread">
                                            <span className="dropdown-item-icon bg-primary text-white">
                                                <i className="fas fa-shopping-cart"></i>
                                            </span>
                                            <span className="dropdown-item-desc">
                                                New Project
                                                <span className="time">3 Hours Ago</span>
                                            </span>
                                        </a>
                                    </div>
                                    <div className="dropdown-footer text-center">
                                        <a href="#">View All <i className="fas fa-chevron-right"></i></a>
                                    </div>
                                </div>
                            </li> */}


                            <li className="dropdown"><a href="#" data-toggle="dropdown"
                                className="nav-link dropdown-toggle nav-link-lg nav-link-user">
                                <img alt="image" src="images/user-profile.jpg" className="user-img-radious-style" />
                                <span className="d-sm-none d-lg-inline-block"></span></a>
                                <div className="dropdown-menu dropdown-menu-right">
                                    {/* <div className="dropdown-title">Hello Jessica Hill</div> */}

                                    {/* <a href="#" className="dropdown-item has-icon">
                                        <i className="fas fa-bolt"></i> Activities
                                    </a> */}
                                    {/* <a href="#" className="dropdown-item has-icon">
                                        <i className="fas fa-cog"></i> Settings
                                    </a> */}
                                    {/* <div className="dropdown-divider"></div> */}
                                    <a onClick={logout} className="dropdown-item has-icon text-danger" style={{ cursor: "pointer" }}>
                                        <i className="fas fa-sign-out-alt" ></i> Logout
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </nav>
                    <div className="main-sidebar sidebar-style-2">
                        <aside id="sidebar-wrapper">
                            <div className="sidebar-brand">
                                <Link to="/home">
                                    <img alt="image" src="images/logo.png" className="header-logo" />
                                    <span className="logo-name">Ethuta</span>
                                </Link>
                            </div>
                            <ul className="sidebar-menu">
                                <li className="menu-header">Main</li>
                                <li className="dropdown active">
                                    <Link to="/home" className="nav-link  "><i className="fas fa-home"></i><span>Dashboard</span></Link>

                                </li>
                                <li className="dropdown ">
                                    <Link to="/user_management" className="nav-link  "><i  className="fas fa-book-reader" aria-hidden="true"></i><span>User Management</span></Link>

                                </li>

                                <li className="dropdown ">
                                    <Link to="/coach_management" className="nav-link  "><i className="fa fa-male" aria-hidden="true"></i><span>Coach Management</span></Link>

                                </li>
                                <li className="dropdown ">
                                    <Link to="/course_management" className="nav-link  "><i className='fas fa-chalkboard-teacher' style={{ fontSize: "24px" }}></i><span>Course Management</span></Link>

                                </li>
                                <li className="dropdown ">
                                    <Link to="/category_management" className="nav-link  "><i className="fa fa-th-list" aria-hidden="true"></i><span>Category Management</span></Link>

                                </li>
                               
                                <li className="dropdown ">
                                    <Link to="/contact_us" className="nav-link  "><i className="fa fa-address-book" style={{ fontSize: "24px" }}></i><span>Contact Us</span></Link>
                                </li>
                               
                                <li className="dropdown ">
                                    <Link to="/need_help" className="nav-link  "><i className="fas fa-question" style={{ fontSize: "24px" }}></i><span>Need Help</span></Link>

                                </li>
                                <li className="dropdown ">
                                    <Link to="/admin_need_help" className="nav-link  "><i className="fas fa-user-shield" style={{ fontSize: "24px" }}></i><span>Admin Need Help</span></Link>
                                </li>
                               
                            </ul>
                        </aside>



                    </div>
                </div>
            </div>




        </>
    )
}
