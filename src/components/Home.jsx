import React, { useEffect,useState } from "react";
import Side_Navigation from "./Side_Navigation";
import "../components/Helper/Home.css"
import { get_All_Users ,get_coach, get_course} from "../services/web/webServices";
export default function Home() {
  const [getUser,setUser]=useState([]);
  const [getCoach,setCoach]=useState([]);
  const [getCourse,setCourse]=useState([]);
  useEffect(()=>{
       get_All_Users().then((res)=>{

             setUser(res.data.response?.length);
       }).catch((err)=>{
         console.log(err)
       })

       get_coach().then((res)=>{
         setCoach(res.data.response?.length);
       }).catch((err)=>{
         console.log(err);
       })
       get_course().then((res)=>{
        setCourse(res.data.response?.length);
       }).catch((err)=>{
         console.log(err);
       })
  },[])
  return (
    <>
      {/* <?php include("side-navigation.php");?>
      <!-- Main Content --> */}
      
      <Side_Navigation />
      <div className="main-content5">
      <div className="cardAnimation1">
        <div className="content">Total User</div>
        <div className="item">{getUser}</div>
      </div>

      <div className="cardAnimation1">
        <div className="content">Total Coach</div>
        <div className="item">{getCoach}</div>
      </div>

      <div className="cardAnimation1">
        <div className="content">Total Courses</div>
        <div className="item">{getCourse}</div>
      </div>
      </div>
      <footer className="main-footer">
        <div className="footer-left">
          Copyright &copy; 2021 <div className="bullet"></div> Design By{" "}
          <a href="https://www.webmobril.com/">Webmobril</a>
        </div>
        <div className="footer-right"></div>
      </footer>
    </>
  );
}
