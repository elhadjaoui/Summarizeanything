import { useState, useEffect } from 'react'
import { tick, loader, linkIcon, copy } from '../assets'
import { useLazyGetSummaryQuery } from '../services/article'



const Demo = () => {

  const [article, setArticle] = useState({
    url: '',
    summary: ''
  })
  const [allArticles, setAllArticles] = useState([]);
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
  const [copied, setCopied] = useState("");

  useEffect(() => {

    const articles = JSON.parse(localStorage.getItem('articles')) || [];
    setAllArticles(articles);
  }, [])
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const HandleSubmit = async (e) => {
    e.preventDefault()
    const { data } = await getSummary({ articleUrl: article.url });
    console.log("data", data);
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      setAllArticles(updatedAllArticles);
      setArticle(newArticle);

      // update state and local storage
    }
  }
  return (
    <section className=' w-full max-w-xl  mt-16'>
      {/*SEARCH*/}
      <div className=' flex flex-col w-full gap-2'>
        <form onSubmit={HandleSubmit} className='relative flex justify-center items-center'>
          <img src={linkIcon} alt="link" className='absolute left-0 my-2 ml-3 w-5' />
          <input type="url"
            required
            value={article.url}
            onChange={(e) => {
              const val = e.target.value
              console.log("val = ", val);
              setArticle({ ...article, url: val })
            }}
            placeholder='Enter a link to an article' className='url_input peer' />
          <button type='submit' className='submit_btn  peer-focus:border-gray-700 peer-focus:text-gray-700'>
            <p>↵</p>
          </button>
        </form>
        {/* Browse URL History */}
        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {
            allArticles.map((article, index) => (
              <div key={index}
                onClick={() => setArticle(article)}
                className='link_card'>
                <div onClick={() => { copyToClipboard(article.url) }} className='copy_btn'>
                  <img src={copied ? tick : copy} alt="copy_icon" className='object-contain w-[40%] h-[40%]' />
                </div>
                <p className='text-sm flex-1 truncate font-medium font-satoshi text-blue-700'>{article.url}</p>
              </div>
            ))}
        </div>
      </div>
      {/* Display Resuls */}
      <div className=' my-10 max-w-full flex justify-center items-center'>
        {isFetching ?
          (
            <img src={loader} alt="loader" className='w-20 h-20  object-contain' />
          )
          :
          (
            error ?
              (
                <p className='text-red-500 font-inter font-bold text-center'>Sorry Something Went Wrong
                  <br />
                  <span className='font-satoshi font-normal text-gray-700'>{error?.data.error}</span>
                </p>
              )
              :
              (
                article.summary && <div className='flex flex-col gap-2'>
                  <h2 className=' font-satoshi font-bold text-gray-700  text-xl'>
                    Article <span className='blue_gradient'>Summary</span>
                  </h2>
                  <div className='summary_box'>
                    <p className='text-sm font-medium font-satoshi text-gray-700'>{article.summary}</p>
                  </div>
                </div>
              )
          )
        }

      </div>




    </section>
  )
}
export default Demo