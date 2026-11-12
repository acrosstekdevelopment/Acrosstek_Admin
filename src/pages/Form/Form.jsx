import React, { useEffect, useState, useMemo } from "react";
import axios from "../../components/Hooks/axios";
import Loading from "../../components/Hooks/Loading";
import styles from "./Form.module.scss";

function Form() {
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [error, setError] = useState("");
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchQuotes = () => {
    setLoading(true);
    setError("");

    axios
      .get("/quote")
      .then(({ data }) => {
        if (data.status) {
          setQuotes(data.data);
          console.log(data.data);
        } else {
          setError("Failed to fetch quotes");
        }
      })
      .catch(() => setError("Something went wrong"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quote?")) return;

    try {
      await axios.delete(`/quote/${id}`);
      setQuotes((prev) => prev.filter((q) => q._id !== id));
      setSelectedQuote(null);
    } catch {
      alert("Failed to delete quote");
    }
  };

  const openModal = (quote) => {
    setSelectedQuote(quote);
  };

  const closeModal = () => {
    setSelectedQuote(null);
  };

  // Modern Filter Logic
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) =>
      q.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quotes, searchTerm]);

  const formatPhone = (quote) => {
    if (!quote) return "N/A";
    const countryCode = quote.countryCode || "";
    const phone = quote.phone || "";
    return countryCode && phone ? `${countryCode} ${phone}` : phone || "N/A";
  };

  if (loading) return <Loading />;
  if (error) return <div className={styles.errorContainer}><p className={styles.error}>{error}</p></div>;

  return (
    <div className={styles.quotesWrapper}>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <div className={styles.titleBox}>
            <h2>Quotes Management</h2>
            <span className={styles.badge}>{quotes.length} Total</span>
          </div>
          
          <div className={styles.controls}>
            <div className={styles.searchBar}>
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className={styles.refreshBtn} onClick={fetchQuotes}>
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {filteredQuotes.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No quotes matching your search</p>
          </div>
        ) : (
          <div className={styles.quotesGrid}>
            {filteredQuotes.map((item) => (
              <div 
                className={styles.quoteCard} 
                key={item._id}
                onClick={() => openModal(item)}
              >
                <div className={styles.cardHeader}>
                  <h4>{item.name}</h4>
                  {/* <div className={styles.statusDot}></div> */}
                </div>

                <div className={styles.cardContent}>
                  <p><strong>Email:</strong> {item.email}</p>
                  <p><strong>Budget:</strong> <span className={styles.budgetTag}>{item.budget || 'Not specified'}</span></p>
                </div>
                
                <div className={styles.cardFooter}>
                  <small>{new Date(item.createdAt).toLocaleDateString()}</small>
                  <button className={styles.viewBtn}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {selectedQuote && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <h3>{selectedQuote.name}</h3>
                <p>Lead ID: {selectedQuote._id.slice(-6).toUpperCase()}</p>
              </div>
              <button className={styles.closeBtn} onClick={closeModal}>×</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.infoGrid}>
                <div className={styles.infoBox}>
                  <label>Email Address</label>
                  <span>{selectedQuote.email}</span>
                </div>
                <div className={styles.infoBox}>
                  <label>Phone Number</label>
                  <span>{formatPhone(selectedQuote)}</span>
                </div>
                <div className={styles.infoBox}>
                  <label>Country</label>
                  <span>{selectedQuote.country || 'N/A'}</span>
                </div>
                <div className={styles.infoBox}>
                  <label>Budget Range</label>
                  <span className={styles.highlightText}>{selectedQuote.budget || 'Not specified'}</span>
                </div>
              </div>

              {selectedQuote.achieve && (
                <div className={styles.section}>
                  <h4>Business Goals</h4>
                  <p>{selectedQuote.achieve}</p>
                </div>
              )}

              {selectedQuote.description && (
                <div className={styles.section}>
                  <h4>Project Description</h4>
                  <p>{selectedQuote.description}</p>
                </div>
              )}

              <div className={styles.timestamp}>
                <small>Record Created: {new Date(selectedQuote.createdAt).toLocaleString()}</small>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={styles.deleteModalBtn}
                onClick={() => handleDelete(selectedQuote._id)}
              >
                Delete Record
              </button>
              <button className={styles.cancelBtn} onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Form;