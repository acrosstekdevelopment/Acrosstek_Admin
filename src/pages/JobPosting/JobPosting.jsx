import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/Hooks/axios";
import styles from "./JobPosting.module.scss";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

function JobPosting() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get("/jobfull/all");
        setJobs(response.data.data);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // DELETE JOB
  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axiosInstance.delete(`/jobfull/delete/${id}`);

      // Remove from UI
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete job");
    }
  };

  const editJob = (job) => {
  navigate(`/job/edit/${job._id}`);
};


  if (loading) return <p className={styles.centerText}>Loading jobs...</p>;
  if (error) return <p className={styles.errorText}>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.job}>
        <h1 className={styles.title}>Manage Job Postings</h1>
        <button onClick={() => navigate("/add-job")}>
          Add Jobs
        </button>
      </div>

      {jobs.length === 0 ? (
        <p>No job postings found.</p>
      ) : (
        <div className={styles.jobGrid}>
          {jobs.map((job) => (
            <div key={job._id} className={styles.jobCard}>
              <div className={styles.title2}>
                <h2 className={styles.jobTitle}>{job.title}</h2>
              <div className={styles.actions}>
                <button
                  className={styles.editBtn}
                  onClick={() => editJob(job)}
                >
                  < FaRegEdit/>
                </button>

                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteJob(job._id)}
                >
                  < MdDeleteOutline/>
                </button>
              </div>
              </div>
              <p className={styles.company}>
               <strong>Company: </strong>ACROSSTEK™
              </p>
              <p className={styles.location}><strong>Location: </strong>{job.location}</p>

              {/* ✅ FIXED SALARY RENDERING (NO REMOVALS) */}
              <p className={styles.salary}>
                {/* {job.salary?.currency} {job.salary?.amount} / {job.salary?.type} */}
                <strong>Pay: </strong>{job.salary}
              </p>

              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobPosting;
