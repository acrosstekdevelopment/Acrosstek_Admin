import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./JobAdd.module.scss";
import axios from "../../components/Hooks/axios";
import { useParams, useNavigate } from "react-router-dom";

function JobAdd() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    salary: "",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    company: "ACROSSTEK™",
    location: "",
    employmentType: "Permanent",
    description: "",
    skills: "",
    language: "English",
    isTrending: false,
    salaryDisclosed: true, // ✅ ADDED
    // ✅ ADDED: Experience fields
    experienceYears: "",
    experienceMin: "",
    experienceMax: "",
  });

  const [expect, setExpect] = useState([]);
  const [doList, setDoList] = useState([]);
  const [bring, setBring] = useState([]);
  const [compensation, setCompensation] = useState([]);
  const [apply, setApply] = useState([]);
  const [loading, setLoading] = useState(false);

  const expectRef = useRef(null);
  const doRef = useRef(null);
  const bringRef = useRef(null);
  const compensationRef = useRef(null);
  const applyRef = useRef(null);

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  };

  useEffect(() => {
    if (!isEdit) return;

    const fetchJob = async () => {
      try {
        const res = await axios.get(`/jobfull/job-${id}`);
        const job = res.data.data;

        setForm({
          title: job.title || "",
          salary: job.salary || "",
          salaryMin: job.salaryMin || "",
          salaryMax: job.salaryMax || "",
          currency: job.currency || "USD",
          company: job.company || "",
          location: job.location || "",
          employmentType: job.employmentType || "Permanent",
          description: job.description || "",
          skills: job.skills?.join(", ") || "",
          language: job.language || "English",
          isTrending: job.isTrending || false,
          salaryDisclosed: job.salaryDisclosed !== false,
          // ✅ ADDED: Load experience data
          experienceYears: job.experienceYears || "",
          experienceMin: job.experienceMin || "",
          experienceMax: job.experienceMax || "",
        });

        setExpect(job.expect || []);
        setDoList(job.do || []);
        setBring(job.bring || []);
        setCompensation(job.compensation || []);
        setApply(job.apply || []);
      } catch (err) {
        alert("Failed to load job data");
      }
    };

    fetchJob();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addQuillItem = (list, setList, ref) => {
    const editor = ref.current.getEditor();
    const html = editor.root.innerHTML.trim();
    const text = editor.getText().trim();

    if (text && text !== "" && html !== "<p><br></p>") {
      setList([...list, html]);
      editor.setText("");
    }
  };

  const removeItem = (list, setList, index) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.title || !form.company || !form.location || !form.description) {
      alert("Please fill all required fields!");
      setLoading(false);
      return;
    }

    if (form.salaryDisclosed) {
      if (!form.salary) {
        alert("Please provide salary information or mark it as not disclosed!");
        setLoading(false);
        return;
      }
    }

    // ✅ ADDED: Validate experience fields
    if (form.experienceMin && form.experienceMax) {
      if (Number(form.experienceMin) > Number(form.experienceMax)) {
        alert("Minimum experience cannot be greater than maximum experience!");
        setLoading(false);
        return;
      }
    }

    const payload = {
      ...(isEdit && { id }),
      title: form.title,
      salary: form.salaryDisclosed ? form.salary : undefined,
      salaryMin: form.salaryDisclosed ? Number(form.salaryMin) || 0 : undefined,
      salaryMax: form.salaryDisclosed ? Number(form.salaryMax) || 0 : undefined,
      currency: form.salaryDisclosed ? form.currency : undefined,
      company: form.company,
      location: form.location,
      employmentType: form.employmentType,
      description: form.description,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      expect,
      do: doList,
      bring,
      compensation,
      apply,
      language: form.language,
      isTrending: form.isTrending,
      salaryDisclosed: form.salaryDisclosed,
      // ✅ ADDED: Include experience data
      experienceYears: form.experienceYears || undefined,
      experienceMin: form.experienceMin ? Number(form.experienceMin) : undefined,
      experienceMax: form.experienceMax ? Number(form.experienceMax) : undefined,
    };

    try {
      if (isEdit) {
        await axios.post("/jobfull/update", payload);
        alert("Job updated successfully!");
      } else {
        await axios.post("/jobfull/create", payload);
        alert("Job added successfully!");
      }

      navigate("/nextJobs");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Error saving job!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{isEdit ? "Update Job" : "Add New Job"}</h1>
          <p>Fill in the details to create a new job posting</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* Basic Information */}
          <section className={styles.section}>
            <h2>Basic Information</h2>
            
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Job Title <span>*</span></label>
                <input 
                  name="title" 
                  placeholder="e.g. Senior Full Stack Developer" 
                  value={form.title} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Company Name <span>*</span></label>
                <input 
                  name="company" 
                  placeholder="e.g. TechNova Inc" 
                  value={form.company} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Location <span>*</span></label>
                <select name="location" value={form.location} onChange={handleChange} required>
                  <option value="">Select Location</option>
                  <option value="Remote - USA">Remote - USA</option>
                  <option value="Remote - India">Remote - India</option>
                  <option value="Remote - Global">Remote - Global</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Noida">Noida</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Employment Type</label>
                <select name="employmentType" value={form.employmentType} onChange={handleChange}>
                  <option value="Permanent">Permanent</option>
                  <option value="C2H">Contract</option>
                  <option value="OnDemand">Freelance/ On Demand</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Language</label>
                <select name="language" value={form.language} onChange={handleChange}>
                  <option value="English">English</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>
            </div>

            <div className={styles.checkboxField}>
              <input 
                type="checkbox" 
                id="isTrending" 
                name="isTrending" 
                checked={form.isTrending} 
                onChange={handleChange}
              />
              <label htmlFor="isTrending">Mark as Trending Job</label>
            </div>
          </section>

          {/* ✅ ADDED: Experience Section */}
          <section className={styles.section}>
            <h2>Experience Requirements</h2>
            
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Experience Range (Display)</label>
                <input 
                  name="experienceYears" 
                  placeholder="e.g. 3-5 years or 5+ years" 
                  value={form.experienceYears} 
                  onChange={handleChange}
                />
                <small>This will be displayed on the job listing (e.g., "3-5 years", "5+ years")</small>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Minimum Experience (Years)</label>
                <input 
                  type="number" 
                  name="experienceMin" 
                  placeholder="e.g. 3" 
                  min="0"
                  value={form.experienceMin} 
                  onChange={handleChange}
                />
                <small>Leave empty if no minimum requirement</small>
              </div>

              <div className={styles.field}>
                <label>Maximum Experience (Years)</label>
                <input 
                  type="number" 
                  name="experienceMax" 
                  placeholder="e.g. 5" 
                  min="0"
                  value={form.experienceMax} 
                  onChange={handleChange}
                />
                <small>Leave empty for "X+ years" positions</small>
              </div>
            </div>

            {form.experienceMin && form.experienceMax && (
              <div style={{ 
                padding: '10px', 
                backgroundColor: '#f0f9ff', 
                borderRadius: '5px', 
                marginTop: '10px',
                border: '1px solid #bfdbfe'
              }}>
                <p style={{ margin: 0, color: '#1e40af', fontSize: '14px' }}>
                  📊 Experience Range: {form.experienceMin}-{form.experienceMax} years
                </p>
              </div>
            )}
          </section>

          {/* Salary Information */}
          <section className={styles.section}>
            <h2>Salary Information</h2>
            
            <div className={styles.checkboxField}>
              <input 
                type="checkbox" 
                id="salaryDisclosed" 
                name="salaryDisclosed" 
                checked={form.salaryDisclosed} 
                onChange={handleChange}
              />
              <label htmlFor="salaryDisclosed">Disclose Salary Information</label>
              <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                Uncheck this if you want to hide salary details and show "Not Disclosed"
              </small>
            </div>

            {form.salaryDisclosed && (
              <>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Salary Range (Display) <span>*</span></label>
                    <input 
                      name="salary" 
                      placeholder="e.g. $120,000 - $150,000" 
                      value={form.salary} 
                      onChange={handleChange}
                      required={form.salaryDisclosed}
                    />
                    <small>This will be displayed on the job listing</small>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Minimum Salary</label>
                    <input 
                      type="number" 
                      name="salaryMin" 
                      placeholder="120000" 
                      value={form.salaryMin} 
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Maximum Salary</label>
                    <input 
                      type="number" 
                      name="salaryMax" 
                      placeholder="150000" 
                      value={form.salaryMax} 
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Currency</label>
                    <select name="currency" value={form.currency} onChange={handleChange}>
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {!form.salaryDisclosed && (
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '5px', 
                marginTop: '10px' 
              }}>
                <p style={{ margin: 0, color: '#666' }}>
                  💼 Salary will be shown as "Not Disclosed" on the job listing
                </p>
              </div>
            )}
          </section>

          {/* Job Description */}
          <section className={styles.section}>
            <h2>Job Description</h2>
            
            <div className={styles.field}>
              <label>Description <span>*</span></label>
              <textarea
                name="description"
                placeholder="Provide a detailed job description..."
                value={form.description}
                onChange={handleChange}
                rows={6}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Required Skills</label>
              <input
                name="skills"
                placeholder="React, Next.js, Node.js, MongoDB, AWS (comma separated)"
                value={form.skills}
                onChange={handleChange}
              />
              <small>Enter skills separated by commas</small>
            </div>
          </section>

          {/* Expectations */}
          <section className={styles.section}>
            <h2>What You'll Do</h2>
            <div className={styles.quillSection}>
              <ReactQuill 
                ref={expectRef} 
                theme="snow" 
                placeholder="Enter an expectation (e.g., 5+ years of professional experience...)"
                modules={quillModules}
              />
              <button 
                type="button" 
                className={styles.addBtn}
                onClick={() => addQuillItem(expect, setExpect, expectRef)}
              >
                + Add Expectation
              </button>
            </div>
            
            {expect.length > 0 && (
              <div className={styles.itemList}>
                {expect.map((item, i) => (
                  <div key={i} className={styles.listItem}>
                    <span dangerouslySetInnerHTML={{ __html: `${i + 1}. ${item}` }} />
                    <button 
                      type="button" 
                      className={styles.removeBtn}
                      onClick={() => removeItem(expect, setExpect, i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Responsibilities */}
          <section className={styles.section}>
            <h2>What We're Looking For</h2>
            <div className={styles.quillSection}>
              <ReactQuill 
                ref={doRef} 
                theme="snow" 
                placeholder="Enter a responsibility (e.g., Design and develop scalable web applications...)"
                modules={quillModules}
              />
              <button 
                type="button" 
                className={styles.addBtn}
                onClick={() => addQuillItem(doList, setDoList, doRef)}
              >
                + Add Responsibility
              </button>
            </div>
            
            {doList.length > 0 && (
              <div className={styles.itemList}>
                {doList.map((item, i) => (
                  <div key={i} className={styles.listItem}>
                    <span dangerouslySetInnerHTML={{ __html: `${i + 1}. ${item}` }} />
                    <button 
                      type="button" 
                      className={styles.removeBtn}
                      onClick={() => removeItem(doList, setDoList, i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Requirements */}
          <section className={styles.section}>
            <h2>Nice to have</h2>
            <div className={styles.quillSection}>
              <ReactQuill 
                ref={bringRef} 
                theme="snow" 
                placeholder="Enter a requirement (e.g., Hands-on experience with React and Node.js...)"
                modules={quillModules}
              />
              <button 
                type="button" 
                className={styles.addBtn}
                onClick={() => addQuillItem(bring, setBring, bringRef)}
              >
                + Add Requirement
              </button>
            </div>
            
            {bring.length > 0 && (
              <div className={styles.itemList}>
                {bring.map((item, i) => (
                  <div key={i} className={styles.listItem}>
                    <span dangerouslySetInnerHTML={{ __html: `${i + 1}. ${item}` }} />
                    <button 
                      type="button" 
                      className={styles.removeBtn}
                      onClick={() => removeItem(bring, setBring, i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Compensation */}
          <section className={styles.section}>
            <h2>Why work with us ?</h2>
            <div className={styles.quillSection}>
              <ReactQuill 
                ref={compensationRef} 
                theme="snow" 
                placeholder="Enter a benefit (e.g., Competitive salary, Health insurance...)"
                modules={quillModules}
              />
              <button 
                type="button" 
                className={styles.addBtn}
                onClick={() => addQuillItem(compensation, setCompensation, compensationRef)}
              >
                + Add Benefit
              </button>
            </div>
            
            {compensation.length > 0 && (
              <div className={styles.itemList}>
                {compensation.map((item, i) => (
                  <div key={i} className={styles.listItem}>
                    <span dangerouslySetInnerHTML={{ __html: `${i + 1}. ${item}` }} />
                    <button 
                      type="button" 
                      className={styles.removeBtn}
                      onClick={() => removeItem(compensation, setCompensation, i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Application Instructions */}
          <section className={styles.section}>
            <h2>How to Apply</h2>
            <div className={styles.quillSection}>
              <ReactQuill 
                ref={applyRef} 
                theme="snow" 
                placeholder="Enter application instruction (e.g., Submit your updated resume...)"
                modules={quillModules}
              />
              <button 
                type="button" 
                className={styles.addBtn}
                onClick={() => addQuillItem(apply, setApply, applyRef)}
              >
                + Add Instruction
              </button>
            </div>
            
            {apply.length > 0 && (
              <div className={styles.itemList}>
                {apply.map((item, i) => (
                  <div key={i} className={styles.listItem}>
                    <span dangerouslySetInnerHTML={{ __html: `${i + 1}. ${item}` }} />
                    <button 
                      type="button" 
                      className={styles.removeBtn}
                      onClick={() => removeItem(apply, setApply, i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className={styles.submitSection}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading
                ? isEdit
                  ? "Updating Job..."
                  : "Creating Job..."
                : isEdit
                ? "Update Job Posting"
                : "Create Job Posting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobAdd;