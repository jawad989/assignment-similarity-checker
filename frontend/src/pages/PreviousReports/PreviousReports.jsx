import { useEffect, useState } from "react"
import axios from "axios"
import { useStore } from "../../context/store"
import { useNavigate } from "react-router-dom"

const PreviousReports = () => {
  const navigate = useNavigate()
  const { user, logout } = useStore()
  const [reports, setReports] = useState([])
  const [expandedIndex, setExpandedIndex] = useState(-1)
  console.log(reports)

  const handleBackClick = () => {
    navigate("/home")
  }

  const handleItemClick = (index) => {
    if (index === expandedIndex) {
      setExpandedIndex(-1)
    } else {
      setExpandedIndex(index)
    }
  }

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/user/get-all-reports?user_id=${user.user_id}`
        )
        const fetchedReports = response.data.map((report) => ({
          ...report,
          createdAt: new Date(report.createdAt).toLocaleString()
        }))

        // Calculate overall similarity after fetching reports
        const updatedReports = fetchedReports.map((report) => {
          let sum = 0
          report.matchingFiles.forEach((item) => {
            sum += Number(item.similarity)
          })
          const overallSimilarity = sum > 100 ? 100 : sum
          return { ...report, overallSimilarity }
        })

        // Sort reports based on createdAt date
        const sortedReports = updatedReports.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt)
        })

        setReports(sortedReports)
      } catch (error) {
        console.error("Error fetching reports:", error)
      }
    }

    if (user) {
      fetchReports()
    } else {
      navigate("/")
    }
  }, [user, navigate])

  return (
    <div className='bg-gray-100 min-h-screen'>
      <div className='bg-charcoal text-white p-6 flex justify-between'>
        <h1 className='text-2xl font-bold'>Previous Reports</h1>
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
      <div className='p-6'>
        {reports.length === 0 ? (
          <p>No previous reports found.</p>
        ) : (
          reports.map((report, index) => (
            <div key={index} className='mb-4'>
              <p className='text-gray-500'>{report.createdAt}</p>
              <ul
                className='bg-gray-50 border cursor-pointer'
                onClick={() => handleItemClick(index)}
              >
                <li className='font-bold px-4 py-2'>
                  File: {report.file} -{" "}
                  <span className='text-red-500'>
                    Overall Similarity: {report.overallSimilarity}%
                  </span>
                </li>
                {expandedIndex === index && (
                  <ul className='ml-4'>
                    {report.matchingFiles.map((matchingFile, subIndex) => (
                      <li key={subIndex} className='py-1'>
                        Matching File: {matchingFile.file} - Similarity:{" "}
                        {matchingFile.similarity}%
                        <div className='mt-3 flex justify-around'>
                          <div>
                          <b>Content of {matchingFile.file}</b>
                            <pre className='bg-gray-100 p-2'>
                              {matchingFile.content}
                            </pre>
                          </div>
                          <div>
                            <b>Content of {report.file}</b>
                            <pre className='bg-gray-100 p-2'>
                              {report.content}
                            </pre>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </ul>
            </div>
          ))
        )}
        <button
          onClick={handleBackClick}
          type='button'
          className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 mt-4 ml-2'
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default PreviousReports
