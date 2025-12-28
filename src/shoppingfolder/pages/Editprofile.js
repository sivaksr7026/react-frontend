import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Editprofile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState({
    username: "",
    email: "",
    phone: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(
          `https://backend-nodejs-zeta.vercel.app/teachers/edit/${id}`,  
          {
            headers: {
              'x-auth-token' : token          
            }
          }
        );

        setData({
          username: res.data.username,   
          email: res.data.email,
          phone: res.data.phone
        });

      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      }
    };

    fetchTeacher();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `https://backend-nodejs-zeta.vercel.app/teachers/update/${id}`,  
        data,
        {
          headers: {
           'x-auth-token' : token       
          }
        }
      );

       toast.success("Profile updated successfully", {
      closeButton: false,
    });

    navigate("/profile");

  } catch (error) {
    
    if (error.response) {
      toast.error(error.response.data.message || "Email Already Exists", {
        closeButton: false,
      });
    }
  
    else {
      toast.warning(
        "Technical server issue. Please try again later",
        { closeButton: false }
      );
    }

    navigate(`/edit/${id}`);
  }
};

  return (
    <div className="register-container">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2>Edit account</h2>

        <input
          type="text"
          placeholder="Enter UserName"
          value={data.username}
          onChange={(e) =>
            setData({ ...data, username: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={data.email}
          onChange={(e) =>
            setData({ ...data, email: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Enter PhoneNumber"
          value={data.phone}
          onChange={(e) =>
            setData({ ...data, phone: e.target.value })
          }
        />

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Editprofile;
