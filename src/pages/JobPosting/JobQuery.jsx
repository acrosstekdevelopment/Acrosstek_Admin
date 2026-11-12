import { useEffect, useMemo, useState } from "react";
import axios from "../../components/Hooks/axios";
import styles from "./JobQuery.module.scss";

export default function JobQuery() {
  const [applicants, setApplicants] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await axios.get("/applicant/all");
      setApplicants(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplicant = async (id) => {
    if (!window.confirm("Delete this applicant?")) return;

    try {
      await axios.delete(`/applicant/delete/${id}`);
      setApplicants((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredApplicants = useMemo(() => {
    let list = [...applicants];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.email?.toLowerCase().includes(q) ||
          a.jobTitle?.toLowerCase().includes(q) ||
          a.company?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) =>
      sort === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    return list;
  }, [applicants, search, sort]);

  if (loading) {
    return <p className={styles.centerText}>Loading Applications...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.job}>
        <h1 className={styles.title}>Job Applications</h1>
      </div>

      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="Search name, email, job title, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className={styles.jobGrid}>
        {filteredApplicants.length === 0 ? (
          <p className={styles.centerText}>No Applications Found</p>
        ) : (
          filteredApplicants.map((applicant) => (
            <div key={applicant._id} className={styles.jobCard}>
              <div className={styles.title2}>
                <h3>{applicant.name}</h3>
                <span>
                  {new Date(applicant.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className={styles.company}>
                <strong>Job:</strong> {applicant.jobTitle || "N/A"}
              </p>

              <p className={styles.location}>
                <strong>Company:</strong> {applicant.company || "N/A"}
              </p>

              <div className={styles.actions}>
                <button
                  className={styles.viewBtn}
                  onClick={() => setSelectedApplicant(applicant)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedApplicant && (
        <div
          className={styles.overlay}
          onClick={() => setSelectedApplicant(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedApplicant.name}</h2>

            <p className={styles.modalJob}>
              {selectedApplicant.jobTitle} @ {selectedApplicant.company}
            </p>

            <div className={styles.modalGrid}>
              <p>
                <strong>Email:</strong> {selectedApplicant.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedApplicant.phone}
              </p>
              <p>
                <strong>Graduation Year:</strong>{" "}
                {selectedApplicant.graduationYear || "N/A"}
              </p>
              <p>
                <strong>Skills:</strong>{" "}
                {Array.isArray(selectedApplicant.skills)
                  ? selectedApplicant.skills.join(", ")
                  : "N/A"}
              </p>
              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(
                  selectedApplicant.createdAt
                ).toLocaleString()}
              </p>

              {selectedApplicant.linkedin && (
                <a
                  href={selectedApplicant.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  View LinkedIn Profile →
                </a>
              )}
            </div>

            <button
              className={styles.deleteBtn}
              onClick={() => {
                deleteApplicant(selectedApplicant._id);
                setSelectedApplicant(null);
              }}
            >
              Delete Applicant
            </button>

            <button
              className={styles.close}
              onClick={() => setSelectedApplicant(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
