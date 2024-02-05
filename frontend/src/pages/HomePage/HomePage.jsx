import { useEffect, useState } from "react"
import Dropzone from "react-dropzone"
import { useNavigate } from "react-router-dom"
import { useStore, useResultStore } from "../../context/store"
import axios from "axios"

function HomePage() {
  const [files, setFiles] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()
  const user = useStore((state) => state.user)
  const logout = useStore((state) => state.logout)
  const setResults = useResultStore((state) => state.setResults)
  const results = useResultStore((state) => state.results)
  const clearResults = useResultStore((state) => state.clearResults)

  const handleOnDrop = (acceptedFiles) => {
    const fileNamePattern = /^(sp\d{2}-\w{3}-\d{3}|fa\d{2}-\w{3}-\d{3})$/i

    const filteredFiles = acceptedFiles.filter((file) => {
      const fileNameWithoutExtension = file.name
        .split(".")
        .slice(0, -1)
        .join(".")
      return fileNamePattern.test(fileNameWithoutExtension)
    })

    if (filteredFiles.length !== acceptedFiles.length) {
      const invalidFiles = acceptedFiles.filter(
        (file) => !filteredFiles.includes(file)
      )
      const invalidFileNames = invalidFiles.map((file) => file.name).join(", ")
      setErrorMessage(
        `Invalid file(s) selected. Please select files with names following the pattern like 'SP20-BCS-001', 'FA21-XYZ-123'. Invalid file(s): ${invalidFileNames}`
      )
      setFiles(null)
    } else {
      const mappedFiles = acceptedFiles.map((file) => ({
        file: file,
        name: file.name,
      }))
      setFiles(mappedFiles)
      setErrorMessage("")
    }
  }

  const handleUpload = async () => {
    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i].file)
      }

      const response = await axios.post(
        "http://localhost:4000/fileUpload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      const res = response.data
      console.log(res)
      setResults(res)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/")
    }
    if (files) {
      handleUpload()
    }
    clearResults()
  }, [user, files])

  return (
    <>
      <div className='bg-charcoal text-white p-6 flex justify-between'>
        <h1 className='text-2xl font-bold'>Assignment Similarity Checker</h1>
        <div className='flex gap-2 items-center justify-center'>
          <p>{user?.email}</p>
          <button
            className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700'
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className='flex gap-2 mt-2 mx-2 '>
        <section className='flex-[2]'>
          <p className='p-2'>Upload your files to check for plagiarism</p>
          <form onSubmit={handleUpload}>
            <Dropzone onDrop={handleOnDrop}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div
                    {...getRootProps()}
                    className='p-16 border-dashed border-4 cursor-pointer'
                  >
                    <input {...getInputProps()} />
                    <p className='text-center'>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </form>

          <button
            onClick={() => navigate("/previous-reports")}
            type='button'
            className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 mt-4'
          >
            Show Previous Reports
          </button>

          {results && (
            <button
              onClick={() => navigate("/results")}
              type='button'
              className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 mt-4'
            >
              Show Results
            </button>
          )}
        </section>

        <div className='flex-1'>
          {files && <p className='p-2'>Selected files</p>}
          {files &&
            files.map((file, index) => (
              <div key={index} className='shadow-md border-2 p-2'>
                <span>{file.name}</span>
              </div>
            ))}
          {errorMessage && <p className='text-red-600 mt-2'>{errorMessage}</p>}
        </div>
      </div>
    </>
  )
}

export default HomePage
