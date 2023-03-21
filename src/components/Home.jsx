import React, { useEffect, useState } from "react";
import Side_Navigation from "./Side_Navigation";
import "../components/Helper/Home.css"
import { get_all_curriculums, } from "../services/web/webServices";
import Footer from "./Footer";
export default function Home() {
  const [getCurriculum, setCurriculum] = useState([]);
  useEffect(() => {
    get_all_curriculums().then((res) => {

      setCurriculum(res.data.response?.length);
    }).catch((err) => {
      console.log(err)
    })
  }, [])
  return (
    <>
      {/* <?php include("side-navigation.php");?>
      <!-- Main Content --> */}


      <Side_Navigation />
      <main>  <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">

        <div className="app-main">

          {/* <div className="app-main__outer"> */}
          <div className="app-main__inner">
            <div className="app-page-title">
              <div className="page-title-wrapper">
                <div className="page-title-heading">
                  <div>Analytics Dashboard
                    <div className="page-title-subheading">This is an example dashboard created using build-in elements and components.
                    </div>
                  </div>
                </div>
                <div className="page-title-actions">
                  <button type="button" data-toggle="tooltip" title="Example Tooltip" data-placement="bottom" className="btn-shadow mr-3 btn btn-dark">
                    <i className="fa fa-star" />
                  </button>
                  <div className="d-inline-block dropdown">
                    <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="btn-shadow dropdown-toggle btn btn-info">
                      <span className="btn-icon-wrapper pr-2 opacity-7">
                        <i className="fa fa-business-time fa-w-20" />
                      </span>
                      Buttons
                    </button>
                    <div tabIndex={-1} role="menu" aria-hidden="true" className="dropdown-menu dropdown-menu-right">
                      <ul className="nav flex-column">
                        <li className="nav-item">
                          <a href="javascript:void(0);" className="nav-link">
                            <i className="nav-link-icon lnr-inbox" />
                            <span>
                              Inbox
                            </span>
                            <div className="ml-auto badge badge-pill badge-secondary">86</div>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="javascript:void(0);" className="nav-link">
                            <i className="nav-link-icon lnr-book" />
                            <span>
                              Book
                            </span>
                            <div className="ml-auto badge badge-pill badge-danger">5</div>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="javascript:void(0);" className="nav-link">
                            <i className="nav-link-icon lnr-picture" />
                            <span>
                              Picture
                            </span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a disabled href="javascript:void(0);" className="nav-link disabled">
                            <i className="nav-link-icon lnr-file-empty" />
                            <span>
                              File Disabled
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>  </div>
            </div>            <div className="row">
              <div className="col-md-6 col-xl-4">
                <div className="card mb-3 widget-content bg-midnight-bloom">
                  <div className="widget-content-wrapper text-white">
                    <div className="widget-content-left">
                      <div className="widget-heading">Total Orders</div>
                      <div className="widget-subheading">Last year expenses</div>
                    </div>
                    <div className="widget-content-right">
                      <div className="widget-numbers text-white"><span>1896</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xl-4">
                <div className="card mb-3 widget-content bg-arielle-smile">
                  <div className="widget-content-wrapper text-white">
                    <div className="widget-content-left">
                      <div className="widget-heading">Clients</div>
                      <div className="widget-subheading">Total Clients Profit</div>
                    </div>
                    <div className="widget-content-right">
                      <div className="widget-numbers text-white"><span>$ 568</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xl-4">
                <div className="card mb-3 widget-content bg-grow-early">
                  <div className="widget-content-wrapper text-white">
                    <div className="widget-content-left">
                      <div className="widget-heading">Followers</div>
                      <div className="widget-subheading">People Interested</div>
                    </div>
                    <div className="widget-content-right">
                      <div className="widget-numbers text-white"><span>46%</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-xl-none d-lg-block col-md-6 col-xl-4">
                <div className="card mb-3 widget-content bg-premium-dark">
                  <div className="widget-content-wrapper text-white">
                    <div className="widget-content-left">
                      <div className="widget-heading">Products Sold</div>
                      <div className="widget-subheading">Revenue streams</div>
                    </div>
                    <div className="widget-content-right">
                      <div className="widget-numbers text-warning"><span>$14M</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-xl-4">
                <div className="card mb-3 widget-content">
                  <div className="widget-content-outer">
                    <div className="widget-content-wrapper">
                      <div className="widget-content-left">
                        <div className="widget-heading">Total Orders</div>
                        <div className="widget-subheading">Last year expenses</div>
                      </div>
                      <div className="widget-content-right">
                        <div className="widget-numbers text-success">1896</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xl-4">
                <div className="card mb-3 widget-content">
                  <div className="widget-content-outer">
                    <div className="widget-content-wrapper">
                      <div className="widget-content-left">
                        <div className="widget-heading">Products Sold</div>
                        <div className="widget-subheading">Revenue streams</div>
                      </div>
                      <div className="widget-content-right">
                        <div className="widget-numbers text-warning">$3M</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xl-4">
                <div className="card mb-3 widget-content">
                  <div className="widget-content-outer">
                    <div className="widget-content-wrapper">
                      <div className="widget-content-left">
                        <div className="widget-heading">Followers</div>
                        <div className="widget-subheading">People Interested</div>
                      </div>
                      <div className="widget-content-right">
                        <div className="widget-numbers text-danger">45,9%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-xl-none d-lg-block col-md-6 col-xl-4">
                <div className="card mb-3 widget-content">
                  <div className="widget-content-outer">
                    <div className="widget-content-wrapper">
                      <div className="widget-content-left">
                        <div className="widget-heading">Income</div>
                        <div className="widget-subheading">Expected totals</div>
                      </div>
                      <div className="widget-content-right">
                        <div className="widget-numbers text-focus">$147</div>
                      </div>
                    </div>
                    <div className="widget-progress-wrapper">
                      <div className="progress-bar-sm progress-bar-animated-alt progress">
                        <div className="progress-bar bg-info" role="progressbar" aria-valuenow={54} aria-valuemin={0} aria-valuemax={100} style={{ width: '54%' }} />
                      </div>
                      <div className="progress-sub-label">
                        <div className="sub-label-left">Expenses</div>
                        <div className="sub-label-right">100%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="main-card mb-3 card">
                  <div className="card-header">Active Users
                    <div className="btn-actions-pane-right">
                      <div role="group" className="btn-group-sm btn-group">
                        <button className="active btn btn-focus">Last Week</button>
                        <button className="btn btn-focus">All Month</button>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="align-middle mb-0 table table-borderless table-striped table-hover">
                      <thead>
                        <tr>
                          <th className="text-center">#</th>
                          <th>Name</th>
                          <th className="text-center">City</th>
                          <th className="text-center">Status</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-center text-muted">#345</td>
                          <td>
                            <div className="widget-content p-0">
                              <div className="widget-content-wrapper">
                                <div className="widget-content-left mr-3">
                                  <div className="widget-content-left">
                                    <img width={40} className="rounded-circle" src="assets/images/avatars/4.jpg" alt />
                                  </div>
                                </div>
                                <div className="widget-content-left flex2">
                                  <div className="widget-heading">John Doe</div>
                                  <div className="widget-subheading opacity-7">Web Developer</div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">Madrid</td>
                          <td className="text-center">
                            <div className="badge badge-warning">Pending</div>
                          </td>
                          <td className="text-center">
                            <button type="button" id="PopoverCustomT-1" className="btn btn-primary btn-sm">Details</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-center text-muted">#347</td>
                          <td>
                            <div className="widget-content p-0">
                              <div className="widget-content-wrapper">
                                <div className="widget-content-left mr-3">
                                  <div className="widget-content-left">
                                    <img width={40} className="rounded-circle" src="assets/images/avatars/3.jpg" alt />
                                  </div>
                                </div>
                                <div className="widget-content-left flex2">
                                  <div className="widget-heading">Ruben Tillman</div>
                                  <div className="widget-subheading opacity-7">Etiam sit amet orci eget</div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">Berlin</td>
                          <td className="text-center">
                            <div className="badge badge-success">Completed</div>
                          </td>
                          <td className="text-center">
                            <button type="button" id="PopoverCustomT-2" className="btn btn-primary btn-sm">Details</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-center text-muted">#321</td>
                          <td>
                            <div className="widget-content p-0">
                              <div className="widget-content-wrapper">
                                <div className="widget-content-left mr-3">
                                  <div className="widget-content-left">
                                    <img width={40} className="rounded-circle" src="assets/images/avatars/2.jpg" alt />
                                  </div>
                                </div>
                                <div className="widget-content-left flex2">
                                  <div className="widget-heading">Elliot Huber</div>
                                  <div className="widget-subheading opacity-7">Lorem ipsum dolor sic</div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">London</td>
                          <td className="text-center">
                            <div className="badge badge-danger">In Progress</div>
                          </td>
                          <td className="text-center">
                            <button type="button" id="PopoverCustomT-3" className="btn btn-primary btn-sm">Details</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-center text-muted">#55</td>
                          <td>
                            <div className="widget-content p-0">
                              <div className="widget-content-wrapper">
                                <div className="widget-content-left mr-3">
                                  <div className="widget-content-left">
                                    <img width={40} className="rounded-circle" src="assets/images/avatars/1.jpg" alt /></div>
                                </div>
                                <div className="widget-content-left flex2">
                                  <div className="widget-heading">Vinnie Wagstaff</div>
                                  <div className="widget-subheading opacity-7">UI Designer</div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">Amsterdam</td>
                          <td className="text-center">
                            <div className="badge badge-info">On Hold</div>
                          </td>
                          <td className="text-center">
                            <button type="button" id="PopoverCustomT-4" className="btn btn-primary btn-sm">Details</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="d-block text-center card-footer">
                    <button className="mr-2 btn-icon btn-icon-only btn btn-outline-danger"><i className="pe-7s-trash btn-icon-wrapper"> </i></button>
                    <button className="btn-wide btn btn-success">Save</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-lg-3">
                <div className="card-shadow-danger mb-3 widget-chart widget-chart2 text-left card">
                  <div className="widget-content">
                    <div className="widget-content-outer">
                      <div className="widget-content-wrapper">
                        <div className="widget-content-left pr-2 fsize-1">
                          <div className="widget-numbers mt-0 fsize-3 text-danger">71%</div>
                        </div>
                        <div className="widget-content-right w-100">
                          <div className="progress-bar-xs progress">
                            <div className="progress-bar bg-danger" role="progressbar" aria-valuenow={71} aria-valuemin={0} aria-valuemax={100} style={{ width: '71%' }} />
                          </div>
                        </div>
                      </div>
                      <div className="widget-content-left fsize-1">
                        <div className="text-muted opacity-6">Income Target</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card-shadow-success mb-3 widget-chart widget-chart2 text-left card">
                  <div className="widget-content">
                    <div className="widget-content-outer">
                      <div className="widget-content-wrapper">
                        <div className="widget-content-left pr-2 fsize-1">
                          <div className="widget-numbers mt-0 fsize-3 text-success">54%</div>
                        </div>
                        <div className="widget-content-right w-100">
                          <div className="progress-bar-xs progress">
                            <div className="progress-bar bg-success" role="progressbar" aria-valuenow={54} aria-valuemin={0} aria-valuemax={100} style={{ width: '54%' }} />
                          </div>
                        </div>
                      </div>
                      <div className="widget-content-left fsize-1">
                        <div className="text-muted opacity-6">Expenses Target</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card-shadow-warning mb-3 widget-chart widget-chart2 text-left card">
                  <div className="widget-content">
                    <div className="widget-content-outer">
                      <div className="widget-content-wrapper">
                        <div className="widget-content-left pr-2 fsize-1">
                          <div className="widget-numbers mt-0 fsize-3 text-warning">32%</div>
                        </div>
                        <div className="widget-content-right w-100">
                          <div className="progress-bar-xs progress">
                            <div className="progress-bar bg-warning" role="progressbar" aria-valuenow={32} aria-valuemin={0} aria-valuemax={100} style={{ width: '32%' }} />
                          </div>
                        </div>
                      </div>
                      <div className="widget-content-left fsize-1">
                        <div className="text-muted opacity-6">Spendings Target</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card-shadow-info mb-3 widget-chart widget-chart2 text-left card">
                  <div className="widget-content">
                    <div className="widget-content-outer">
                      <div className="widget-content-wrapper">
                        <div className="widget-content-left pr-2 fsize-1">
                          <div className="widget-numbers mt-0 fsize-3 text-info">89%</div>
                        </div>
                        <div className="widget-content-right w-100">
                          <div className="progress-bar-xs progress">
                            <div className="progress-bar bg-info" role="progressbar" aria-valuenow={89} aria-valuemin={0} aria-valuemax={100} style={{ width: '89%' }} />
                          </div>
                        </div>
                      </div>
                      <div className="widget-content-left fsize-1">
                        <div className="text-muted opacity-6">Totals Target</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>

      </main>


      <Footer />

    </>
  );
}
