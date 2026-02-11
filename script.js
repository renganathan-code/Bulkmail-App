const fileInput = document.getElementById("fileInput")

fileInput.addEventListener("change",function(e)
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
        console.log(emailList);                
    }

    reader.readAsArrayBuffer(file)
})
