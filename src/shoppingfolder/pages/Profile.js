import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token"); 
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios.get("https://backend-nodejs-zeta.vercel.app/teachers/myprofile", {
      headers: {
         'x-auth-token' : token  
      }
    })
    .then((res) => setUser(res.data))
    .catch(() => {
      localStorage.removeItem("token");
      navigate("/login");
    });
  }, [navigate, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;

    try {
      await axios.delete(
        `https://backend-nodejs-zeta.vercel.app/teachers/delete/${id}`,
        {
          headers: {
            'x-auth-token' : token  
          }
        }
      );

      toast.success("Profile deleted successfully", {
        closeButton: false
      });

      localStorage.removeItem("token");
      navigate("/login");

    } catch (error) {
      toast.error("Profile delete failed", {
        closeButton: false
      });
    }
  };

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};


  if (!user) return <h3>No User Login</h3>;

  return (
    <div className="container">
      <h2>User Profile</h2>
<button className="btn create-btn"
  onClick={handleLogout}

>
  Logout
</button>

      <table class="crud-table">
        <thead>
          <tr>
            <th>UserName</th>
            <th>Email</th>
            <th>PhoneNumber</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>
              <Link to={`/edit/${user._id}`}>
                <button className="btn update-btn">Edit</button>
              </Link>

              <button
                className="btn delete-btn"
                onClick={() => handleDelete(user._id)} 
              >
                Delete
              </button>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
