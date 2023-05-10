import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import headerStyles from "./header.module.css"
import tableStyles from "./table.module.css"

export default function Home() {
  const [typeInput, setTypeInput] = useState("");
  const [specialityInput, setSpecialityInput] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [requirementsInput, setRequirementsInput] = useState("");
  const [result, setResult] = useState();
  const [tableRows, setTableRows] = useState([]);
  const [numPages, setNumPages] = useState(1);
  const [price, setPrice] = useState(70);
  const [dateDeadlineInput, setDateDeadlineInput] = useState("");
  const [timeDeadlineInput, setTimeDeadlineInput] = useState("");
  
  function handleNumPagesBlur(event) {
    const value = event.target.value;
    const numPages = parseInt(value);
    if (numPages > 0) {
      setNumPages(numPages);
      setPrice(numPages * 70);
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const newRow = {
        topic: topicInput,
        status: "In Progress",
        downloadUrl: null,
        date_deadline: dateDeadlineInput,
        time_deadline: timeDeadlineInput,
      };
      setTableRows([...tableRows, newRow]);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          type: typeInput, 
          speciality: specialityInput, 
          topic: topicInput, 
          requirements: requirementsInput,
          date_deadline: dateDeadlineInput,
          time_deadline: timeDeadlineInput,
         }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      const now = new Date();
      const deadline = new Date(`${dateDeadlineInput}T${timeDeadlineInput}`);
      const timeUntilDeadline = deadline - now;
      if (timeUntilDeadline > 0) {
        setTimeout(() => {
          const updatedRow = {
            ...newRow,
            status: "Done",
            downloadUrl: URL.createObjectURL(new Blob([`Topic: ${topicInput}\n\nRequirements: ${requirementsInput}\n\nGenerated ${typeInput}:\n\n`, data.result], { type: "text/plain;charset=utf-8" }))
          };
          const rowIndex = tableRows.findIndex((row) => row.topic === updatedRow.topic);
          setTableRows([...tableRows.slice(0, rowIndex), updatedRow, ...tableRows.slice(rowIndex + 1)]);
        }, timeUntilDeadline);
      } else {
        const updatedRow = {
          ...newRow,
          status: "Done",
          downloadUrl: URL.createObjectURL(new Blob([`Topic: ${topicInput}\n\nRequirements: ${requirementsInput}\n\nGenerated ${typeInput}:\n\n`, data.result], { type: "text/plain;charset=utf-8" }))
        };
        const rowIndex = tableRows.findIndex((row) => row.topic === updatedRow.topic);
        setTableRows([...tableRows.slice(0, rowIndex), updatedRow, ...tableRows.slice(rowIndex + 1)]);
      }

      setResult(data.result);
      setTypeInput("");
      setSpecialityInput("");
      setTopicInput("");
      setRequirementsInput("");
      setNumPages("");
      setTimeDeadlineInput
      setDateDeadlineInput("");
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>DOCU</title>
        <link rel="icon" href="/papers.png"/>
      </Head>
      <header className={headerStyles.header}>
        <div className={headerStyles.logo}>
          <span>DOCU</span>
        </div>
        <nav className={headerStyles.nav}>
        <ul className={headerStyles.navList}>
          <input type="submit" value="Upgrate To Plus" style={{width: "80%",  marginRight: "5px"}}/>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
          <input type="submit" value="Log in" style={{width: "80%",  marginRight: "5px"}}/>
          <input type="submit" value="Sign up" style={{width: "80%",  marginRight: "5px"}}/>
        </ul>
      </nav>
      </header>
      <main className={styles.main}>
        <form onSubmit={onSubmit}>
        <h3>Order documentation</h3>
          <input
            type="text"
            name="type"
            placeholder="Enter a type of work"
            value={typeInput}
            onChange={(e) => setTypeInput(e.target.value)}
          />
          <input
            type="text"
            name="speciality"
            placeholder="Enter a speciality of work"
            value={specialityInput}
            onChange={(e) => setSpecialityInput(e.target.value)}
          />
          <input
            type="text"
            name="topic"
            placeholder="Enter a topic"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
          />
          <input
            type="text"
            name="requirements"
            placeholder="Enter requirements"
            value={requirementsInput}
            onChange={(e) => setRequirementsInput(e.target.value)}
          />
          <div className="form-row">
            <input 
              type="number" 
              id="num-pages" 
              name="num-pages" 
              min="1" max="100" 
              placeholder="Pages" 
              style={{width: "20%",  marginRight: "10px"}} 
              required 
              onBlur={handleNumPagesBlur}
            />
            <input 
              type="time" 
              id="time-deadline" 
              name="time-deadline" 
              placeholder="Time" 
              style= {{width: "20%",  marginRight: "10px", color: "#8e8ea0"}} 
              onChange={(e) => setTimeDeadlineInput(e.target.value)}
              required
            />
            <input 
              type="date" 
              id="date-deadline" 
              name="date-deadline" 
              placeholder="Date" 
              style= {{width: "29%", color: "#8e8ea0"}} 
              onChange={(e) => setDateDeadlineInput(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <input type="submit" value="Generate" style={{width: "80%",  marginRight: "5px"}}/>
            <input type="text" id="price" name="price" placeholder="Price" style= {{width: "10%", color: "#326199"}} required value={price+"$"} readOnly/>
          </div>
        </form>
        <form className={styles.main.form} style={{ backgroundColor: "#ffffff7c", width: "50%", height: "520px", marginRight: "20px", overflowY: "scroll" }}>
          <h3>My orders</h3>
          <table className={tableStyles.table}>
            <thead className={tableStyles.thead}>
              <tr style={{alignItems: "center"}}>
                <th>Topic</th>
                <th>Status</th>
                <th>File</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody className={tableStyles.tbody} style={{borderRadius: "20%", backgroundColor: "#ffff"}}>
              {tableRows.map((row, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f6f6f6" : "#ffffff" }}>
                <td>{row.topic}</td>
                <td style={{ backgroundColor: row.status === "Done" ? "#83f15fae" : "#ffec6e" }}>{row.status}</td>
                <td>
                  {row.downloadUrl ? (
                    <a href={row.downloadUrl} download="generated_text.txt">
                      Download
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{row.date_deadline}</td>
                <td>{row.time_deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </form>
      </main>
    </div>
  );
}
