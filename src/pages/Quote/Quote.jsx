import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import leftArrow from "../../assets/svg/leftArrow.svg";
import rightArrow from "../../assets/svg/rightArrow.svg";
import { dateFormat } from "../../components/Functions/Date";
import Loading from "../../components/Hooks/Loading";
import axios from "../../components/Hooks/axios";
import { useDeleteAlert } from "../../components/Hooks/useDeleteAlert";
import styles from './Quote.module.scss'

function Quote() {
    const [selectedCategory, setSelectedCategory] = useState("contact");
    const [applications, setApplications] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState({ totalCount: 0, totalPages: 1 });
    const [reload, setReload] = useState(0);
    const [loading, setLoading] = useState(true);
     const [activeTab, setActiveTab] = useState("schedule");
    
    useEffect(() => {
		setLoading(true);
		axios
			.get(`contact_hire/allContact_hire?type=${selectedCategory}`)
			.then(({ data }) => {
				setApplications(data.data);
				setTotal({ totalCount: data.totalCount, totalPages: data.totalPages });
				setLoading(false);
			})
			.catch((e) => console.log(e));
	}, [page, reload, selectedCategory]);

    const handelDelete = async (id) => {
		const confirmed = await useDeleteAlert();
		if (!confirmed) return;

		axios
			.delete(`/contact_hire/delete/${id}`)
			.then(({ data }) => {
				toast.success("Successfully Deleted !");
				setReload(Math.random());
			})
			.catch((e) => console.log(e));
	};

  return (
      <div className={styles.AdmissionForms}>
          <h1>Quotation Request</h1>

          <div className={styles.ContentWrapper}>
                  <div className={styles.heading}>
                    <div className={styles.ButtonWrapper}>
                    <button
  onClick={() => setActiveTab("schedule")}
  className={activeTab === "schedule" ? styles.active : ""}
>
  Schedule Call
</button>

<button
  onClick={() => setActiveTab("connect")}
  className={activeTab === "connect" ? styles.active : ""}
>
  Let's Connect
</button>

<button
  onClick={() => setActiveTab("quote")}
  className={activeTab === "quote" ? styles.active : ""}
>
  Get Quote
</button>

                      <button className={styles.refresh} onClick={() => setReload(Math.random())}>
                        Refresh
                      </button>
                    </div>
                  </div>
                  <div className={styles.subHeading}>
                  <div className={styles.userId}>Sl.No</div>
                  <div className={styles.Name}>Name</div>
                  <div className={styles.Email}>Email</div>
                  <div className={styles.Phone}>Phone</div>
                  {/* <div className={styles.Skills}>Skills</div> */}
                  <div className={styles.Description}>Description</div>
                  <div className={styles.Date}>Date</div>
                  <div className={styles.Actions}>Actions</div>
                </div>


                {/* <div className={styles.supportCards}>
					{loading ? (
						<Loading height="10rem" width="10rem" />
					) : (
						applications
						.filter(item => item.skills && item.skills == "notavailable")
						.map((item, index) => (
							<div className={styles.ApplicationCard} key={index}>
								<div className={styles.userId}>{index + 1}</div>
								<div className={styles.Name}>{item?.name}</div>
								<div className={styles.Email}>{item?.email}</div>
								<div className={styles.Phone}>{item?.phone}</div>
								<div className={styles.Skills}>{item?.skills}</div>
								<div className={styles.Description}>{item?.writeSomething}</div>
								<div className={styles.Date}>{dateFormat(item?.createdAt)}</div>
								<div className={styles.Actions}>
									<p onClick={() => handelDelete(item._id)}>
										<FaTrashAlt />
									</p>
								</div>
							</div>
						))
					)}
			        	</div> */}

      {activeTab === "schedule" && (
  <div className={styles.supportCards}>
    {loading ? (
      <Loading height="10rem" width="10rem" />
    ) : (
      applications
        .filter(item => item.skills && item.skills === "ScheduleCall")
        .map((item, index) => (
          <div className={styles.ApplicationCard} key={index}>
            <div className={styles.userId}>{index + 1}</div>
            <div className={styles.Name}>{item?.name}</div>
            <div className={styles.Email}>{item?.email}</div>
            <div className={styles.Phone}>{item?.phone}</div>
            {/* <div className={styles.Skills}>{item?.skills}</div> */}
            <div className={styles.Description}>{item?.writeSomething}</div>
            <div className={styles.Date}>{dateFormat(item?.createdAt)}</div>
            <div className={styles.Actions}>
              <p onClick={() => handelDelete(item._id)}>
                <FaTrashAlt />
              </p>
            </div>
          </div>
        ))
    )}
  </div>
)}
      {activeTab === "connect" && (
  <div className={styles.supportCards}>
    {loading ? (
      <Loading height="10rem" width="10rem" />
    ) : (
      applications
        .filter(item => item.skills && item.skills === "letsconnect")
        .map((item, index) => (
          <div className={styles.ApplicationCard} key={index}>
            <div className={styles.userId}>{index + 1}</div>
            <div className={styles.Name}>{item?.name}</div>
            <div className={styles.Email}>{item?.email}</div>
            <div className={styles.Phone}>{item?.phone}</div>
            {/* <div className={styles.Skills}>{item?.skills}</div> */}
            <div className={styles.Description}>{item?.writeSomething}</div>
            <div className={styles.Date}>{dateFormat(item?.createdAt)}</div>
            <div className={styles.Actions}>
              <p onClick={() => handelDelete(item._id)}>
                <FaTrashAlt />
              </p>
            </div>
          </div>
        ))
    )}
  </div>
)}

      {activeTab === "quote" && (
  <div className={styles.supportCards}>
    {loading ? (
      <Loading height="10rem" width="10rem" />
    ) : (
      applications
        .filter(item => item.skills && item.skills === "notavailable")
        .map((item, index) => (
          <div className={styles.ApplicationCard} key={index}>
            <div className={styles.userId}>{index + 1}</div>
            <div className={styles.Name}>{item?.name}</div>
            <div className={styles.Email}>{item?.email}</div>
            <div className={styles.Phone}>{item?.phone}</div>
            {/* <div className={styles.Skills}>{item?.skills}</div> */}
            <div className={styles.Description}>{item?.writeSomething}</div>
            <div className={styles.Date}>{dateFormat(item?.createdAt)}</div>
            <div className={styles.Actions}>
              <p onClick={() => handelDelete(item._id)}>
                <FaTrashAlt />
              </p>
            </div>
          </div>
        ))
    )}
  </div>
)}

        <div className={styles.pagination}>
                  <div className={styles.records}>{`Showing 10 of ${total.totalCount} users in ${page} page`}</div>
                  <div className={styles.pageButtons}>
                    <button
                      className={styles.leftArrow}
                      disabled={page === 1}
                      onClick={() => {
                        setSelectedCategory("all");
                        setPage(page - 1);
                      }}>
                      {page > 1 && <img src={leftArrow} alt="" />}
                    </button>
        
                    <div className={styles.pages}>
                      <div className={`${styles.buttons} ${styles.active}`}>{page}</div>
                    </div>
        
                    <button
                      className={styles.rightArrow}
                      disabled={page === total.totalPages}
                      onClick={() => {
                        setSelectedCategory("all");
                        setPage(page + 1);
                      }}>
                      {total.totalPages === page ? "" : <img src={rightArrow} alt="" />}
                    </button>
                  </div>
                </div>
</div>
        

    </div>
  )
}

export default Quote