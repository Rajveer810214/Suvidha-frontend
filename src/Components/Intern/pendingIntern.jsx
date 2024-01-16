import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Modal, Button } from 'react-bootstrap';

export default function InternTable() {
  const [interns, setInterns] = useState([]);
  const [internStatus, setInternStatus] = useState("all");
  const [chartData, setChartData] = useState([]);
  const [selectedInternId, setSelectedInternId] = useState(null);
  const [updatedIntern, setUpdatedIntern] = useState({
    name: "",
    email:"",
    phone:"",
    domain: "",
    startDate: "",
    endDate: "",
    status: "",
    
    // Add other fields as needed
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch chart data
        const chartResponse = await fetch(
          `https://suvidha-backend.onrender.com/api/user/internship/status-count`,
          {
            method: "GET",
            headers: {
              "auth-token": localStorage.getItem("authtoken"),
              Authorization: "Bearer yourToken",
              "Content-Type": "application/json",
            },
          }
        );

        if (!chartResponse.ok) {
          throw new Error(`HTTP error! Status: ${chartResponse.status}`);
        }

        const chartDataResponse = await chartResponse.json();
        setChartData(chartDataResponse.data);

        // Fetch interns data based on status
        const tableResponse = await fetch(
          `https://suvidha-backend.onrender.com/api/user/internship/${internStatus}`,
          {
            method: "GET",
            headers: {
              "auth-token": localStorage.getItem("authtoken"),
              Authorization: "Bearer yourToken",
              "Content-Type": "application/json",
            },
          }
        );

        if (!tableResponse.ok) {
          throw new Error(`HTTP error! Status: ${tableResponse.status}`);
        }

        const tableData = await tableResponse.json();
        setInterns(tableData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [internStatus]);

  const handleDelete = async (internId) => {
    try {
      const response = await fetch(
        `https://suvidha-backend.onrender.com/api/user/delete/${internId}`,
        {
          method: "DELETE",
          headers: {
            "auth-token": localStorage.getItem("authtoken"),
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update the interns state after deletion
      setInterns((prevInterns) =>
        prevInterns.filter((intern) => intern._id !== internId)
      );
    } catch (error) {
      console.error("Error deleting intern:", error);
    }
  };

  const handleEdit = (internId) => {
    const selectedIntern = interns.find((intern) => intern._id === internId);
    console.log(selectedIntern);
    if (selectedIntern) {
      setSelectedInternId(internId);
      setUpdatedIntern({
        name: selectedIntern.name,
        email:selectedIntern.user.email,
        phone:selectedIntern.user.phone,
        domain: selectedIntern.domain,
        startDate: selectedIntern.startDate,
        endDate: selectedIntern.endDate,
        status: selectedIntern.status,
        
        // Add other fields as needed
      });
      setShowModal(true); // Show the modal
    }
  };

  const handleUpdateIntern = async () => {
    try {
      const response = await fetch(
        `https://suvidha-backend.onrender.com/api/user/edit/${selectedInternId}`,
        {
          method: "PUT",
          headers: {
            "auth-token": localStorage.getItem("authtoken"),
            Authorization: "Bearer yourToken",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedIntern),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update the interns state after editing
      setInterns((prevInterns) =>
        prevInterns.map((intern) =>
          intern._id === selectedInternId
            ? { ...intern, ...updatedIntern }
            : intern
        )
      );

      // Close the edit modal or perform any other action
      setSelectedInternId(null);
      setShowModal(false); // Hide the modal
    } catch (error) {
      console.error("Error updating intern details:", error);
    }
  };

  const COLORS = ["#FF6384", "#36A2EB"];
  return (
    <div>
      <PieChart width={400} height={400} style={{ margin: "auto" }}>
        <Pie
          dataKey="count"
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
          animationBegin={0}
          animationDuration={1500}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name, props) => [value, " interns"]} />
        <Legend
          formatter={(value, entry) => (
            <span style={{ color: entry.color }}>
              {value === "pending" ? "Pending Requests" : "Accepted Requests"}{" "}
            </span>
          )}
        />
      </PieChart>

      <select onChange={(e) => setInternStatus(e.target.value)}>
        <option value="all">All Internships</option>
        <option value="pending">Pending Internships</option>
        <option value="accepted">Accepted Internships</option>
      </select>
      {internStatus !== "all" && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="intern table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interns.map((intern) => (
                <TableRow
                  key={intern._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{intern.name}</TableCell>
                  <TableCell>{intern.user.email}</TableCell>
                  <TableCell>{intern.user.phone}</TableCell>
                  <TableCell>{intern.domain}</TableCell>
                  <TableCell>{intern.startDate}</TableCell>
                  <TableCell>{intern.endDate}</TableCell>
                  <TableCell>{intern.status}</TableCell>

                  <TableCell align="right" >
                    <EditIcon
                      style={{ cursor: "pointer", marginRight: "8px" }}
                      onClick={() => handleEdit(intern._id)}
                    />
                    <DeleteIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(intern._id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for editing intern details */}
      {selectedInternId && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Intern Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={updatedIntern.name}
                  onChange={(e) =>
                    setUpdatedIntern({
                      ...updatedIntern,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  className="form-control"
                  value={updatedIntern.email}
                  onChange={(e) =>
                    setUpdatedIntern({
                      ...updatedIntern,
                      email: e.target.value,
                    })
                  }
                />
              </div> 
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={updatedIntern.phone}
                  onChange={(e) =>
                    setUpdatedIntern({
                      ...updatedIntern,
                      phone: e.target.value,
                    })
                  }
                />
              </div> 
              <div className="form-group">
                <label>Domain</label>
                <input
                  type="text"
                  className="form-control"
                  value={updatedIntern.domain}
                  onChange={(e) =>
                    setUpdatedIntern({
                      ...updatedIntern,
                      domain: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="text"
                  className="form-control"
                  value={updatedIntern.startDate}
                  onChange={(e) =>
                    setUpdatedIntern({
                      ...updatedIntern,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="text"
                  className="form-control"
                  value={updatedIntern.endDate}
                  onChange={(e) =>
                    setUpdatedIntern({
                      ...updatedIntern,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <input
                  type="text"
                  className="form-control"
                  value={updatedIntern.status}
                  onChange={(e) =>
                    setUpdatedIntern({
                      ...updatedIntern,
                      status: e.target.value,
                    })
                  }
                />
              </div>
                         </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdateIntern}>
              Update Intern
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
