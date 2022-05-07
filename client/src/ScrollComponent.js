
import { useEffect,  useState, useRef, useLayoutEffect, useCallback } from 'react';
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import CircularProgress from '@material-ui/core/CircularProgress'

const ScrollComponent= ({mongoEventdatas, setMongodata})=>{
    useEffect(()=>{
        async function getter(){
          const response2 = await fetch('http://localhost:5000/events');
          const mongoEventdatas = await response2.json();
          setMongodata(mongoEventdatas);
          
        }
        getter();
},[]);



const generateItems =  () => {
    //  const arr = Array.from(Array(amount))
    //console.log(mongoEventdatas);
    return mongoEventdatas.map((info)=>(
      {
        from:info.from,
        to:info.to,
        tokenId:info.tokenId,
      }

    ))
  }


  const tableEl = useRef();
  const [rows, setRows] = useState(generateItems);
  const [loading, setLoading] = useState(true);
  const [distanceBottom, setDistanceBottom] = useState(0)

  const [hasMore] = useState(true)
  const loadMore = useCallback(() => {
    const loadItems = async () => {
      await new Promise(resolve =>
        setTimeout(() => {
          //const amount = rows.length + 50
          setRows(generateItems());
        //   const data = generateItems();
        //   console.log(data);
          // setLoading(false)
          resolve()
        }, 2000)
      )
    }
    loadItems()
}, [rows])

useEffect(()=>{
    // generateItems();
    setRows(generateItems());
    setLoading(false);

},[generateItems,rows,setRows]);
const scrollListener = useCallback(() => {
    let bottom = tableEl.current.scrollHeight - tableEl.current.clientHeight
    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    if (!distanceBottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round((bottom / 100) * 20))
    }
    if (tableEl.current.scrollTop > bottom - distanceBottom && hasMore && !loading) {
      loadMore()
    }
  }, [hasMore, loadMore, loading, distanceBottom])
  useLayoutEffect(() => {
    const tableRef = tableEl.current
    tableRef.addEventListener('scroll', scrollListener)
    return () => {
      tableRef.removeEventListener('scroll', scrollListener)
    }
  }, [scrollListener])
  return (
<TableContainer style={{ maxWidth: '1000px', marginLeft:'10px', maxHeight: '900px', color:'blue'}} ref={tableEl}>
      {loading && <CircularProgress style={{ position: 'absolute', top: '100px' }} />}
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>from</TableCell>
            <TableCell>to</TableCell>
            <TableCell>tokenId</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ from, to, tokenId }) => (
            <TableRow key={tokenId}>
              <TableCell>{from}</TableCell>
              <TableCell>{to}</TableCell>
              <TableCell>{tokenId}</TableCell>
            </TableRow>
            
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  

)
};

export default ScrollComponent;