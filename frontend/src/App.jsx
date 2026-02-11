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

        const workbook = XLSX.read(data,{typeof:'array'})
        const sheetName = workbook.SheetNames[0];
        const workSheet = workbook.Sheets[sheetName]
        const emailList = XLSX.utils.sheet_to_json(workSheet,{header:'A'})
        const totalEmail = emailList.map(function(item){return item.A})
        console.log(totalEmail);
        setEmailList(totalEmail)
    }

    reader.readAsArrayBuffer(file)
  }

  function send()
  {
    setstatus(true)
    axios.post("https://bulkmail-app-dctd.onrender.com/sendemail",{msg:msg,emails:emailList})
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
  })
  }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4
                bg-gradient-to-br from-green-200 via-green-300 to-green-400">

        <div  className="w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 mx-auto">

          <div className="text-center">
            <h1 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Bulkmail</h1>
          </div>
          
          <div className="text-center">
            <h1 className="font-medium p-4 text-gray-700">We can help your business with sending multiple emails at once</h1>
          </div>
          
          <div className="text-center">
            <h1 className="font-medium p-1 text-gray-700">Drag and Drop</h1>
          </div>
          
          <div className="flex flex-col items-center text-center text-black px-5 py-7">
            <textarea onChange={handlemsg} value={msg} className="bg-gray-100 w-full h-28 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter the Email text..."></textarea>
            
            <div className="text-center py-5">
              <input type="file" onChange={handleEmail} className="border-4 border-dashed p-3" />
            </div>
            
            <p className="text-gray-600">Total emails in the file : {emailList.length}</p>
            
            <button onClick={send} className=" w-[80%] py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-3">{status?"sending":"send"}</button>
          </div>

        </div>
        
      </div>
    </>
  )
}

export default App
