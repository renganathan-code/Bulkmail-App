import { useState } from "react"
import axios from "axios";
import * as XLSX from "xlsx";


function App() {

  const [msg,setmsg] = useState("")
  const [status,setstatus] = useState(false)
  const [emailList,setEmailList] = useState([])

  function handlemsg(e)
  {
    setmsg(e.target.value)
  }

  function handleEmail(e)
  {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = function(e)
    {
        const arrayBuffer = e.target.result;
        
        const data = new Uint8Array(arrayBuffer)

        const workbook = XLSX.read(data,{type:'array'})
        const sheetName = workbook.SheetNames[0];
        const workSheet = workbook.Sheets[sheetName]
        const emailList = XLSX.utils.sheet_to_json(workSheet,{header:'A'})
        const totalEmail = emailList
        .map(function(item){return item.A})
        .filter(email => email && email.includes("@"))
        setEmailList(totalEmail)
    }

    reader.readAsArrayBuffer(file)
  }

  function send()
  {
    if(emailList.length === 0)
    {
      alert("Please upload an email file first");
      return;
    }

    setstatus(true)
    axios.post("https://bulkmail-app-dctd.onrender.com/sendemail", {msg:msg,emails:emailList})
    .then(function(data)
  {
    console.log(data.data);
    
    if(data.data === true)
    {
      alert("Email sent Successfully")
      setstatus(false)
    }
    else{
      alert("Email sent Failed")
      setstatus(false)
    }
  }).catch(function(error){
    console.log("AXIOS ERROR:", error);
    alert("Server Error. Check console.");
  })
  }


  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4
                bg-gradient-to-br from-green-200 via-green-300 to-green-400">

        <div  className="w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 mx-auto">

          <div className="text-center">
            <h1 className="text-3xl font-semibold mt-4 mb-2 text-gray-800">Bulkmail</h1>
          </div>
          
          <div className="text-center">
            <h1 className="font-medium p-4 text-gray-700">A bulk mail application that sends messages to multiple email addresses with a single click.</h1>
          </div>
          
          <div className="flex flex-col items-center text-center text-black px-5 py-7">
            <textarea
            onChange={handlemsg}
            value={msg}
            className="bg-gray-100 w-full h-36 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the Email text..."
            />
            
            <div className="w-full py-5">
              <div
              className="border-4 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleEmail({ target: { files: e.dataTransfer.files } });
              }}
              onClick={() => document.getElementById("fileInput").click()}
              >
                <p className="text-gray-600 font-medium">Drag & drop email file here</p>
                <p className="text-sm text-gray-400">or click to upload</p>
                
              <input
              id="fileInput"
              type="file"
              onChange={handleEmail}
              className="hidden"/>
            </div>
          </div>
          
          <p className="text-gray-600">
            Total emails in the file : {emailList.length}
          </p>
          
          <button
          onClick={send}
          className="w-[80%] py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-3"
          >
          {status ? "Sending..." : "Send"}
          </button>
          </div>
        </div>
        
      </div>
    </>
  )
}

export default App