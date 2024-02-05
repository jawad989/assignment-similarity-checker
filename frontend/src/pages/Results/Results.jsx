import { useEffect, useState } from "react"
import { useResultStore, useStore } from "../../context/store"
import { useNavigate } from "react-router-dom"
import axios from "axios"


const ContentRenderer = ({ content, matchingWords }) => {
  const lines = content.split('\n');

  return (
    <div className="word-by-word">
      {lines.map((line, lineIndex) => (
        <div key={lineIndex}>
          {line.split(' ').map((word, wordIndex) => {
            const isMatching = matchingWords.includes(word.trim());
            const style = isMatching ? { color: 'red' } : {};

            return (
              <span key={`${word}-${wordIndex}`} style={style}>
                {word}&nbsp;
              </span>
            );
          })}
          <br />
        </div>
      ))}
    </div>
  );
};



const Results = () => {
  const results = useResultStore((state) => state.results)
  const clearResults = useResultStore((state) => state.clearResults)
  const [notification, setNotification] = useState(null)
  const { user, logout } = useStore()
  const [expandedItems, setExpandedItems] = useState([])
  const [sums, setSums] = useState([])
  const navigate = useNavigate()

  const [expandedContentItems, setExpandedContentItems] = useState([])

  const toggleContentItem = (resultIndex, itemIndex) => {
    const newExpandedContentItems = [...expandedContentItems]
    if (!newExpandedContentItems[resultIndex]) {
      newExpandedContentItems[resultIndex] = []
    }
    newExpandedContentItems[resultIndex][itemIndex] =
      !newExpandedContentItems[resultIndex][itemIndex]
    setExpandedContentItems(newExpandedContentItems)
  }

  const toggleItem = (index) => {
    const newExpandedItems = [...expandedItems]
    newExpandedItems[index] = !newExpandedItems[index]
    setExpandedItems(newExpandedItems)
  }

  const handleBackClick = () => {
    clearResults()
    navigate("/home")
  }

  const handleSaveReport = async () => {
    const response = await axios.post(
      "http://localhost:4000/api/user/save-report",
      {
        report: results,
        user_id: user.user_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    console.log(response)
    if (response.status === 200) {
      setNotification(response.data.message)
    }
  }

  const calculateSum = () => {
    const uniqueSums = results.map((result) => {
      const uniqueSimilarities = new Set();
      let totalSimilarity = 0;
  
      result.matchingFiles.forEach((item) => {
        const similarity = Number(item.similarity);
        if (!uniqueSimilarities.has(similarity)) {
          uniqueSimilarities.add(similarity);
          totalSimilarity += similarity;
        }
      });
  
      return totalSimilarity > 100 ? 100 : totalSimilarity.toFixed(1);
    });
  
    setSums(uniqueSums);
  };
  

  useEffect(() => {
    if (results) {
      calculateSum()
    }
    if (!user) {
      navigate("/")
    }
    if (!results) {
      navigate("/home")
    }
  }, [results, user])

  return (
    <div>
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

      <h1 className='text-3xl px-2 mb-2'>Results</h1>

      {results &&
        results.map((result, index) => (
          <div key={index} className='bg-gray-50 hover:bg-white'>
            <div className='p-2 border'>
              <button onClick={() => toggleItem(index)}>
                Found plagiarism in{" "}
                <span className='font-bold'>{result.file}</span> -{" "}
                <span className='text-red-500'>
                  Overall Similarity: {sums[index]}%
                </span>
              </button>

              {expandedItems[index] && (
                <div className='font-semibold mt-2'>
                  <ul>
                    {result?.matchingFiles.map((item, itemIndex) => (
                      <li className='ml-5' key={itemIndex}>
                        <button
                          onClick={() => toggleContentItem(index, itemIndex)}
                        >
                          {item?.file} with similarity of {item.similarity}%
                        </button>
                        {expandedContentItems[index] &&
                          expandedContentItems[index][itemIndex] && (
                            <div>
                              <div className='mt-3 flex justify-around'>
                                <div>
                                  <p>Content of {item.file}:</p>
                                  <pre className='bg-gray-100 p-2'>
                                    <ContentRenderer
                                      content={item.content} matchingWords={item.matchingWords}
                                    />
                                  </pre>
                                </div>
                                <div>
                                  <p>Content of {result.file}:</p>
                                  <pre className='bg-gray-100 p-2'>
                                    <ContentRenderer
                                      content={result.content} matchingWords={item.matchingWords}
                                    />
                                  </pre>
                                </div>
                              </div>
                            </div>
                          )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

      <button
        onClick={handleBackClick}
        type='button'
        className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 mt-4 ml-2'
      >
        Back
      </button>
      <button
        onClick={handleSaveReport}
        type='button'
        className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ml-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 mt-4'
      >
        Save Report
      </button>

      {notification && (
        <div
          className='flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3'
          role='alert'
        >
          <svg
            className='fill-current w-4 h-4 mr-2'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
          >
            <path d='M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z' />
          </svg>
          <p>{notification}</p>
        </div>
      )}
    </div>
  )
}
export default Results
